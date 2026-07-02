import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

async function findOccupiedRoom(roomId: string) {
  const now = new Date();
  const room = await prisma.room.findFirst({
    where: { OR: [{ id: roomId }, { number: roomId }] },
    include: {
      bookings: {
        where: {
          status: { in: ['CONFIRMED', 'CHECKED_IN'] },
          checkIn: { lte: now },
        },
        orderBy: { checkIn: 'desc' },
        include: { guest: true },
        take: 1,
      },
    },
  });

  const booking = room?.bookings[0] ?? null;
  if (!room || !booking || room.status !== 'OCCUPIED') return null;
  return { room, booking };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestName, amount, type, items, masterInvoiceId, customerType, roomId } = body;

    if (type === 'RESTAURANT' && roomId) {
      const occupiedRoom = await findOccupiedRoom(roomId);
      if (!occupiedRoom) {
        return NextResponse.json({ error: 'That room is not occupied right now' }, { status: 400 });
      }
    }

    if (type === 'RESTAURANT' && customerType === 'RESIDENT' && !roomId) {
      return NextResponse.json({ error: 'Resident orders require an occupied room' }, { status: 400 });
    }

    // Validation for Master Invoice
    if (type === 'MASTER' && (!items || items.length === 0)) {
      // Logic to auto-compile master invoice from sub-invoices if provided
    }

    const invoice = await prisma.invoice.create({
      data: {
        guestName,
        amount,
        type: type || 'ROOM',
        masterInvoiceId,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
        subInvoices: true,
      },
    });

    // For RESTAURANT invoices, deduct from inventory via linked MenuItems
    if (type === 'RESTAURANT' && items && items.length > 0) {
      for (const orderItem of items) {
        // Look up MenuItem by name matching the invoice item description
        const menuItem = await prisma.menuItem.findFirst({
          where: { name: orderItem.description },
        });

        if (menuItem?.inventoryItemId) {
          const inventoryItem = await prisma.inventoryItem.findUnique({
            where: { id: menuItem.inventoryItemId },
          });

          if (inventoryItem) {
            const deductQty = orderItem.quantity ?? 1;
            const newStock = Math.max(0, inventoryItem.stock - deductQty);

            await prisma.inventoryItem.update({
              where: { id: menuItem.inventoryItemId },
              data: { stock: newStock },
            });

            await prisma.stockMovement.create({
              data: {
                itemId: menuItem.inventoryItemId,
                type: 'OUT',
                quantity: deductQty,
                reason: 'RESTAURANT_SALE',
                reference: invoice.id,
              },
            });
          }
        }
      }
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Search / List invoices
  try {
    const invoices = await prisma.invoice.findMany({
      take: 20,
      orderBy: { date: 'desc' },
      include: { items: true },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
