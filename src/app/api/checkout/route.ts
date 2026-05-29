import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isValidPaymentMethod } from '@/lib/payment-methods';

function nightsBetween(checkIn: Date, checkOut: Date) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / 86400000));
}

async function findOccupiedRoom(roomIdOrNumber: string) {
  const now = new Date();
  const room = await prisma.room.findFirst({
    where: {
      OR: [{ id: roomIdOrNumber }, { number: roomIdOrNumber }],
    },
    include: {
      floor: true,
      bookings: {
        where: {
          status: { in: ['CONFIRMED', 'CHECKED_IN'] },
          checkIn: { lte: now },
          checkOut: { gte: now },
        },
        include: {
          guest: true,
          serviceCharges: {
            include: { service: true },
            orderBy: { date: 'asc' },
          },
        },
        take: 1,
      },
    },
  });

  if (!room) return null;
  const booking = room.bookings[0] ?? null;
  if (!booking) return null;

  return { room, booking };
}

function buildFolio(room: { number: string; type: string; price: number }, booking: {
  id: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  guest: { name: string; email: string | null; phone: string | null };
  serviceCharges: Array<{
    id: string;
    quantity: number;
    totalPrice: number;
    service: { name: string };
  }>;
}) {
  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const roomLineTotal = room.price * nights;

  const lineItems: Array<{ description: string; quantity: number; price: number }> = [
    {
      description: `Room ${room.number} (${room.type}) — ${nights} night${nights !== 1 ? 's' : ''}`,
      quantity: nights,
      price: room.price,
    },
  ];

  for (const charge of booking.serviceCharges) {
    lineItems.push({
      description: charge.service.name,
      quantity: charge.quantity,
      price: charge.totalPrice / charge.quantity,
    });
  }

  const servicesTotal = booking.serviceCharges.reduce((s, c) => s + c.totalPrice, 0);
  const grandTotal = roomLineTotal + servicesTotal;

  return {
    bookingId: booking.id,
    guestName: booking.guest.name,
    guestEmail: booking.guest.email,
    guestPhone: booking.guest.phone,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights,
    lineItems,
    roomLineTotal,
    servicesTotal,
    grandTotal,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const now = new Date();

    if (roomId) {
      const found = await findOccupiedRoom(roomId);
      if (!found) {
        return NextResponse.json({ error: 'No active stay for this room' }, { status: 404 });
      }
      const { room, booking } = found;
      const folio = buildFolio(room, booking);
      return NextResponse.json({
        room: {
          id: room.id,
          number: room.number,
          type: room.type,
          price: room.price,
          floor: room.floor,
        },
        booking: {
          id: booking.id,
          status: booking.status,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
        },
        folio,
      });
    }

    const rooms = await prisma.room.findMany({
      orderBy: { number: 'asc' },
      include: {
        floor: true,
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'CHECKED_IN'] },
            checkIn: { lte: now },
            checkOut: { gte: now },
          },
          include: {
            guest: { select: { name: true, phone: true } },
            serviceCharges: { select: { totalPrice: true } },
          },
          take: 1,
        },
      },
    });

    const occupied = rooms
      .filter((r) => r.bookings.length > 0)
      .map((r) => {
        const booking = r.bookings[0];
        const nights = nightsBetween(booking.checkIn, booking.checkOut);
        const roomLineTotal = r.price * nights;
        const servicesTotal = booking.serviceCharges.reduce((s, c) => s + c.totalPrice, 0);
        return {
          roomId: r.id,
          roomNumber: r.number,
          roomType: r.type,
          floorName: r.floor?.name ?? null,
          guestName: booking.guest.name,
          guestPhone: booking.guest.phone,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          nights,
          balanceDue: roomLineTotal + servicesTotal,
          bookingId: booking.id,
        };
      });

    return NextResponse.json({ occupied, count: occupied.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load checkout data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, paymentMethod, markPaid = false, finalize = true } = body;

    if (!roomId) {
      return NextResponse.json({ error: 'roomId is required' }, { status: 400 });
    }

    if (markPaid && (!paymentMethod || !isValidPaymentMethod(paymentMethod))) {
      return NextResponse.json(
        { error: 'Payment method is required (Cash, Bank transfer, Momo, or Card)' },
        { status: 400 }
      );
    }

    const found = await findOccupiedRoom(roomId);
    if (!found) {
      return NextResponse.json({ error: 'No active stay to check out' }, { status: 404 });
    }

    const { room, booking } = found;
    const folio = buildFolio(room, booking);
    const now = new Date();

    const invoice = await prisma.invoice.create({
      data: {
        guestName: folio.guestName,
        amount: folio.grandTotal,
        type: 'ROOM',
        status: markPaid ? 'PAID' : 'UNPAID',
        paymentMethod: markPaid ? paymentMethod : null,
        paidAt: markPaid ? now : null,
        items: {
          create: folio.lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    if (finalize) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CHECKED_OUT',
          checkOut: now,
        },
      });

      if (markPaid && booking.serviceCharges.length > 0) {
        await prisma.serviceCharge.updateMany({
          where: { bookingId: booking.id },
          data: { status: 'PAID' },
        });
      }

      await prisma.room.update({
        where: { id: room.id },
        data: { status: 'CLEANING' },
      });
    }

    return NextResponse.json({
      success: true,
      invoice,
      folio,
      finalized: finalize,
      room: { id: room.id, number: room.number },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
