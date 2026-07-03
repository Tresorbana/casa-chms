import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { startOfRwandaDay, endOfRwandaDay } from '@/lib/timezone'

function roleCanSeeType(role: string, notifType: string): boolean {
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(role);
  const isFinance = ['FINANCE', 'ADMIN', 'SUPER_ADMIN'].includes(role);
  const isReception = ['RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'].includes(role);
  const isRestaurant = ['WAITER', 'BARMAN', 'ADMIN', 'SUPER_ADMIN'].includes(role);

  switch (notifType) {
    case 'CHECKIN':
    case 'CHECKOUT':
    case 'INQUIRY':
      return isReception;
    case 'PAYMENT':
    case 'REVENUE':
      return isFinance;
    case 'RESTAURANT':
      return isRestaurant;
    case 'STOCK':
      return ['BARMAN', 'STORE_KEEPER', 'ADMIN', 'SUPER_ADMIN'].includes(role);
    default:
      return isAdmin; // INFO, WARNING, SUCCESS etc. go to all or admin
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    const role: string = session?.user?.role ?? 'STAFF';

    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(role);
    const isFinance = ['FINANCE', 'ADMIN', 'SUPER_ADMIN'].includes(role);
    const isReception = ['RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'].includes(role);

    const todayStart = startOfRwandaDay();
    const todayEnd = endOfRwandaDay();

    // Stored notifications — filter by targetRoles (empty array = all roles see it)
    const storedNotifications = await prisma.notification.findMany({
      where: {
        OR: [
          { targetRoles: { isEmpty: true } },
          { targetRoles: { has: role } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const dynamicNotifications: any[] = [];

    // New Web Inquiries — receptionists only
    if (isReception) {
      const newInquiries = await prisma.webInquiry.findMany({
        where: { status: 'NEW' },
        orderBy: { createdAt: 'desc' },
      });
      dynamicNotifications.push(
        ...newInquiries.map(i => ({
          id: `inq-${i.id}`,
          message: `New inquiry from ${i.name}: ${i.subject || 'No subject'}`,
          type: 'INFO',
          category: 'INQUIRY',
          createdAt: i.createdAt,
          isRead: false,
        }))
      );
    }

    // Today's check-outs due — receptionists only
    if (isReception) {
      const checkouts = await prisma.booking.findMany({
        where: {
          checkOut: { gte: todayStart, lte: todayEnd },
          status: 'CHECKED_IN',
        },
        include: { guest: true, room: true },
      });
      dynamicNotifications.push(
        ...checkouts.map(b => ({
          id: `out-${b.id}`,
          message: `Checkout due: ${b.guest.name} (Room ${b.room.number})`,
          type: 'WARNING',
          category: 'CHECKOUT',
          createdAt: todayStart,
          isRead: false,
        }))
      );
    }

    // Today's expected check-ins — receptionists only
    if (isReception) {
      const checkins = await prisma.booking.findMany({
        where: {
          checkIn: { gte: todayStart, lte: todayEnd },
          status: 'CONFIRMED',
        },
        include: { guest: true, room: true },
      });
      dynamicNotifications.push(
        ...checkins.map(b => ({
          id: `in-${b.id}`,
          message: `Expected arrival: ${b.guest.name} (Room ${b.room.number})`,
          type: 'SUCCESS',
          category: 'CHECKIN',
          createdAt: todayStart,
          isRead: false,
        }))
      );
    }

    // Today's revenue summary — finance only
    if (isFinance) {
      const todayRevenue = await prisma.invoice.aggregate({
        _sum: { amount: true },
        where: {
          status: 'PAID',
          paidAt: { gte: todayStart, lte: todayEnd },
        },
      });
      const rev = todayRevenue._sum.amount ?? 0;
      if (rev > 0) {
        dynamicNotifications.push({
          id: `rev-today`,
          message: `Today's collected revenue: RWF ${rev.toLocaleString()}`,
          type: 'SUCCESS',
          category: 'REVENUE',
          createdAt: todayStart,
          isRead: false,
        });
      }
    }

    // Today's events — receptionists
    if (isReception) {
      const events = await prisma.conferenceBooking.findMany({
        where: {
          startTime: { gte: todayStart, lte: todayEnd },
          status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        },
        include: { conferenceRoom: true },
      });
      dynamicNotifications.push(
        ...events.map(e => ({
          id: `evt-${e.id}`,
          message: `Event today: ${e.guestName} at ${e.conferenceRoom.name}`,
          type: 'INFO',
          category: 'EVENT',
          createdAt: todayStart,
          isRead: false,
        }))
      );
    }

    const allNotifications = [...dynamicNotifications, ...storedNotifications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(allNotifications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, type, targetRoles } = body

    const notification = await prisma.notification.create({
      data: {
        message,
        type: type || 'INFO',
        targetRoles: Array.isArray(targetRoles) ? targetRoles : [],
      }
    })

    return NextResponse.json(notification)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
