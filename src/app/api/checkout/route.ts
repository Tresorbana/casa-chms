import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isValidPaymentMethod } from '@/lib/payment-methods';

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function nightsBetween(checkIn: Date, checkOut: Date) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / 86400000));
}

/** Stay is eligible for checkout if still in-house or room is marked occupied */
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

function buildFolio(
  room: { number: string; type: string; price: number },
  booking: {
    id: string;
    checkIn: Date;
    checkOut: Date;
    guest: { name: string; email: string | null; phone: string | null };
    serviceCharges: Array<{
      id: string;
      quantity: number;
      totalPrice: number;
      service: { name: string };
    }>;
  }
) {
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
    const unitPrice = charge.quantity > 0 ? charge.totalPrice / charge.quantity : charge.totalPrice;
    lineItems.push({
      description: charge.service.name,
      quantity: charge.quantity,
      price: unitPrice,
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
        },
        orderBy: { checkIn: 'desc' },
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
  if (!booking || !isCheckoutEligible(booking, room.status, now)) return null;

  return { room, booking };
}

async function listOccupiedRooms() {
  const now = new Date();
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ['CONFIRMED', 'CHECKED_IN'] },
      checkIn: { lte: now },
    },
    orderBy: { checkIn: 'desc' },
    include: {
      guest: { select: { name: true, phone: true } },
      room: { include: { floor: true } },
      serviceCharges: { select: { totalPrice: true } },
    },
  });

  const seenRoomIds = new Set<string>();
  const occupied: Array<{
    roomId: string;
    roomNumber: string;
    roomType: string;
    floorName: string | null;
    guestName: string;
    guestPhone: string | null;
    checkIn: Date;
    checkOut: Date;
    nights: number;
    balanceDue: number;
    bookingId: string;
  }> = [];

  for (const booking of bookings) {
    const room = booking.room;
    if (seenRoomIds.has(room.id)) continue;
    if (!isCheckoutEligible(booking, room.status, now)) continue;

    seenRoomIds.add(room.id);
    const nights = nightsBetween(booking.checkIn, booking.checkOut);
    const roomLineTotal = room.price * nights;
    const servicesTotal = booking.serviceCharges.reduce((s, c) => s + c.totalPrice, 0);

    occupied.push({
      roomId: room.id,
      roomNumber: room.number,
      roomType: room.type,
      floorName: room.floor?.name ?? null,
      guestName: booking.guest.name,
      guestPhone: booking.guest.phone,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights,
      balanceDue: roomLineTotal + servicesTotal,
      bookingId: booking.id,
    });
  }

  occupied.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }));
  return occupied;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

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

    const occupied = await listOccupiedRooms();
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

    // Find any unpaid invoices for the same guest that should be paid together at checkout.
    // This includes room charges, restaurant orders, and other service invoices that were created separately.
    const existingUnpaidInvoices = await prisma.invoice.findMany({
      where: {
        status: 'UNPAID',
        masterInvoiceId: null,
        type: { in: ['ROOM', 'RESTAURANT', 'SERVICE'] },
        OR: [
          { guestName: folio.guestName },
          { guestName: { equals: folio.guestName, mode: 'insensitive' } },
        ],
      },
      include: { items: true },
      orderBy: { date: 'asc' },
    });

    // Calculate total from existing unpaid invoices
    const existingUnpaidTotal = existingUnpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const consolidatedTotal = folio.grandTotal + existingUnpaidTotal;

    // Create all line items: existing items + new folio items
    const allLineItems = [
      ...existingUnpaidInvoices.flatMap((inv) =>
        inv.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price,
        }))
      ),
      ...folio.lineItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      })),
    ];

    // Create master invoice with all consolidated items
    const masterInvoice = await prisma.invoice.create({
      data: {
        guestName: folio.guestName,
        amount: consolidatedTotal,
        type: 'ROOM',
        status: markPaid ? 'PAID' : 'UNPAID',
        paymentMethod: markPaid ? paymentMethod : null,
        paidAt: markPaid ? now : null,
        items: {
          create: allLineItems,
        },
      },
      include: { items: true },
    });

    // Link existing invoices as sub-invoices to the master invoice
    if (existingUnpaidInvoices.length > 0) {
      await prisma.invoice.updateMany({
        where: {
          id: { in: existingUnpaidInvoices.map((inv) => inv.id) },
        },
        data: {
          masterInvoiceId: masterInvoice.id,
          status: 'PAID', // Mark sub-invoices as paid since they're now consolidated
        },
      });
    }

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
      invoice: masterInvoice,
      folio,
      consolidatedInvoices: existingUnpaidInvoices.length,
      finalized: finalize,
      room: { id: room.id, number: room.number },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
