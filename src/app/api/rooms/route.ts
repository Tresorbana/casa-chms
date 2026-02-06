import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { number: 'asc' },
      include: {
        floor: true,
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'CHECKED_IN'] }
          },
          include: {
            guest: true
          }
        }
      }
    })

    const now = new Date()
    const processedRooms = rooms.map(room => {
      const activeBooking = room.bookings.find(b => {
        const start = new Date(b.checkIn)
        const end = new Date(b.checkOut)
        return start <= now && end >= now
      })

      let currentStatus = room.status
      if (activeBooking && room.status !== 'MAINTENANCE') {
        currentStatus = 'OCCUPIED'
      } else if (!activeBooking && room.status === 'OCCUPIED') {
        currentStatus = 'AVAILABLE'
      }

      return {
        ...room,
        status: currentStatus,
        activeBooking: activeBooking || null
      }
    })

    return NextResponse.json(processedRooms)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { number, type, price, floorId } = body

    const room = await prisma.room.create({
      data: {
        number,
        type,
        price: parseFloat(price),
        floorId,
        status: 'AVAILABLE'
      }
    })

    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status, number, type, price, floorId } = body

    const data: any = {}
    if (status) data.status = status
    if (number) data.number = number
    if (type) data.type = type
    if (price) data.price = parseFloat(price)
    if (floorId) data.floorId = floorId

    const room = await prisma.room.update({
      where: { id },
      data
    })

    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 })
  }
}

