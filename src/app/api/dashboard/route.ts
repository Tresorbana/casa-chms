import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Stats
    const totalRooms = await prisma.room.count()
    const occupiedRooms = await prisma.room.count({
      where: { status: 'OCCUPIED' }
    })

    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0

    // Today's Bookings
    const bookingsToday = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: today
        }
      }
    })

    // Revenue calculation
    const revenueToday = bookingsToday.reduce((acc: number, booking: any) => acc + booking.totalAmount, 0)

    const allBookings = await prisma.booking.findMany()
    const totalRevenue = allBookings.reduce((acc: number, booking: any) => acc + booking.totalAmount, 0)

    const pendingReservations = await prisma.booking.count({
      where: { status: 'PENDING' }
    })

    // Room Status Grid
    const rooms = await prisma.room.findMany({
      orderBy: { number: 'asc' },
      include: {
        bookings: {
          where: {
            status: 'CHECKED_IN'
          },
          take: 1
        }
      }
    })

    return NextResponse.json({
      stats: {
        occupancyRate,
        revenueToday,
        pendingReservations
      },
      rooms
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
