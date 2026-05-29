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

            case 'RESTAURANT_ORDERS': {
                const orderWhere = {
                    type: 'RESTAURANT' as const,
                    ...(dateFilter.createdAt ? { date: dateFilter.createdAt } : {}),
                };
                const orderCount = await prisma.invoice.count({ where: orderWhere });
                const orderRecords = await prisma.invoice.findMany({
                    where: orderWhere,
                    orderBy: { date: 'desc' },
                    include: { items: true },
                });
                data = {
                    totalOrders: orderCount,
                    records: orderRecords.map((inv) => ({
                        id: inv.id,
                        guestName: inv.guestName,
                        details: inv.items.map((it) => `${it.description} x${it.quantity}`).join(', '),
                        totalAmount: inv.amount,
                        status: inv.status,
                        paymentMethod: inv.paymentMethod,
                        createdAt: inv.date,
                    })),
                };
                break;
            }

            case 'INVENTORY': {
                const inventoryItems = await prisma.inventoryItem.findMany({
                    orderBy: { name: 'asc' },
                });
                const lowStock = inventoryItems.filter((i) => i.stock <= (i.minStock || 5)).length;
                const stockValue = inventoryItems.reduce((s, i) => s + i.stock * i.price, 0);
                data = {
                    totalItems: inventoryItems.length,
                    lowStockItems: lowStock,
                    inventoryValue: stockValue,
                    records: inventoryItems.map((i) => ({
                        id: i.id,
                        details: i.name,
                        category: i.category,
                        quantity: i.stock,
                        unit: i.unit,
                        totalAmount: i.stock * i.price,
                        status: i.stock <= (i.minStock || 5) ? 'Low stock' : 'Good',
                    })),
                };
                break;
            }

            case 'ROOMS_STATUS': {
                const allRooms = await prisma.room.findMany({
                    orderBy: { number: 'asc' },
                    include: {
                        floor: true,
                        bookings: {
                            where: { status: { in: ['CONFIRMED', 'CHECKED_IN'] } },
                            include: { guest: true },
                            take: 1,
                        },
                    },
                });
                const occupiedCount = allRooms.filter((r) => r.status === 'OCCUPIED').length;
                data = {
                    totalRooms: allRooms.length,
                    occupied: occupiedCount,
                    vacant: allRooms.length - occupiedCount,
                    occupancyRate: allRooms.length ? (occupiedCount / allRooms.length) * 100 : 0,
                    records: allRooms.map((r) => {
                        const b = r.bookings[0];
                        return {
                            id: r.id,
                            room: { type: r.type, number: r.number },
                            details: b?.guest?.name || '—',
                            totalAmount: r.price,
                            status: r.status,
                            createdAt: b?.checkIn || null,
                        };
                    }),
                };
                break;
            }

            case 'CONFERENCE': {
                const confWhere =
                    start && end
                        ? {
                              startTime: { lte: new Date(end) },
                              endTime: { gte: new Date(start) },
                          }
                        : {};
                const confBookings = await prisma.conferenceBooking.findMany({
                    where: confWhere,
                    orderBy: { startTime: 'desc' },
                    include: { conferenceRoom: true },
                });
                const confRevenue = confBookings.reduce((s, c) => s + c.totalAmount, 0);
                data = {
                    totalBookings: confBookings.length,
                    totalRevenue: confRevenue,
                    records: confBookings.map((c) => ({
                        id: c.id,
                        details: `${c.guestName} — ${c.conferenceRoom.name}`,
                        totalAmount: c.totalAmount,
                        status: c.status,
                        bookingType: c.bookingType,
                        createdAt: c.startTime,
                    })),
                };
                break;
            }

            case 'INVOICES': {
                const invWhere = dateFilter.createdAt ? { date: dateFilter.createdAt } : {};
                const allInv = await prisma.invoice.findMany({
                    where: invWhere,
                    orderBy: { date: 'desc' },
                });
                const paidTotal = allInv.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
                data = {
                    totalInvoices: allInv.length,
                    paidInvoices: allInv.filter((i) => i.status === 'PAID').length,
                    unpaidInvoices: allInv.filter((i) => i.status === 'UNPAID').length,
                    totalRevenue: paidTotal,
                    breakdown: await prisma.invoice.groupBy({
                        by: ['type'],
                        _count: { id: true },
                        _sum: { amount: true },
                        where: invWhere,
                    }).then((rows) =>
                        rows.map((r) => ({
                            type: r.type,
                            _count: r._count,
                            revenue: r._sum.amount || 0,
                        }))
                    ),
                    records: allInv.map((inv) => ({
                        id: inv.id,
                        details: inv.guestName,
                        type: inv.type,
                        totalAmount: inv.amount,
                        status: inv.status,
                        paymentMethod: inv.paymentMethod,
                        createdAt: inv.date,
                    })),
                };
                break;
            }

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
