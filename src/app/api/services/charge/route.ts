import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { serviceId, bookingId, guestName, guestContact, quantity = 1, unit } = body;

        if (!serviceId) {
            return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
        }

        if (!bookingId && (!guestName || !guestContact)) {
            return NextResponse.json({ error: 'Either Booking ID or Guest Name/Contact is required' }, { status: 400 });
        }

        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        const totalPrice = service.price * quantity;

        const charge = await prisma.serviceCharge.create({
            data: {
                serviceId,
                bookingId: bookingId || null,
                guestName: guestName || null,
                guestContact: guestContact || null,
                quantity: parseInt(quantity),
                totalPrice,
                status: bookingId ? 'PENDING' : 'PAID', // Assume walk-ins pay immediately for now, or use 'PENDING' if tracking debt. Let's default to PENDING.
            },
        });

        return NextResponse.json(charge);
    } catch (error) {
        console.error('Service Charge Error:', error);
        return NextResponse.json({ error: 'Failed to charge service' }, { status: 500 });
    }
}
