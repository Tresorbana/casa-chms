import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    const createdByName = session?.user?.name ?? null;
    const createdById = session?.user?.id ?? null;

    const event = await prisma.restaurantEvent.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (event.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Event already finalized', invoiceId: event.invoiceId }, { status: 400 });
    }
    if (event.items.length === 0) {
      return NextResponse.json({ error: 'Cannot finalize an event with no items' }, { status: 400 });
    }

    const total = event.items.reduce((sum, item) => sum + item.totalPrice, 0);

    const invoice = await prisma.invoice.create({
      data: {
        guestName: event.guestName,
        amount: total,
        type: 'RESTAURANT',
        date: new Date(event.startTime),
        createdByName,
        createdById,
        items: {
          create: event.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    // Deduct inventory for any linked menu items
    for (const orderItem of event.items) {
      const menuItem = await prisma.menuItem.findFirst({
        where: { name: orderItem.description },
      });
      if (menuItem?.inventoryItemId) {
        const inventoryItem = await prisma.inventoryItem.findUnique({
          where: { id: menuItem.inventoryItemId },
        });
        if (inventoryItem) {
          const newStock = Math.max(0, inventoryItem.stock - orderItem.quantity);
          await prisma.inventoryItem.update({
            where: { id: menuItem.inventoryItemId },
            data: { stock: newStock },
          });
          await prisma.stockMovement.create({
            data: {
              itemId: menuItem.inventoryItemId,
              type: 'OUT',
              quantity: orderItem.quantity,
              reason: 'RESTAURANT_SALE',
              reference: invoice.id,
            },
          });
        }
      }
    }

    await prisma.restaurantEvent.update({
      where: { id },
      data: { status: 'COMPLETED', invoiceId: invoice.id, totalAmount: total },
    });

    return NextResponse.json({ invoiceId: invoice.id });
  } catch {
    return NextResponse.json({ error: 'Failed to finalize event' }, { status: 500 });
  }
}
