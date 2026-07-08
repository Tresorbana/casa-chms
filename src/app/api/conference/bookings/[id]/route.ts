import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

async function enrichLinkedBookings(linkedBookingIds: string[]) {
  if (!linkedBookingIds.length) return [];
  return prisma.booking.findMany({
    where: { id: { in: linkedBookingIds } },
    select: {
      id: true,
      status: true,
      checkIn: true,
      checkOut: true,
      totalAmount: true,
      guest: { select: { name: true, phone: true } },
      room: { select: { id: true, number: true, type: true } },
    },
  });
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const booking = await prisma.conferenceBooking.findUnique({
      where: { id },
      include: { conferenceRoom: true, items: true },
    });
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const linkedBookings = await enrichLinkedBookings(booking.linkedBookingIds);
    return NextResponse.json({ ...booking, linkedBookings });
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

    const existing = await prisma.conferenceBooking.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const newVenueTotal = totalAmount !== undefined ? parseFloat(totalAmount) : undefined;

    const booking = await prisma.conferenceBooking.update({
      where: { id },
      data: {
        ...(guestName !== undefined && { guestName }),
        ...(guestContact !== undefined && { guestContact }),
        ...(guestEmail !== undefined && { guestEmail }),
        ...(notes !== undefined && { notes }),
        ...(startTime !== undefined && { startTime: new Date(startTime) }),
        ...(endTime !== undefined && { endTime: new Date(endTime) }),
        ...(newVenueTotal !== undefined && { totalAmount: newVenueTotal }),
        ...(linkedBookingIds !== undefined && { linkedBookingIds }),
      },
      include: { conferenceRoom: true, items: true },
    });

    // If venue fee changed and an invoice exists, update the invoice accordingly
    if (newVenueTotal !== undefined && newVenueTotal !== existing.totalAmount && existing.invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: existing.invoiceId },
        include: { items: true },
      });
      if (invoice) {
        const venueItem = invoice.items.find(
          (item) => item.description.includes(' — Daily rate') || item.description.includes(' — Hourly rate')
        );
        if (venueItem) {
          await prisma.invoiceItem.update({
            where: { id: venueItem.id },
            data: { price: newVenueTotal },
          });
          const newInvoiceTotal = invoice.amount - existing.totalAmount + newVenueTotal;
          await prisma.invoice.update({
            where: { id: existing.invoiceId },
            data: { amount: newInvoiceTotal },
          });
        }
      }
    }

    const linkedBookings = await enrichLinkedBookings(booking.linkedBookingIds);
    return NextResponse.json({ ...booking, linkedBookings });
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

    const linkedBookings = await enrichLinkedBookings(booking.linkedBookingIds);
    return NextResponse.json({ ...booking, linkedBookings });
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
