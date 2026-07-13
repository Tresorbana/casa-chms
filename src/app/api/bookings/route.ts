import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { recordActivity } from '@/lib/activity-log'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const skip = parseInt(searchParams.get('skip') ?? '0')
    const take = Math.min(parseInt(searchParams.get('take') ?? '100'), 200)
    const status = searchParams.get('status')

    let bookings: any[]
    try {
      bookings = await prisma.booking.findMany({
        where: status ? { status } : undefined,
        include: {
          guest: true,
          room: { select: { id: true, number: true, type: true } },
          invoice: { select: { id: true, status: true, paymentMethod: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      })
    } catch {
      // Fallback if Prisma client hasn't regenerated yet after schema change
      bookings = await prisma.booking.findMany({
        where: status ? { status } : undefined,
        include: {
          guest: true,
          room: { select: { id: true, number: true, type: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      })
    }
    return NextResponse.json(bookings, {
      headers: { 'Cache-Control': 'private, s-maxage=15, stale-while-revalidate=30' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    const createdByName = session?.user?.name ?? null

    const body = await request.json()
    const { guestName, guestEmail, guestPhone, guestIdNumber, roomNumber, checkIn, checkOut, totalAmount, nationality, source } = body

    const isWalkIn = source === 'WALK_IN'
    const now = new Date()

    // Find or create guest — email is optional for walk-ins
    let guest = null
    if (guestEmail && guestEmail.trim()) {
      guest = await prisma.guest.findFirst({ where: { email: guestEmail } })
    }
    if (!guest) {
      guest = await prisma.guest.create({
        data: {
          name: guestName,
          ...(guestEmail?.trim() && { email: guestEmail }),
          ...(guestPhone && { phone: guestPhone }),
          ...(nationality && { nationality }),
          ...(guestIdNumber && { idNumber: guestIdNumber }),
        },
      })
    } else if (nationality && !guest.nationality) {
      guest = await prisma.guest.update({ where: { id: guest.id }, data: { nationality } })
    }

    const room = await prisma.room.findUnique({ where: { number: roomNumber } })
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

    // Walk-ins check in right now; regular bookings use the provided checkIn date
    const effectiveCheckIn = isWalkIn ? now : new Date(checkIn)
    const newCheckOut = new Date(checkOut)

    if (isNaN(effectiveCheckIn.getTime()) || isNaN(newCheckOut.getTime())) {
      return NextResponse.json({ error: 'Invalid dates provided' }, { status: 400 })
    }
    if (newCheckOut <= effectiveCheckIn) {
      return NextResponse.json({ error: 'Invalid dates', message: 'Check-out must be after check-in.' }, { status: 400 })
    }
    const maxStay = new Date(effectiveCheckIn)
    maxStay.setFullYear(maxStay.getFullYear() + 1)
    if (newCheckOut > maxStay) {
      return NextResponse.json({ error: 'Invalid dates', message: 'Stay cannot exceed one year.' }, { status: 400 })
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        roomId: room.id,
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        OR: [{ AND: [{ checkIn: { lt: newCheckOut } }, { checkOut: { gt: effectiveCheckIn } }] }],
      },
    })
    if (existingBooking) {
      return NextResponse.json({
        error: 'Room Conflict',
        message: `Room ${roomNumber} is already occupied or reserved for these dates.`,
      }, { status: 409 })
    }

    let bookingStatus: string
    let checkedInAt: Date | null = null
    let checkedOutAt: Date | null = null

    if (isWalkIn) {
      bookingStatus = 'CHECKED_IN'
      checkedInAt = now
    } else if (newCheckOut <= now) {
      bookingStatus = 'CHECKED_OUT'
      checkedInAt = effectiveCheckIn
      checkedOutAt = newCheckOut
    } else if (effectiveCheckIn <= now) {
      bookingStatus = 'CHECKED_IN'
      checkedInAt = effectiveCheckIn
    } else {
      bookingStatus = 'CONFIRMED'
    }

    const amount = parseFloat(totalAmount)
    const nights = Math.max(1, Math.ceil((newCheckOut.getTime() - effectiveCheckIn.getTime()) / (1000 * 60 * 60 * 24)))

    const booking = await prisma.booking.create({
      data: {
        guestId: guest.id,
        roomId: room.id,
        checkIn: effectiveCheckIn,
        checkOut: newCheckOut,
        totalAmount: amount,
        status: bookingStatus,
        createdByName,
        source: source || 'DIRECT',
        ...(checkedInAt && { checkedInAt }),
        ...(checkedOutAt && { checkedOutAt }),
      },
    })

    // Auto-create hotel invoice linked to this booking
    await prisma.invoice.create({
      data: {
        guestName,
        amount,
        type: 'ROOM',
        bookingId: booking.id,
        roomId: room.id,
        createdByName,
        guestSignature: guestName,
        items: {
          create: [{
            description: `Room ${room.number} (${room.type}) — ${nights} night${nights !== 1 ? 's' : ''}`,
            quantity: nights,
            price: amount / nights,
          }],
        },
      },
    })

    // Mark room as occupied for active stays
    if (bookingStatus === 'CHECKED_IN') {
      await prisma.room.update({ where: { id: room.id }, data: { status: 'OCCUPIED' } })
    }

    await recordActivity({
      user: session?.user,
      action: isWalkIn ? 'BOOKING_WALK_IN' : 'BOOKING_CREATED',
      category: 'BOOKINGS',
      entity: 'Booking',
      entityId: booking.id,
      method: 'POST',
      path: '/api/bookings',
      metadata: {
        guestName,
        roomNumber,
        nights,
        totalAmount: amount,
        source: source || 'DIRECT',
        status: bookingStatus,
      },
      request,
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
