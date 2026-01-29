import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const start = searchParams.get('start')
        const end = searchParams.get('end')

        const dateFilter: any = {}
        if (start && end) {
            dateFilter.createdAt = {
                gte: new Date(start),
                lte: new Date(end)
            }
        }

        // Revenue from Bookings
        const bookingRevenue = await prisma.booking.aggregate({
            _sum: { totalAmount: true },
            where: dateFilter
        })

        // Revenue from Conference (if dates apply to created? Or event time? Using created for now)
        const conferenceRevenue = await prisma.conferenceBooking.aggregate({
            _sum: { totalAmount: true },
            where: dateFilter
        })

        // Revenue from Invoices (Restaurant/POS)
        const invoiceRevenue = await prisma.invoice.aggregate({
            _sum: { amount: true },
            where: {
                ...dateFilter,
                // For invoices, date field is 'date', not 'createdAt'
                date: dateFilter.createdAt
            }
        })
        // Fix invoice filter key
        const invoiceFilter: any = {}
        if (start && end) {
            invoiceFilter.date = {
                gte: new Date(start),
                lte: new Date(end)
            }
        }
        const invoiceRevenueCorrect = await prisma.invoice.aggregate({
            _sum: { amount: true },
            where: invoiceFilter
        })


        const totalRevenue = (bookingRevenue._sum.totalAmount || 0) +
            (conferenceRevenue._sum.totalAmount || 0) +
            (invoiceRevenueCorrect._sum.amount || 0)

        const totalBookings = await prisma.booking.count({ where: dateFilter })

        const totalRooms = await prisma.room.count()
        const occupiedRooms = await prisma.room.count({
            where: { status: 'OCCUPIED' }
        })
        const avgOccupancy = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0

        // Detailed records
        const records = await prisma.booking.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            where: dateFilter,
            include: {
                guest: true,
                room: true
            }
        })

        return NextResponse.json({
            summary: {
                totalRevenue,
                bookingRevenue: bookingRevenue._sum.totalAmount || 0,
                conferenceRevenue: conferenceRevenue._sum.totalAmount || 0,
                restaurantRevenue: invoiceRevenueCorrect._sum.amount || 0,
                avgOccupancy,
                totalBookings,
            },
            records: records.map(r => ({
                id: r.id,
                guestName: r.guest.name,
                nationality: r.guest.nationality || 'Unknown',
                roomType: r.room.type,
                dates: `${r.checkIn.toLocaleDateString()} - ${r.checkOut.toLocaleDateString()}`,
                checkIn: r.checkIn,
                checkOut: r.checkOut,
                revenue: r.totalAmount,
                status: r.status,
                createdAt: r.createdAt
            }))
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
    }
}
