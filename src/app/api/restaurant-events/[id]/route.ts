import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await prisma.restaurantEvent.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      status, notes, specialRequests, addItem, removeItemId,
      name, guestName, guestContact, guestEmail, eventType,
      eventDate, startTime, endTime, partySize,
    } = body;

    if (removeItemId) {
      await prisma.restaurantEventItem.delete({ where: { id: removeItemId } });
      const updated = await prisma.restaurantEvent.findUnique({ where: { id }, include: { items: true } });
      return NextResponse.json(updated);
    }

    if (addItem) {
      const { description, quantity, unitPrice } = addItem;
      const qty = parseInt(quantity) || 1;
      const price = parseFloat(unitPrice) || 0;
      await prisma.restaurantEventItem.create({
        data: {
          eventId: id,
          description,
          quantity: qty,
          unitPrice: price,
          totalPrice: qty * price,
        },
      });
      const updated = await prisma.restaurantEvent.findUnique({ where: { id }, include: { items: true } });
      return NextResponse.json(updated);
    }

    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;
    if (specialRequests !== undefined) data.specialRequests = specialRequests;
    if (name !== undefined) data.name = name;
    if (guestName !== undefined) data.guestName = guestName;
    if (guestContact !== undefined) data.guestContact = guestContact;
    if (guestEmail !== undefined) data.guestEmail = guestEmail;
    if (eventType !== undefined) data.eventType = eventType;
    if (eventDate !== undefined) data.eventDate = new Date(eventDate);
    if (startTime !== undefined) data.startTime = new Date(startTime);
    if (endTime !== undefined) data.endTime = endTime ? new Date(endTime) : null;
    if (partySize !== undefined) data.partySize = parseInt(partySize);

    const updated = await prisma.restaurantEvent.update({
      where: { id },
      data,
      include: { items: true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.restaurantEvent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
