import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { calculateDailyTotal, dailyRangeToTimes } from '@/lib/conference-booking';

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

export async function GET() {
  try {
    const bookings = await prisma.conferenceBooking.findMany({
      orderBy: { startTime: 'desc' },
      include: { conferenceRoom: true, items: true },
    });

    // Collect all unique linked IDs across all bookings
    const rawIds = bookings.flatMap((b) => b.linkedBookingIds);
    const allIds = rawIds.filter((id, i) => rawIds.indexOf(id) === i);
    const hotelBookings = await enrichLinkedBookings(allIds);
    const byId = Object.fromEntries(hotelBookings.map((b) => [b.id, b]));

    const enriched = bookings.map((b) => ({
      ...b,
      linkedBookings: b.linkedBookingIds.map((id) => byId[id]).filter(Boolean),
    }));

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch conference bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const createdByName = session?.user?.name ?? null;

    const body = await request.json();
    const {
      conferenceRoomId,
      guestName,
      guestContact,
      guestId,
      guestEmail,
      startTime,
      endTime,
      startDate,
      endDate,
      totalAmount,
      bookingType = 'HOURLY',
      linkedBookingIds,
      notes,
    } = body;

    const room = await prisma.conferenceRoom.findUnique({ where: { id: conferenceRoomId } });
    if (!room) {
      return NextResponse.json({ error: 'Conference room not found' }, { status: 404 });
    }

    const isDaily = bookingType === 'DAILY';
    let resolvedStart: Date;
    let resolvedEnd: Date;
    let resolvedTotal = totalAmount !== undefined && totalAmount !== '' ? parseFloat(totalAmount) : NaN;

    if (isDaily) {
      if (!startDate || !endDate) {
        return NextResponse.json({ error: 'Start and end dates are required for daily bookings' }, { status: 400 });
      }
      if (new Date(endDate) < new Date(startDate)) {
        return NextResponse.json({ error: 'End date must be on or after start date' }, { status: 400 });
      }
      if (!room.pricePerDay || room.pricePerDay <= 0) {
        return NextResponse.json({ error: 'This room has no daily rate configured' }, { status: 400 });
      }
      const range = dailyRangeToTimes(startDate, endDate);
      resolvedStart = range.startTime;
      resolvedEnd = range.endTime;
      if (Number.isNaN(resolvedTotal)) {
        resolvedTotal = calculateDailyTotal(room.pricePerDay, startDate, endDate);
      }
    } else {
      if (!startTime || !endTime) {
        return NextResponse.json({ error: 'Start and end times are required' }, { status: 400 });
      }
      resolvedStart = new Date(startTime);
      resolvedEnd = new Date(endTime);
      if (resolvedEnd <= resolvedStart) {
        return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
      }
      if (Number.isNaN(resolvedTotal)) {
        return NextResponse.json({ error: 'Total amount is required for hourly bookings' }, { status: 400 });
      }
    }

    const conflict = await prisma.conferenceBooking.findFirst({
      where: {
        conferenceRoomId,
        status: 'CONFIRMED',
        OR: [
          {
            startTime: { lte: resolvedStart },
            endTime: { gte: resolvedStart },
          },
          {
            startTime: { lte: resolvedEnd },
            endTime: { gte: resolvedEnd },
          },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json({ error: 'Room is already booked for this period' }, { status: 409 });
    }

    // If rooms are requested for attendees, create hotel bookings for them
    const roomsToBook: string[] = Array.isArray(body.roomsToBook) ? body.roomsToBook : [];
    const allLinkedIds: string[] = Array.isArray(linkedBookingIds) ? [...linkedBookingIds] : [];

    if (roomsToBook.length > 0) {
      // Find or create a guest record for the event organizer
      let guest = await prisma.guest.findFirst({
        where: guestContact
          ? { phone: guestContact }
          : { name: { equals: guestName, mode: 'insensitive' } },
      });
      if (!guest) {
        guest = await prisma.guest.create({
          data: { name: guestName, phone: guestContact ?? null },
        });
      }

      const createdRoomBookings = await prisma.$transaction(
        roomsToBook.map((roomId: string) =>
          prisma.booking.create({
            data: {
              guestId: guest!.id,
              roomId,
              checkIn: resolvedStart,
              checkOut: resolvedEnd,
              totalAmount: 0,
              status: 'CONFIRMED',
              createdByName,
            },
          })
        )
      );

      allLinkedIds.push(...createdRoomBookings.map((b) => b.id));
    }

    const booking = await prisma.conferenceBooking.create({
      data: {
        conferenceRoomId,
        guestName,
        guestContact,
        guestId,
        guestEmail,
        bookingType: isDaily ? 'DAILY' : 'HOURLY',
        startTime: resolvedStart,
        endTime: resolvedEnd,
        totalAmount: resolvedTotal,
        linkedBookingIds: allLinkedIds,
        notes: notes ?? null,
        createdByName,
      },
      include: { conferenceRoom: true, items: true },
    });

    const linkedBookings = await enrichLinkedBookings(booking.linkedBookingIds);
    return NextResponse.json({ ...booking, linkedBookings });
  } catch {
    return NextResponse.json({ error: 'Failed to create conference booking' }, { status: 500 });
  }
}
