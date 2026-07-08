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
      const removedItem = await prisma.restaurantEventItem.findUnique({ where: { id: removeItemId } });
      await prisma.restaurantEventItem.delete({ where: { id: removeItemId } });

      // Sync invoice if event is finalized
      const eventForRemove = await prisma.restaurantEvent.findUnique({ where: { id }, select: { invoiceId: true } });
      if (eventForRemove?.invoiceId && removedItem) {
        const invoice = await prisma.invoice.findUnique({
          where: { id: eventForRemove.invoiceId },
          include: { items: true },
        });
        if (invoice) {
          const invoiceItem = invoice.items.find((i) => i.description === removedItem.description);
          if (invoiceItem) {
            await prisma.invoiceItem.delete({ where: { id: invoiceItem.id } });
          }
          await prisma.invoice.update({
            where: { id: eventForRemove.invoiceId },
            data: { amount: Math.max(0, invoice.amount - removedItem.totalPrice) },
          });
        }
      }

      const updated = await prisma.restaurantEvent.findUnique({ where: { id }, include: { items: true } });
      return NextResponse.json(updated);
    }

    if (body.editItem) {
      const { itemId, description, quantity, unitPrice } = body.editItem;
      const qty = parseInt(quantity) || 1;
      const price = parseFloat(unitPrice) || 0;

      const existingItem = await prisma.restaurantEventItem.findUnique({ where: { id: itemId } });
      const oldTotal = existingItem?.totalPrice ?? 0;
      const newTotal = qty * price;

      await prisma.restaurantEventItem.update({
        where: { id: itemId },
        data: {
          ...(description !== undefined && { description }),
          quantity: qty,
          unitPrice: price,
          totalPrice: newTotal,
        },
      });

      // Sync the linked invoice if the event is already finalized
      const event = await prisma.restaurantEvent.findUnique({ where: { id }, select: { invoiceId: true } });
      if (event?.invoiceId) {
        const invoice = await prisma.invoice.findUnique({
          where: { id: event.invoiceId },
          include: { items: true },
        });
        if (invoice && existingItem) {
          const invoiceItem = invoice.items.find((i) => i.description === existingItem.description);
          if (invoiceItem) {
            await prisma.invoiceItem.update({
              where: { id: invoiceItem.id },
              data: {
                ...(description !== undefined && { description }),
                quantity: qty,
                price,
              },
            });
          }
          await prisma.invoice.update({
            where: { id: event.invoiceId },
            data: { amount: invoice.amount - oldTotal + newTotal },
          });
        }
      }

      const updated = await prisma.restaurantEvent.findUnique({ where: { id }, include: { items: true } });
      return NextResponse.json(updated);
    }

    if (addItem) {
      const { description, quantity, unitPrice } = addItem;
      const qty = parseInt(quantity) || 1;
      const price = parseFloat(unitPrice) || 0;
      const itemTotal = qty * price;

      await prisma.restaurantEventItem.create({
        data: { eventId: id, description, quantity: qty, unitPrice: price, totalPrice: itemTotal },
      });

      // Sync invoice if event is already finalized
      const eventForAdd = await prisma.restaurantEvent.findUnique({ where: { id }, select: { invoiceId: true } });
      if (eventForAdd?.invoiceId) {
        await prisma.invoiceItem.create({
          data: { invoiceId: eventForAdd.invoiceId, description, quantity: qty, price },
        });
        await prisma.invoice.update({
          where: { id: eventForAdd.invoiceId },
          data: { amount: { increment: itemTotal } },
        });
      }

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
