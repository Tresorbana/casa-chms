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

    const itemsTotal = booking.items.reduce((sum, i) => sum + i.totalPrice, 0);
    const venueTotal = booking.totalAmount;
    const grandTotal = venueTotal + itemsTotal;

    const invoiceItems = [
      {
        description: `${booking.conferenceRoom.name} — ${
          booking.bookingType === 'DAILY' ? 'Daily rate' : 'Hourly rate'
        }`,
        quantity: 1,
        price: venueTotal,
      },
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
