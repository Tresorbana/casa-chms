import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const booking = await prisma.conferenceBooking.findUnique({
      where: { id },
      include: { conferenceRoom: true, items: true },
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
    const body = await request.json();
    const {
      guestName, guestContact, guestEmail, notes,
      startTime, endTime, totalAmount, linkedBookingIds,
    } = body;

    const booking = await prisma.conferenceBooking.update({
      where: { id },
      data: {
        ...(guestName !== undefined && { guestName }),
        ...(guestContact !== undefined && { guestContact }),
        ...(guestEmail !== undefined && { guestEmail }),
        ...(notes !== undefined && { notes }),
        ...(startTime !== undefined && { startTime: new Date(startTime) }),
        ...(endTime !== undefined && { endTime: new Date(endTime) }),
        ...(totalAmount !== undefined && { totalAmount: parseFloat(totalAmount) }),
        ...(linkedBookingIds !== undefined && { linkedBookingIds }),
      },
      include: { conferenceRoom: true, items: true },
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

    const existing = await prisma.conferenceBooking.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let data: Record<string, any> = {};

    switch (action) {
      case 'CHECK_IN': {
        if (existing.status !== 'CONFIRMED') {
          return NextResponse.json({ error: 'Only confirmed bookings can be checked in' }, { status: 400 });
        }
        const eventDay = new Date(existing.startTime);
        eventDay.setHours(0, 0, 0, 0);
        if (today < eventDay) {
          const fmt = eventDay.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
          return NextResponse.json(
            { error: `Event starts on ${fmt}. Cannot check in before the event date.` },
            { status: 400 }
          );
        }
        data = { status: 'CHECKED_IN', checkedInAt: new Date() };
        break;
      }
      case 'CHECK_OUT':
        if (existing.status !== 'CHECKED_IN') {
          return NextResponse.json({ error: 'Booking must be checked in first' }, { status: 400 });
        }
        data = { status: 'CHECKED_OUT', checkedOutAt: new Date() };
        break;
      case 'CANCEL':
        if (['CANCELLED', 'INVOICED'].includes(existing.status)) {
          return NextResponse.json({ error: 'Cannot cancel this booking' }, { status: 400 });
        }
        data = { status: 'CANCELLED', notes: cancellationReason ?? existing.notes };
        break;
      case 'RESTORE':
        if (existing.status !== 'CANCELLED') {
          return NextResponse.json({ error: 'Only cancelled bookings can be restored' }, { status: 400 });
        }
        data = { status: 'CONFIRMED' };
        break;
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    const booking = await prisma.conferenceBooking.update({
      where: { id },
      data,
      include: { conferenceRoom: true, items: true },
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
    await prisma.conferenceBooking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
