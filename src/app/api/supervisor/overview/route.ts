import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { normalizeRole } from '@/lib/rbac';

function isSupervisor(role: string | null | undefined) {
  return normalizeRole(role) === 'SUPERVISOR';
}

export async function GET() {
  const session = await getSession();
  if (!session || !isSupervisor(session.user?.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: session ? 403 : 401 });
  }

  const now = new Date();
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 7); startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now); startOfMonth.setDate(now.getDate() - 30); startOfMonth.setHours(0, 0, 0, 0);
  const startOfHour = new Date(now.getTime() - 60 * 60 * 1000);

  try {
    const [
      totalLogs,
      todayLogs,
      weekLogs,
      failedLogs,
      logsByCategory,
      logsByAction,
      logsByUser,
      recentActive,
      lastHourLogs,
      systemHealth,
      failedLogins,
      allUsers,
    ] = await Promise.all([
      prisma.activityLog.count(),
      prisma.activityLog.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.activityLog.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.activityLog.count({ where: { status: { in: ['FAILED', 'DENIED'] } } }),
      prisma.activityLog.groupBy({
        by: ['category'],
        _count: { _all: true },
        orderBy: { _count: { category: 'desc' } },
      }),
      prisma.activityLog.groupBy({
        by: ['action'],
        _count: { _all: true },
        where: { createdAt: { gte: startOfMonth } },
        orderBy: { _count: { action: 'desc' } },
        take: 15,
      }),
      prisma.activityLog.groupBy({
        by: ['userId', 'userName', 'userRole'],
        _count: { _all: true },
        where: { userId: { not: null }, createdAt: { gte: startOfWeek } },
        orderBy: { _count: { userId: 'desc' } },
        take: 20,
      }),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.activityLog.count({ where: { createdAt: { gte: startOfHour } } }),
      Promise.all([
        prisma.booking.count({ where: { status: { in: ['CONFIRMED', 'CHECKED_IN'] } } }),
        prisma.room.count({ where: { status: 'OCCUPIED' } }),
        prisma.invoice.count({ where: { status: 'UNPAID' } }),
        prisma.invoice.aggregate({ where: { status: 'PAID', paidAt: { gte: startOfDay } }, _sum: { amount: true } }),
        prisma.invoice.aggregate({ where: { status: 'PAID', paidAt: { gte: startOfWeek } }, _sum: { amount: true } }),
      ]),
      prisma.activityLog.count({
        where: { action: 'LOGIN_FAILED', createdAt: { gte: startOfDay } },
      }),
      prisma.user.count(),
    ]);

    const [activeBookings, occupiedRooms, unpaidInvoices, revenueToday, revenueWeek] = systemHealth;

    return NextResponse.json({
      totals: {
        allTime: totalLogs,
        today: todayLogs,
        lastHour: lastHourLogs,
        week: weekLogs,
        failedLogs,
        failedLoginsToday: failedLogins,
        users: allUsers,
      },
      byCategory: logsByCategory.map((c) => ({ category: c.category, count: c._count._all })),
      topActions: logsByAction.map((a) => ({ action: a.action, count: a._count._all })),
      topUsers: logsByUser.map((u) => ({
        userId: u.userId,
        userName: u.userName,
        userRole: u.userRole,
        count: u._count._all,
      })),
      recentActive,
      hotel: {
        activeBookings,
        occupiedRooms,
        unpaidInvoices,
        revenueToday: revenueToday._sum.amount ?? 0,
        revenueWeek: revenueWeek._sum.amount ?? 0,
      },
    });
  } catch (error) {
    console.error('[supervisor/overview]', error);
    return NextResponse.json({ error: 'Failed to load overview' }, { status: 500 });
  }
}
