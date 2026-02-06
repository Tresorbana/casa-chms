import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    const targetDate = dateStr ? new Date(dateStr) : new Date()
    targetDate.setHours(0, 0, 0, 0)

    const nextDay = new Date(targetDate)
    nextDay.setDate(targetDate.getDate() + 1)

    // Room Status Grid with Dynamic Status for targetDate
    const rooms = await prisma.room.findMany({
      orderBy: { number: 'asc' },
      include: {
        floor: true,
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'CHECKED_IN'] },
            AND: [
              { checkIn: { lt: nextDay } },
              { checkOut: { gt: targetDate } }
            ]
          },
          include: {
            guest: true
          }
        }
      }
    })

    // Process rooms to determine dynamic status
    const processedRooms = rooms.map(room => {
      const activeBooking = room.bookings[0] // Since we filtered, the first one is the active one for this date
      return {
        ...room,
        displayStatus: activeBooking ? 'OCCUPIED' : 'AVAILABLE',
        activeBooking: activeBooking || null
      }
    })

    // Stats
    const totalRooms = processedRooms.length
    const occupiedRooms = processedRooms.filter(r => r.displayStatus === 'OCCUPIED').length
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0

    // Bookings created TODAY (not for targetDate, but physical creation)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const bookingsCreatedToday = await prisma.booking.findMany({
      where: {
        createdAt: { gte: today }
      }
    })

    const revenueToday = bookingsCreatedToday.reduce((acc: number, booking: any) => acc + booking.totalAmount, 0)

    const pendingReservations = await prisma.booking.count({
      where: { status: 'PENDING' }
    })

    return NextResponse.json({
      stats: {
        occupancyRate,
        revenueToday,
        pendingReservations
      },
      rooms: processedRooms
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
