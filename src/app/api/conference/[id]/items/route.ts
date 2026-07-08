import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const items = await prisma.conferenceBookingItem.findMany({
      where: { conferenceBookingId: params.id },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const body = await request.json();
    const { description, quantity, unitPrice } = body;

    const item = await prisma.conferenceBookingItem.create({
      data: {
        conferenceBookingId: params.id,
        description,
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        totalPrice: parseInt(quantity) * parseFloat(unitPrice),
      },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    if (!itemId) return NextResponse.json({ error: 'itemId required' }, { status: 400 });

    const body = await request.json();
    const { description, quantity, unitPrice } = body;

    const existing = await prisma.conferenceBookingItem.findUnique({ where: { id: itemId } });
    if (!existing) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    const newQty = quantity !== undefined ? parseInt(quantity) : existing.quantity;
    const newUnitPrice = unitPrice !== undefined ? parseFloat(unitPrice) : existing.unitPrice;
    const newTotalPrice = newQty * newUnitPrice;
    const oldTotalPrice = existing.totalPrice;

    const item = await prisma.conferenceBookingItem.update({
      where: { id: itemId },
      data: {
        ...(description !== undefined && { description }),
        quantity: newQty,
        unitPrice: newUnitPrice,
        totalPrice: newTotalPrice,
      },
    });

    // If the booking has an invoice, sync the matching invoice item and total
    const booking = await prisma.conferenceBooking.findUnique({
      where: { id: params.id },
      select: { invoiceId: true },
    });

    if (booking?.invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: booking.invoiceId },
        include: { items: true },
      });
      if (invoice) {
        const invoiceItem = invoice.items.find((i) => i.description === existing.description);
        if (invoiceItem) {
          await prisma.invoiceItem.update({
            where: { id: invoiceItem.id },
            data: {
              ...(description !== undefined && { description }),
              quantity: newQty,
              price: newUnitPrice,
            },
          });
        }
        await prisma.invoice.update({
          where: { id: booking.invoiceId },
          data: { amount: invoice.amount - oldTotalPrice + newTotalPrice },
        });
      }
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'itemId required' }, { status: 400 });
    }

    await prisma.conferenceBookingItem.delete({ where: { id: itemId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
