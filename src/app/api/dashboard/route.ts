import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { startOfRwandaDay, endOfRwandaDay, rwandaDayBounds } from '@/lib/timezone'

function cacheHeaders(maxAge = 30, swr = 60) {
  return { 'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${swr}` };
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    const role: string = session?.user?.role ?? 'STAFF';

    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')

    let targetDayStart: Date;
    let targetDayEnd: Date;

    if (dateStr) {
      const bounds = rwandaDayBounds(dateStr);
      targetDayStart = bounds.gte;
      targetDayEnd = bounds.lte;
    } else {
      targetDayStart = startOfRwandaDay();
      targetDayEnd = endOfRwandaDay();
    }

    const nextDay = new Date(targetDayEnd.getTime() + 1);

    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(role);
    const isFinance = ['FINANCE', 'ADMIN', 'SUPER_ADMIN'].includes(role);
    const isReception = ['RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'].includes(role);
    const isRestaurant = ['WAITER', 'BARMAN', 'ADMIN', 'SUPER_ADMIN'].includes(role);

    // Room grid — shown to reception, admin
    const roomsPromise = (isReception || isAdmin)
      ? prisma.room.findMany({
          orderBy: { number: 'asc' },
          include: {
            floor: true,
            bookings: {
              where: {
                status: { in: ['CONFIRMED', 'CHECKED_IN'] },
                checkIn: { lt: nextDay },
                checkOut: { gt: targetDayStart },
              },
              include: { guest: { select: { name: true } } },
              take: 1,
            },
          },
        })
      : Promise.resolve([]);

    // Revenue for finance/admin
    const revenuePromise = isFinance
      ? prisma.invoice.aggregate({
          _sum: { amount: true },
          where: {
            status: 'PAID',
            paidAt: { gte: targetDayStart, lte: targetDayEnd },
          },
        })
      : Promise.resolve({ _sum: { amount: null } });

    // Pending reservations count
    const pendingPromise = isReception
      ? prisma.booking.count({ where: { status: 'CONFIRMED' } })
      : Promise.resolve(0);

    // Today's check-ins and check-outs for reception
    const checkinsPromise = isReception
      ? prisma.booking.count({
          where: {
            checkIn: { gte: targetDayStart, lte: targetDayEnd },
            status: 'CONFIRMED',
          },
        })
      : Promise.resolve(0);

    const checkoutsPromise = isReception
      ? prisma.booking.count({
          where: {
            checkOut: { gte: targetDayStart, lte: targetDayEnd },
            status: 'CHECKED_IN',
          },
        })
      : Promise.resolve(0);

    // Restaurant orders today for barman/waiter
    const restaurantRevenuePromise = isRestaurant
      ? prisma.invoice.aggregate({
          _sum: { amount: true },
          where: {
            type: 'RESTAURANT',
            date: { gte: targetDayStart, lte: targetDayEnd },
          },
        })
      : Promise.resolve({ _sum: { amount: null } });

    // Today events for reception
    const eventsPromise = isReception
      ? prisma.conferenceBooking.count({
          where: {
            startTime: { gte: targetDayStart, lte: targetDayEnd },
            status: { in: ['CONFIRMED', 'CHECKED_IN'] },
          },
        })
      : Promise.resolve(0);

    const [rooms, revenueAgg, pendingCount, checkinsToday, checkoutsToday, restaurantRevAgg, eventsToday] =
      await Promise.all([
        roomsPromise,
        revenuePromise,
        pendingPromise,
        checkinsPromise,
        checkoutsPromise,
        restaurantRevenuePromise,
        eventsPromise,
      ]);

    const processedRooms = (rooms as any[]).map(room => {
      const activeBooking = room.bookings[0] ?? null;
      return {
        ...room,
        displayStatus: activeBooking ? 'OCCUPIED' : 'AVAILABLE',
        activeBooking,
      };
    });

    const totalRooms = processedRooms.length;
    const occupiedRooms = processedRooms.filter((r: any) => r.displayStatus === 'OCCUPIED').length;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    return NextResponse.json(
      {
        role,
        stats: {
          occupancyRate,
          revenueToday: revenueAgg._sum.amount ?? 0,
          pendingReservations: pendingCount,
          checkinsToday,
          checkoutsToday,
          restaurantRevenueToday: restaurantRevAgg._sum.amount ?? 0,
          eventsToday,
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
