import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isCheckoutEligible(
  booking: { checkOut: Date; status: string },
  roomStatus: string,
  now = new Date()
) {
  if (!['CONFIRMED', 'CHECKED_IN'].includes(booking.status)) return false;
  const endOfStay = new Date(booking.checkOut);
  endOfStay.setHours(23, 59, 59, 999);
  if (endOfStay >= startOfToday()) return true;
  if (roomStatus === 'OCCUPIED') return true;
  return endOfStay >= now;
}

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
  if (!room || !booking || room.status === 'MAINTENANCE' || !isCheckoutEligible(booking, room.status, now)) return null;
  return { room, booking };
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const createdByName = session?.user?.name ?? null;
    const createdById = session?.user?.id ?? null;

    const body = await request.json();
    const { guestName, amount, type, items, masterInvoiceId, customerType, roomId } = body;

    let resolvedRoomId: string | null = null;

    if (type === 'RESTAURANT' && roomId) {
      const occupiedRoom = await findOccupiedRoom(roomId);
      if (!occupiedRoom) {
        return NextResponse.json({ error: 'That room is not occupied right now' }, { status: 400 });
      }
      // Store the actual room DB id (not number) so checkout can match by roomId directly
      resolvedRoomId = occupiedRoom.room.id;
    }

    if (type === 'RESTAURANT' && customerType === 'RESIDENT' && !roomId) {
      return NextResponse.json({ error: 'Resident orders require an occupied room' }, { status: 400 });
    }

    const invoice = await prisma.invoice.create({
      data: {
        guestName,
        amount,
        type: type || 'ROOM',
        masterInvoiceId,
        roomId: resolvedRoomId,
        createdByName,
        createdById,
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
