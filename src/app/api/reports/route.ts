import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        // Basic stats
        const totalRevenue = await prisma.booking.aggregate({
            _sum: { totalAmount: true }
        })

        const totalBookings = await prisma.booking.count()

        const totalRooms = await prisma.room.count()
        const occupiedRooms = await prisma.room.count({
            where: { status: 'OCCUPIED' }
        })
        const avgOccupancy = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0

        // Detailed records
        const records = await prisma.booking.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                guest: true,
                room: true
            }
        })

        return NextResponse.json({
            summary: {
                totalRevenue: totalRevenue._sum.totalAmount || 0,
                avgOccupancy,
                totalBookings,
                restaurantSales: 32840 // Mocking POS for now as it's a separate model we'd need to aggregate
            },
            records: records.map(r => ({
                id: r.id,
                guestName: r.guest.name,
                nationality: 'Domestic', // Assuming domestic if not specified
                roomType: r.room.type,
                dates: `${r.checkIn.toLocaleDateString()} - ${r.checkOut.toLocaleDateString()}`,
                revenue: r.totalAmount,
                status: r.status
            }))
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
    }
}
