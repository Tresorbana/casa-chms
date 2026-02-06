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
                const restSales = await prisma.invoice.aggregate({
                    _sum: { amount: true },
                    where: {
                        type: 'RESTAURANT',
                        ...(dateFilter.createdAt ? { date: dateFilter.createdAt } : {})
                    }
                });
                const restRecords = await prisma.invoice.findMany({
                    where: {
                        type: 'RESTAURANT',
                        ...(dateFilter.createdAt ? { date: dateFilter.createdAt } : {})
                    },
                    orderBy: { date: 'desc' },
                    include: { items: true }
                });
                data = {
                    totalSales: restSales._sum?.amount || 0,
                    records: restRecords.map(inv => ({
                        id: inv.id,
                        room: { type: 'DINING', number: 'WALK-IN' },
                        totalAmount: inv.amount,
                        createdAt: inv.date
                    }))
                };
                break;

            case 'MENU_PERFORMANCE':
                // Aggregate invoice items where invoice type is RESTAURANT
                const menuItems = await prisma.invoiceItem.groupBy({
                    by: ['description'],
                    _sum: { quantity: true, price: true },
                    where: {
                        invoice: {
                            type: 'RESTAURANT',
                            ...(dateFilter.createdAt ? { date: dateFilter.createdAt } : {})
                        }
                    },
                    orderBy: {
                        _sum: { quantity: 'desc' }
                    }
                });
                data = {
                    records: menuItems.map(item => ({
                        id: item.description,
                        room: { type: 'ITEM', number: item.description },
                        totalAmount: item._sum.price || 0,
                        createdAt: new Date().toISOString(), // No specific date for aggregate
                        quantity: item._sum.quantity
                    }))
                };
                break;

            case 'RESTAURANT_ORDERS':
                // Similar to SALES but focused on order count/volume
                const orderCount = await prisma.invoice.count({
                    where: {
                        type: 'RESTAURANT',
                        ...(dateFilter.createdAt ? { date: dateFilter.createdAt } : {})
                    }
                });
                data = {
                    totalOrders: orderCount,
                    // Re-use sales records layout
                    records: []
                };
                break;

            case 'EXTRA_SERVICES':
                const serviceCharges = await prisma.serviceCharge.findMany({
                    where: dateFilter,
                    include: { service: true }
                });
                data = {
                    records: serviceCharges.map(sc => ({
                        id: sc.id,
                        room: { type: 'SERVICE', number: sc.service.name },
                        totalAmount: sc.totalPrice,
                        createdAt: sc.date
                    }))
                };
                break;

            case 'GUEST_STAY':
                const stays = await prisma.booking.findMany({
                    where: {
                        ...dateFilter,
                        status: 'CHECKED_OUT'
                    },
                    include: { guest: true, room: true }
                });
                data = {
                    records: stays.map(b => ({
                        id: b.id,
                        room: { type: b.room.type, number: b.room.number },
                        totalAmount: b.totalAmount,
                        createdAt: b.checkOut,
                        details: `${b.guest.name} (${Math.ceil((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights)`
                    }))
                };
                break;

            case 'RESERVATIONS':
                const reservations = await prisma.booking.groupBy({
                    by: ['status'],
                    _count: { id: true },
                    where: dateFilter
                });
                data = {
                    breakdown: reservations.map(r => ({ type: r.status, _count: r._count }))
                };
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
