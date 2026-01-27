import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { number: 'asc' },
      include: {
        bookings: {
            where: {
                status: 'CHECKED_IN'
            },
            include: {
                guest: true
            }
        }
      }
    })
    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body
    
    const room = await prisma.room.update({
        where: { id },
        data: { status }
    })
    
    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 })
  }
}
