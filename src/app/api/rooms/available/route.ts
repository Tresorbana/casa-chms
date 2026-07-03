import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    if (!checkIn || !checkOut) {
      return NextResponse.json({ error: 'checkIn and checkOut are required' }, { status: 400 });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
    }

    // Find rooms that have NO overlapping CONFIRMED/CHECKED_IN bookings in the date range
    const bookedRoomIds = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        checkIn: { lt: end },
        checkOut: { gt: start },
      },
      select: { roomId: true },
    });

    const bookedIds = bookedRoomIds.map((b) => b.roomId);

    const availableRooms = await prisma.room.findMany({
      where: {
        id: { notIn: bookedIds },
        status: { not: 'MAINTENANCE' },
      },
      include: { floor: true },
      orderBy: { number: 'asc' },
    });

    return NextResponse.json(availableRooms);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch available rooms' }, { status: 500 });
  }
}
