import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        const bookings = await prisma.conferenceBooking.findMany({
            orderBy: { startTime: 'desc' },
            include: { conferenceRoom: true }
        })
        return NextResponse.json(bookings)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch conference bookings' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { conferenceRoomId, guestName, guestEmail, startTime, endTime, totalAmount } = body

        // Check availability
        const conflict = await prisma.conferenceBooking.findFirst({
            where: {
                conferenceRoomId,
                status: 'CONFIRMED',
                OR: [
                    {
                        startTime: { lte: new Date(startTime) },
                        endTime: { gte: new Date(startTime) }
                    },
                    {
                        startTime: { lte: new Date(endTime) },
                        endTime: { gte: new Date(endTime) }
                    }
                ]
            }
        })

        if (conflict) {
            return NextResponse.json({ error: 'Room is already booked for this time' }, { status: 409 })
        }

        const booking = await prisma.conferenceBooking.create({
            data: {
                conferenceRoomId,
                guestName,
                guestEmail,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                totalAmount: parseFloat(totalAmount)
            }
        })

        return NextResponse.json(booking)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create conference booking' }, { status: 500 })
    }
}
