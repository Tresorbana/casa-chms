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
    const { guestName, guestEmail, guestPhone, roomNumber, checkIn, checkOut, totalAmount, nationality } = body

    // Find or create guest
    let guest = await prisma.guest.findFirst({
      where: { email: guestEmail }
    })

    if (!guest) {
      guest = await prisma.guest.create({
        data: {
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
          nationality: nationality
        }
      })
    } else if (nationality && !guest.nationality) {
      // Update nationality if missing
      guest = await prisma.guest.update({
        where: { id: guest.id },
        data: { nationality }
      })
    }

    const room = await prisma.room.findUnique({
      where: { number: roomNumber }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Check for overlapping bookings
    const newCheckIn = new Date(checkIn)
    const newCheckOut = new Date(checkOut)

    if (newCheckOut <= newCheckIn) {
      return NextResponse.json({
        error: 'Invalid Dates',
        message: 'Check-out date must be after check-in date.'
      }, { status: 400 })
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        roomId: room.id,
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        OR: [
          {
            AND: [
              { checkIn: { lt: newCheckOut } },
              { checkOut: { gt: newCheckIn } }
            ]
          }
        ]
      }
    })

    if (existingBooking) {
      return NextResponse.json({
        error: 'Room Conflict',
        message: `Room ${roomNumber} is already occupied or reserved for these dates.`
      }, { status: 409 })
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

    // Update room status to OCCUPIED if the booking is for now/today
    const now = new Date()
    const start = new Date(checkIn)
    const end = new Date(checkOut)

    if (start <= now && end >= now) {
      await prisma.room.update({
        where: { id: room.id },
        data: { status: 'OCCUPIED' }
      })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
