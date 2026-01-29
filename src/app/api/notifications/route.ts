import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        })
        return NextResponse.json(notifications)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
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
