import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const dateFilter = {
      ...(from && { gte: new Date(from) }),
      ...(to && { lte: new Date(to + 'T23:59:59.999Z') }),
    };

    const bookings = await prisma.conferenceBooking.findMany({
      where: Object.keys(dateFilter).length ? { startTime: dateFilter } : undefined,
      include: {
        conferenceRoom: true,
        items: true,
      },
      orderBy: { startTime: 'desc' },
    });

    // For each booking, get linked hotel bookings info
    const allLinkedIds = bookings.flatMap(b => b.linkedBookingIds);
    const linkedHotelBookings = allLinkedIds.length
      ? await prisma.booking.findMany({
          where: { id: { in: allLinkedIds } },
          include: { guest: true, room: true },
        })
      : [];

    const linkedMap = Object.fromEntries(linkedHotelBookings.map(b => [b.id, b]));

    const report = bookings.map(b => {
      const itemsTotal = b.items.reduce((s, i) => s + i.totalPrice, 0);
      const grandTotal = b.totalAmount + itemsTotal;
      const linkedRooms = b.linkedBookingIds.map(id => linkedMap[id]).filter(Boolean);

      return {
        id: b.id,
        guestName: b.guestName,
        guestContact: b.guestContact,
        guestEmail: b.guestEmail,
        venue: b.conferenceRoom.name,
        bookingType: b.bookingType,
        startTime: b.startTime,
        endTime: b.endTime,
        status: b.status,
        venueFee: b.totalAmount,
        extrasTotal: itemsTotal,
        grandTotal,
        extras: b.items,
        invoiceId: b.invoiceId,
        checkedInAt: b.checkedInAt,
        checkedOutAt: b.checkedOutAt,
        notes: b.notes,
        linkedRooms: linkedRooms.map(r => ({
          id: r.id,
          guestName: r.guest.name,
          roomNumber: r.room.number,
          roomType: r.room.type,
          checkIn: r.checkIn,
          checkOut: r.checkOut,
          amount: r.totalAmount,
          status: r.status,
        })),
        linkedRoomsTotal: linkedRooms.reduce((s, r) => s + r.totalAmount, 0),
        fullTotal: grandTotal + linkedRooms.reduce((s, r) => s + r.totalAmount, 0),
      };
    });

    const summary = {
      totalBookings: report.length,
      totalRevenue: report.reduce((s, b) => s + b.grandTotal, 0),
      confirmedCount: report.filter(b => b.status === 'CONFIRMED').length,
      checkedInCount: report.filter(b => b.status === 'CHECKED_IN').length,
      checkedOutCount: report.filter(b => b.status === 'CHECKED_OUT').length,
      cancelledCount: report.filter(b => b.status === 'CANCELLED').length,
      invoicedCount: report.filter(b => b.status === 'INVOICED').length,
    };

    return NextResponse.json({ bookings: report, summary });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
