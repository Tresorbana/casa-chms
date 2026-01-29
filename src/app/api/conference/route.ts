import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        const rooms = await prisma.conferenceRoom.findMany({
            orderBy: { name: 'asc' },
            include: { bookings: true }
        })
        return NextResponse.json(rooms)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch conference rooms' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, capacity, pricePerHour } = body

        const room = await prisma.conferenceRoom.create({
            data: {
                name,
                capacity: parseInt(capacity),
                pricePerHour: parseFloat(pricePerHour)
            }
        })

        return NextResponse.json(room)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create conference room' }, { status: 500 })
    }
}
