import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { recordActivity } from '@/lib/activity-log';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        guest: true,
        room: true,
        serviceCharges: { include: { service: true } },
      },
    });
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const session = await getSession();
    const body = await request.json();
    const { checkIn, checkOut, totalAmount, source } = body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(checkIn && { checkIn: new Date(checkIn) }),
        ...(checkOut && { checkOut: new Date(checkOut) }),
        ...(totalAmount !== undefined && { totalAmount: parseFloat(totalAmount) }),
        ...(source && { source }),
      },
      include: { guest: true, room: true },
    });

    await recordActivity({
      user: session?.user,
      action: 'BOOKING_UPDATED',
      category: 'BOOKINGS',
      entity: 'Booking',
      entityId: booking.id,
      method: 'PUT',
      path: `/api/bookings/${id}`,
      metadata: {
        guestName: booking.guest?.name,
        roomNumber: booking.room?.number,
        totalAmount: booking.totalAmount,
        changed: { checkIn, checkOut, totalAmount, source },
      },
      request,
    });

    return NextResponse.json(booking);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { action, cancellationReason } = body;

    const existing = await prisma.booking.findUnique({
      where: { id },
      include: { room: true },
    });
    if (!existing) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    let bookingData: Record<string, any> = {};
    let roomData: Record<string, any> | null = null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (action) {
      case 'CHECK_IN': {
        if (existing.status !== 'CONFIRMED') {
          return NextResponse.json({ error: 'Only confirmed bookings can be checked in' }, { status: 400 });
        }
        const checkInDay = new Date(existing.checkIn);
        checkInDay.setHours(0, 0, 0, 0);
        if (today < checkInDay) {
          const fmt = checkInDay.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
          return NextResponse.json(
            { error: `Check-in date is ${fmt}. Cannot check in before the arrival date.` },
            { status: 400 }
          );
        }
        bookingData = { status: 'CHECKED_IN', checkedInAt: new Date() };
        roomData = { status: 'OCCUPIED' };
        break;
      }
      case 'CHECK_OUT':
        if (existing.status !== 'CHECKED_IN') {
          return NextResponse.json({ error: 'Guest must be checked in first' }, { status: 400 });
        }
        bookingData = { status: 'CHECKED_OUT', checkedOutAt: new Date() };
        roomData = { status: 'AVAILABLE' };
        break;
      case 'CANCEL':
        if (['CANCELLED', 'CHECKED_OUT'].includes(existing.status)) {
          return NextResponse.json({ error: 'Cannot cancel this booking' }, { status: 400 });
        }
        bookingData = {
          status: 'CANCELLED',
          cancellationReason: cancellationReason ?? null,
        };
        if (existing.room.status === 'OCCUPIED') {
          roomData = { status: 'AVAILABLE' };
        }
        break;
      case 'RESTORE':
        if (existing.status !== 'CANCELLED') {
          return NextResponse.json({ error: 'Only cancelled bookings can be restored' }, { status: 400 });
        }
        bookingData = { status: 'CONFIRMED', cancellationReason: null };
        break;
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    const [booking] = await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: bookingData,
        include: { guest: true, room: true },
      }),
      ...(roomData
        ? [prisma.room.update({ where: { id: existing.roomId }, data: roomData })]
        : []),
    ]);

    const session = await getSession();
    await recordActivity({
      user: session?.user,
      action: `BOOKING_${action}`,
      category: 'BOOKINGS',
      entity: 'Booking',
      entityId: booking.id,
      method: 'PATCH',
      path: `/api/bookings/${id}`,
      metadata: {
        guestName: booking.guest?.name,
        roomNumber: booking.room?.number,
        newStatus: booking.status,
        cancellationReason: cancellationReason ?? undefined,
      },
      request,
    });

    return NextResponse.json(booking);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const booking = await prisma.booking.findUnique({ where: { id }, include: { room: true } });
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.$transaction([
      prisma.booking.delete({ where: { id } }),
      ...(booking.room.status === 'OCCUPIED'
        ? [prisma.room.update({ where: { id: booking.roomId }, data: { status: 'AVAILABLE' } })]
        : []),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
