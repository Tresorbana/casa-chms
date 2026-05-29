import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateDailyTotal, dailyRangeToTimes } from '@/lib/conference-booking';

export async function GET() {
  try {
    const bookings = await prisma.conferenceBooking.findMany({
      orderBy: { startTime: 'desc' },
      include: { conferenceRoom: true },
    });
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch conference bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
      },
      include: { conferenceRoom: true },
    });

    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: 'Failed to create conference booking' }, { status: 500 });
  }
}
