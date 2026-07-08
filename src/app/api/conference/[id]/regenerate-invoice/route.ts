import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const booking = await prisma.conferenceBooking.findUnique({
      where: { id },
      include: { conferenceRoom: true, items: true },
    });

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Delete old invoice if exists
    if (booking.invoiceId) {
      await prisma.invoiceItem.deleteMany({ where: { invoiceId: booking.invoiceId } });
      await prisma.invoice.delete({ where: { id: booking.invoiceId } });
      await prisma.conferenceBooking.update({ where: { id }, data: { invoiceId: null } });
    }

    const linkedHotelBookings = booking.linkedBookingIds.length > 0
      ? await prisma.booking.findMany({
          where: { id: { in: booking.linkedBookingIds } },
          include: { room: true },
        })
      : [];

    const venueTotal = booking.totalAmount;
    const itemsTotal = booking.items.reduce((sum, i) => sum + i.totalPrice, 0);

    const roomLineItems: { description: string; quantity: number; price: number }[] = [];
    let roomsTotal = 0;

    for (const lb of linkedHotelBookings) {
      const nights = Math.max(
        1,
        Math.ceil((new Date(lb.checkOut).getTime() - new Date(lb.checkIn).getTime()) / 86400000)
      );
      const roomTotal = lb.room.price * nights;
      roomsTotal += roomTotal;
      roomLineItems.push({
        description: `Room ${lb.room.number} (${lb.room.type}) — ${nights} night${nights !== 1 ? 's' : ''}`,
        quantity: nights,
        price: lb.room.price,
      });
    }

    const grandTotal = venueTotal + roomsTotal + itemsTotal;

    const invoiceItems = [
      {
        description: `${booking.conferenceRoom.name} — ${booking.bookingType === 'DAILY' ? 'Daily rate' : 'Hourly rate'}`,
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
        date: new Date(booking.startTime),
        items: { create: invoiceItems },
      },
      include: { items: true },
    });

    await prisma.conferenceBooking.update({
      where: { id },
      data: { invoiceId: invoice.id, status: 'INVOICED' },
    });

    return NextResponse.json({ invoiceId: invoice.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to regenerate invoice' }, { status: 500 });
  }
}
