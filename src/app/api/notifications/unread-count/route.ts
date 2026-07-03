import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { startOfRwandaDay, endOfRwandaDay } from '@/lib/timezone'

export async function GET() {
  try {
    const session = await getSession();
    const role: string = session?.user?.role ?? 'STAFF';

    const isReception = ['RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'].includes(role);
    const isFinance = ['FINANCE', 'ADMIN', 'SUPER_ADMIN'].includes(role);

    const todayStart = startOfRwandaDay();
    const todayEnd = endOfRwandaDay();

    // Count stored unread notifications for this role
    const storedCount = await prisma.notification.count({
      where: {
        isRead: false,
        OR: [
          { targetRoles: { isEmpty: true } },
          { targetRoles: { has: role } },
        ],
      },
    });

    let dynamicCount = 0;

    if (isReception) {
      const [inquiries, checkouts, checkins, events] = await Promise.all([
        prisma.webInquiry.count({ where: { status: 'NEW' } }),
        prisma.booking.count({ where: { checkOut: { gte: todayStart, lte: todayEnd }, status: 'CHECKED_IN' } }),
        prisma.booking.count({ where: { checkIn: { gte: todayStart, lte: todayEnd }, status: 'CONFIRMED' } }),
        prisma.conferenceBooking.count({ where: { startTime: { gte: todayStart, lte: todayEnd }, status: { in: ['CONFIRMED', 'CHECKED_IN'] } } }),
      ]);
      dynamicCount += inquiries + checkouts + checkins + events;
    }

    if (isFinance) {
      const rev = await prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID', paidAt: { gte: todayStart, lte: todayEnd } },
      });
      if ((rev._sum.amount ?? 0) > 0) dynamicCount += 1;
    }

    return NextResponse.json({ count: storedCount + dynamicCount });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
