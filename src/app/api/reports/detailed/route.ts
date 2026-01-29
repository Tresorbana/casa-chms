import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        const dateFilter: any = {};
        if (start && end) {
            dateFilter.createdAt = {
                gte: new Date(start),
                lte: new Date(end)
            };
        }

        let data: any = {};

        switch (type) {
            case 'OCCUPANCY':
                const totalRooms = await prisma.room.count();
                const occupied = await prisma.room.count({ where: { status: 'OCCUPIED' } });
                const vacant = totalRooms - occupied;
                const breakdown = await prisma.room.groupBy({
                    by: ['type'],
                    _count: { id: true },
                    where: { status: 'OCCUPIED' }
                });
                data = {
                    totalRooms,
                    occupied,
                    vacant,
                    occupancyRate: totalRooms ? (occupied / totalRooms) * 100 : 0,
                    breakdown
                };
                break;

            case 'REVENUE_ROOMS':
                const roomRevenue = await prisma.booking.aggregate({
                    _sum: { totalAmount: true },
                    where: dateFilter
                });
                const revenueRecords = await prisma.booking.findMany({
                    where: dateFilter,
                    select: {
                        id: true,
                        room: { select: { number: true, type: true } },
                        totalAmount: true,
                        createdAt: true
                    }
                });
                data = {
                    totalRevenue: roomRevenue._sum.totalAmount || 0,
                    records: revenueRecords
                };
                break;

            case 'ADR': // Average Daily Rate
            case 'REVPAR': // Revenue per Available Room
                const revTotal = await prisma.booking.aggregate({
                    _sum: { totalAmount: true },
                    where: dateFilter
                });
                const roomsSold = await prisma.booking.count({ where: dateFilter });
                const availableRooms = await prisma.room.count();
                const totalRevenueVal = revTotal._sum.totalAmount || 0;

                data = {
                    adr: roomsSold ? totalRevenueVal / roomsSold : 0,
                    revPar: availableRooms ? totalRevenueVal / availableRooms : 0,
                    totalRevenue: totalRevenueVal,
                    roomsSold,
                    totalRooms: availableRooms
                };
                break;

            case 'BOOKING_SOURCE':
                const bySource = await prisma.booking.groupBy({
                    by: ['source'] as any,
                    _count: { id: true },
                    where: dateFilter
                });
                data = { sources: bySource };
                break;

            case 'RESTAURANT_SALES':
                // Simulating restaurant sales from Invoices of type RESTAURANT
                // Note: In a real scenario, this would aggregate InvoiceItems linked to Restaurant Invoices
                const restSales = await prisma.invoice.aggregate({
                    _sum: { amount: true },
                    where: { ...dateFilter, type: 'RESTAURANT', date: dateFilter.createdAt }
                });
                data = { totalSales: restSales._sum.amount || 0 };
                break;

            default:
                // Summary Dashboard Data (Fallback)
                return NextResponse.json({ error: "Specify a valid report type" }, { status: 400 });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
