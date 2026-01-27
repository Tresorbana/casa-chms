import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        guest: true,
        room: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { guestName, guestEmail, guestPhone, roomNumber, checkIn, checkOut, totalAmount } = body

    // Find or create guest
    let guest = await prisma.guest.findFirst({
        where: { email: guestEmail }
    })

    if (!guest) {
        guest = await prisma.guest.create({
            data: {
                name: guestName,
                email: guestEmail,
                phone: guestPhone
            }
        })
    }

    const room = await prisma.room.findUnique({
        where: { number: roomNumber }
    })

    if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const booking = await prisma.booking.create({
        data: {
            guestId: guest.id,
            roomId: room.id,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            totalAmount: parseFloat(totalAmount),
            status: 'CONFIRMED'
        }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
