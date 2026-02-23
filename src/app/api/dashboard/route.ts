import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function cacheHeaders(maxAge = 30, swr = 60) {
  return { 'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${swr}` };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    const targetDate = dateStr ? new Date(dateStr) : new Date()
    targetDate.setHours(0, 0, 0, 0)

    const nextDay = new Date(targetDate)
    nextDay.setDate(targetDate.getDate() + 1)

    // Run all queries in parallel
    const [rooms, revenueAgg, pendingCount] = await Promise.all([
      // Room grid with active bookings for the target date
      prisma.room.findMany({
        orderBy: { number: 'asc' },
        include: {
          floor: true,
          bookings: {
            where: {
              status: { in: ['CONFIRMED', 'CHECKED_IN'] },
              checkIn: { lt: nextDay },
              checkOut: { gt: targetDate },
            },
            include: { guest: { select: { name: true } } },
            take: 1, // only need the first active booking per room
          },
        },
      }),

      // Aggregate revenue created today — no full row fetch
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Pending reservations count
      prisma.booking.count({ where: { status: 'PENDING' } }),
    ])

    // Compute display status
    const processedRooms = rooms.map(room => {
      const activeBooking = room.bookings[0] ?? null;
      return {
        ...room,
        displayStatus: activeBooking ? 'OCCUPIED' : 'AVAILABLE',
        activeBooking,
      };
    });

    const totalRooms = processedRooms.length;
    const occupiedRooms = processedRooms.filter(r => r.displayStatus === 'OCCUPIED').length;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    return NextResponse.json(
      {
        stats: {
          occupancyRate,
          revenueToday: revenueAgg._sum.totalAmount ?? 0,
          pendingReservations: pendingCount,
        },
        rooms: processedRooms,
      },
      { headers: cacheHeaders(30, 60) }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
