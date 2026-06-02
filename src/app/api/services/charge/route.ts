import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { serviceId, bookingId, guestName, guestContact, quantity = 1 } = body;

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

        const totalPrice = service.price * parseInt(quantity);
        const isWalkIn = !bookingId;

        const charge = await prisma.serviceCharge.create({
            data: {
                serviceId,
                bookingId: bookingId || null,
                guestName: guestName || null,
                guestContact: guestContact || null,
                quantity: parseInt(quantity),
                totalPrice,
                status: isWalkIn ? 'PAID' : 'PENDING',
            },
        });

        // Walk-in charges are paid immediately — create a SERVICE invoice for finance tracking
        let invoice = null;
        if (isWalkIn) {
            invoice = await prisma.invoice.create({
                data: {
                    guestName,
                    amount: totalPrice,
                    type: 'SERVICE',
                    status: 'PAID',
                    paidAt: new Date(),
                    items: {
                        create: [{
                            description: service.name,
                            quantity: parseInt(quantity),
                            price: service.price,
                        }],
                    },
                },
            });
        }

        return NextResponse.json({ charge, invoiceId: invoice?.id ?? null });
    } catch (error) {
        console.error('Service Charge Error:', error);
        return NextResponse.json({ error: 'Failed to charge service' }, { status: 500 });
    }
}
