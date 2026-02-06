import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const start = searchParams.get('start')
        const end = searchParams.get('end')

        // 1. Booking Revenue
        const bookingFilter: any = (start && end) ? {
            OR: [
                {
                    AND: [
                        { checkIn: { lte: new Date(end) } },
                        { checkOut: { gte: new Date(start) } }
                    ]
                }
            ]
        } : {}

        const bookingRevenue = await prisma.booking.aggregate({
            _sum: { totalAmount: true },
            where: bookingFilter
        })

        // 2. Conference Revenue
        const conferenceFilter: any = (start && end) ? {
            OR: [
                {
                    AND: [
                        { startTime: { lte: new Date(end) } },
                        { endTime: { gte: new Date(start) } }
                    ]
                }
            ]
        } : {}

        const conferenceRevenue = await prisma.conferenceBooking.aggregate({
            _sum: { totalAmount: true },
            where: conferenceFilter
        })

        // 3. Invoice (Restaurant/POS) Revenue
        const invoiceFilter: any = (start && end) ? {
            date: {
                gte: new Date(start),
                lte: new Date(end)
            }
        } : {}

        const invoiceRevenueResult = await prisma.invoice.aggregate({
            _sum: { amount: true },
            where: invoiceFilter
        })

        const totalRevenue = (bookingRevenue._sum.totalAmount || 0) +
            (conferenceRevenue._sum.totalAmount || 0) +
            (invoiceRevenueResult._sum.amount || 0)

        const totalBookings = await prisma.booking.count({ where: bookingFilter })

        const totalRooms = await prisma.room.count()
        const occupiedRooms = await prisma.room.count({
            where: { status: 'OCCUPIED' }
        })
        const avgOccupancy = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0

        // Detailed records - Room Bookings
        const roomBookings = await prisma.booking.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            where: bookingFilter,
            include: {
                guest: true,
                room: true
            }
        })

        // Detailed records - Conference Bookings
        const conferenceBookings = await prisma.conferenceBooking.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            where: conferenceFilter,
            include: {
                conferenceRoom: true
            }
        })

        return NextResponse.json({
            summary: {
                totalRevenue,
                bookingRevenue: bookingRevenue._sum.totalAmount || 0,
                conferenceRevenue: conferenceRevenue._sum.totalAmount || 0,
                restaurantRevenue: invoiceRevenueResult._sum.amount || 0,
                avgOccupancy,
                totalBookings,
            },
            records: [
                ...roomBookings.map(r => ({
                    id: r.id,
                    type: 'ROOM',
                    guestName: r.guest.name,
                    nationality: r.guest.nationality || 'Unknown',
                    roomNumber: r.room.number,
                    roomType: r.room.type,
                    dates: `${r.checkIn.toLocaleDateString()} - ${r.checkOut.toLocaleDateString()}`,
                    checkIn: r.checkIn,
                    checkOut: r.checkOut,
                    revenue: r.totalAmount,
                    status: r.status,
                    createdAt: r.createdAt
                })),
                ...conferenceBookings.map(c => ({
                    id: c.id,
                    type: 'CONFERENCE',
                    guestName: c.guestName,
                    nationality: 'Event',
                    roomNumber: c.conferenceRoom.name,
                    roomType: 'Conference Room',
                    dates: `${c.startTime.toLocaleDateString()} ${c.startTime.toLocaleTimeString()} - ${c.endTime.toLocaleTimeString()}`,
                    checkIn: c.startTime,
                    checkOut: c.endTime,
                    revenue: c.totalAmount,
                    status: c.status,
                    createdAt: c.createdAt
                }))
            ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
    }
}
