import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 1. Stored Notifications
        const storedNotifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // 2. New Web Inquiries
        const newInquiries = await prisma.webInquiry.findMany({
            where: { status: 'NEW' },
            orderBy: { createdAt: 'desc' }
        });

        // 3. Today's Checkouts
        const checkouts = await prisma.booking.findMany({
            where: {
                checkOut: {
                    gte: today,
                    lt: tomorrow
                },
                status: 'CHECKED_IN'
            },
            include: { guest: true, room: true }
        });

        // 4. Today's Check-ins
        const checkins = await prisma.booking.findMany({
            where: {
                checkIn: {
                    gte: today,
                    lt: tomorrow
                },
                status: 'CONFIRMED'
            },
            include: { guest: true, room: true }
        });

        // Merge and Map
        const dynamicNotifications = [
            ...newInquiries.map(i => ({
                id: `inq-${i.id}`,
                message: `New Inquiry from ${i.name}: ${i.subject}`,
                type: 'INFO',
                createdAt: i.createdAt,
                isRead: false
            })),
            ...checkouts.map(b => ({
                id: `out-${b.id}`,
                message: `Checkout Due: ${b.guest.name} (Room ${b.room.number})`,
                type: 'WARNING',
                createdAt: today, // Treat as today's alert
                isRead: false
            })),
            ...checkins.map(b => ({
                id: `in-${b.id}`,
                message: `Expected Arrival: ${b.guest.name} (Room ${b.room.number})`,
                type: 'SUCCESS',
                createdAt: today,
                isRead: false
            }))
        ];

        // Combine with stored, sort by date desc
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
        const { message, type } = body

        const notification = await prisma.notification.create({
            data: {
                message,
                type: type || 'INFO'
            }
        })

        return NextResponse.json(notification)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
    }
}
