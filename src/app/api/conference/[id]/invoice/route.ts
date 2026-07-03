import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const booking = await prisma.conferenceBooking.findUnique({
      where: { id: params.id },
      include: { conferenceRoom: true, items: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Fetch linked hotel room bookings so we can include their costs
    const linkedHotelBookings = booking.linkedBookingIds.length > 0
      ? await prisma.booking.findMany({
          where: { id: { in: booking.linkedBookingIds } },
          include: { room: true },
        })
      : [];

    const venueTotal = booking.totalAmount;
    const itemsTotal = booking.items.reduce((sum, i) => sum + i.totalPrice, 0);

    // Calculate room cost: room.price × nights for each linked hotel booking
    const roomLineItems: { description: string; quantity: number; price: number }[] = [];
    let roomsTotal = 0;
    const roomAmountUpdates: Array<{ id: string; totalAmount: number }> = [];

    for (const lb of linkedHotelBookings) {
      const nights = Math.max(
        1,
        Math.ceil((new Date(lb.checkOut).getTime() - new Date(lb.checkIn).getTime()) / 86400000)
      );
      const roomTotal = lb.room.price * nights;
      roomsTotal += roomTotal;
      roomAmountUpdates.push({ id: lb.id, totalAmount: roomTotal });
      roomLineItems.push({
        description: `Room ${lb.room.number} (${lb.room.type}) — ${nights} night${nights !== 1 ? 's' : ''}`,
        quantity: nights,
        price: lb.room.price,
      });
    }

    const grandTotal = venueTotal + roomsTotal + itemsTotal;

    const invoiceItems = [
      {
        description: `${booking.conferenceRoom.name} — ${
          booking.bookingType === 'DAILY' ? 'Daily rate' : 'Hourly rate'
        }`,
        quantity: 1,
        price: venueTotal,
      },
      ...roomLineItems,
      ...booking.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
    ];

    const invoice = await prisma.invoice.create({
      data: {
        guestName: booking.guestName,
        amount: grandTotal,
        type: 'CONFERENCE',
        items: { create: invoiceItems },
      },
      include: { items: true },
    });

    // Update linked hotel bookings' totalAmount now that we've computed it
    await Promise.all(
      roomAmountUpdates.map(({ id, totalAmount }) =>
        prisma.booking.update({ where: { id }, data: { totalAmount } })
      )
    );

    // Link the invoice back to the conference booking
    await prisma.conferenceBooking.update({
      where: { id: params.id },
      data: { invoiceId: invoice.id, status: 'INVOICED' },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const booking = await prisma.conferenceBooking.findUnique({
      where: { id: params.id },
      select: { invoiceId: true },
    });

    if (!booking?.invoiceId) {
      return NextResponse.json({ invoiceId: null });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: booking.invoiceId },
      include: { items: true },
    });

    return NextResponse.json(invoice);
  } catch {
    return NextResponse.json({ error: 'Failed to get invoice' }, { status: 500 });
  }
}
