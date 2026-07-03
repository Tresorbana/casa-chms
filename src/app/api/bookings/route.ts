import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const skip = parseInt(searchParams.get('skip') ?? '0')
    const take = Math.min(parseInt(searchParams.get('take') ?? '100'), 200)
    const status = searchParams.get('status')

    const bookings = await prisma.booking.findMany({
      where: status ? { status } : undefined,
      include: { guest: true, room: { select: { id: true, number: true, type: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    })
    return NextResponse.json(bookings, {
      headers: { 'Cache-Control': 'private, s-maxage=15, stale-while-revalidate=30' },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const createdByName = session?.user?.name ?? null;

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

    // Strict date validation
    const newCheckIn = new Date(checkIn)
    const newCheckOut = new Date(checkOut)

    if (isNaN(newCheckIn.getTime()) || isNaN(newCheckOut.getTime())) {
      return NextResponse.json({ error: 'Invalid dates provided' }, { status: 400 })
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    if (newCheckIn < todayStart) {
      return NextResponse.json({
        error: 'Invalid check-in date',
        message: 'Check-in date cannot be in the past.'
      }, { status: 400 })
    }

    if (newCheckOut <= newCheckIn) {
      return NextResponse.json({
        error: 'Invalid dates',
        message: 'Check-out must be after check-in.'
      }, { status: 400 })
    }

    const maxStay = new Date(newCheckIn)
    maxStay.setFullYear(maxStay.getFullYear() + 1)
    if (newCheckOut > maxStay) {
      return NextResponse.json({
        error: 'Invalid dates',
        message: 'Stay cannot exceed one year.'
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
        status: 'CONFIRMED',
        createdByName,
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
