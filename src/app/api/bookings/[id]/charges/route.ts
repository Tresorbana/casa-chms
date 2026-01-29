import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await request.json()
        const { serviceId, quantity } = body

        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        })

        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 })
        }

        const totalPrice = service.price * parseInt(quantity)

        const charge = await prisma.serviceCharge.create({
            data: {
                bookingId: params.id,
                serviceId,
                quantity: parseInt(quantity),
                totalPrice
            }
        })

        // Update booking total amount? Maybe not, usually calculated on checkout.
        // But Step 6 Schema Booking has totalAmount. 
        // I should probably update it, or leave it for checkout calculation.
        // I will update it just in case.

        const booking = await prisma.booking.findUnique({ where: { id: params.id } })
        if (booking) {
            await prisma.booking.update({
                where: { id: params.id },
                data: { totalAmount: booking.totalAmount + totalPrice }
            })
        }

        return NextResponse.json(charge)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add charge' }, { status: 500 })
    }
}
