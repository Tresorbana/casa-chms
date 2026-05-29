import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function dateRangeFilter(start: string | null, end: string | null, field: 'createdAt' | 'date' | 'checkIn') {
  if (!start || !end) return {};
  const range = { gte: new Date(start), lte: new Date(end) };
  if (field === 'date') return { date: range };
  if (field === 'checkIn') return { checkIn: { lte: new Date(end) }, checkOut: { gte: new Date(start) } };
  return { createdAt: range };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const bookingWhere = dateRangeFilter(start, end, 'checkIn');
    const invoiceDateWhere = start && end ? { date: { gte: new Date(start), lte: new Date(end) } } : {};
    const chargeWhere = start && end ? { date: { gte: new Date(start), lte: new Date(end) } } : {};

    const [rooms, inventory, restaurantInvoices, roomInvoices, allInvoices, bookings, conferenceBookings, serviceCharges] =
      await Promise.all([
        prisma.room.findMany({
          orderBy: { number: 'asc' },
          include: {
            floor: true,
            bookings: {
              where: { status: { in: ['CONFIRMED', 'CHECKED_IN'] } },
              include: { guest: true },
              take: 1,
            },
          },
        }),
        prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } }),
        prisma.invoice.findMany({
          where: { type: 'RESTAURANT', ...invoiceDateWhere },
          orderBy: { date: 'desc' },
          include: { items: true },
        }),
        prisma.invoice.findMany({
          where: { type: 'ROOM', ...invoiceDateWhere },
          orderBy: { date: 'desc' },
        }),
        prisma.invoice.findMany({
          where: invoiceDateWhere,
          orderBy: { date: 'desc' },
        }),
        prisma.booking.findMany({
          where: bookingWhere,
          orderBy: { createdAt: 'desc' },
          include: { guest: true, room: true },
        }),
        prisma.conferenceBooking.findMany({
          where:
            start && end
              ? {
                  startTime: { lte: new Date(end) },
                  endTime: { gte: new Date(start) },
                }
              : {},
          orderBy: { startTime: 'desc' },
          include: { conferenceRoom: true },
        }),
        prisma.serviceCharge.findMany({
          where: chargeWhere,
          include: { service: true, booking: { include: { room: true, guest: true } } },
        }),
      ]);

    const restaurantSalesTotal = restaurantInvoices.reduce((s, i) => s + i.amount, 0);
    const roomRevenueTotal = bookings.reduce((s, b) => s + b.totalAmount, 0);
    const conferenceTotal = conferenceBookings.reduce((s, c) => s + c.totalAmount, 0);
    const inventoryValue = inventory.reduce((s, i) => s + i.stock * i.price, 0);

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      dateRange: start && end ? { start, end } : null,
      summary: {
        totalRooms: rooms.length,
        occupiedRooms: rooms.filter((r) => r.status === 'OCCUPIED').length,
        inventoryItems: inventory.length,
        lowStockItems: inventory.filter((i) => i.stock <= (i.minStock || 5)).length,
        inventoryValue,
        restaurantSales: restaurantSalesTotal,
        restaurantOrders: restaurantInvoices.length,
        roomBookings: bookings.length,
        roomRevenue: roomRevenueTotal,
        conferenceBookings: conferenceBookings.length,
        conferenceRevenue: conferenceTotal,
        totalInvoices: allInvoices.length,
        paidInvoices: allInvoices.filter((i) => i.status === 'PAID').length,
        unpaidInvoices: allInvoices.filter((i) => i.status === 'UNPAID').length,
      },
      rooms: rooms.map((r) => {
        const b = r.bookings[0];
        return {
          number: r.number,
          type: r.type,
          status: r.status,
          price: r.price,
          floor:
            r.floor?.name ||
            (r.floor?.number != null ? `Floor ${r.floor.number}` : '—'),
          guest: b?.guest?.name || '',
          checkIn: b?.checkIn || null,
          checkOut: b?.checkOut || null,
        };
      }),
      inventory: inventory.map((i) => ({
        name: i.name,
        category: i.category,
        stock: i.stock,
        unit: i.unit,
        price: i.price,
        minStock: i.minStock,
        value: i.stock * i.price,
        status: i.stock <= (i.minStock || 5) ? 'Low stock' : 'Good',
      })),
      restaurant: restaurantInvoices.map((inv) => ({
        id: inv.id,
        guestName: inv.guestName,
        amount: inv.amount,
        status: inv.status,
        paymentMethod: inv.paymentMethod,
        date: inv.date,
        items: inv.items.map((it) => `${it.description} x${it.quantity}`).join('; '),
      })),
      roomInvoices: roomInvoices.map((inv) => ({
        id: inv.id,
        guestName: inv.guestName,
        amount: inv.amount,
        status: inv.status,
        paymentMethod: inv.paymentMethod,
        date: inv.date,
      })),
      allInvoices: allInvoices.map((inv) => ({
        id: inv.id,
        guestName: inv.guestName,
        type: inv.type,
        amount: inv.amount,
        status: inv.status,
        paymentMethod: inv.paymentMethod,
        date: inv.date,
      })),
      bookings: bookings.map((b) => ({
        id: b.id,
        guest: b.guest.name,
        room: b.room.number,
        roomType: b.room.type,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        totalAmount: b.totalAmount,
        status: b.status,
      })),
      conference: conferenceBookings.map((c) => ({
        guestName: c.guestName,
        venue: c.conferenceRoom.name,
        bookingType: c.bookingType,
        startTime: c.startTime,
        endTime: c.endTime,
        totalAmount: c.totalAmount,
        status: c.status,
      })),
      services: serviceCharges.map((sc) => ({
        service: sc.service.name,
        guest: sc.guestName || sc.booking?.guest?.name || '',
        room: sc.booking?.room?.number || '',
        quantity: sc.quantity,
        totalPrice: sc.totalPrice,
        status: sc.status,
        date: sc.date,
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to build export bundle' }, { status: 500 });
  }
}
