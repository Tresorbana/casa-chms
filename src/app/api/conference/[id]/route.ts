
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const id = params.id
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

        await prisma.conferenceRoom.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const id = params.id
        const body = await request.json()
        const { name, capacity, pricePerHour, pricePerDay } = body

        const room = await prisma.conferenceRoom.update({
            where: { id },
            data: {
                name,
                capacity: capacity ? parseInt(capacity) : undefined,
                pricePerHour: pricePerHour !== undefined ? parseFloat(pricePerHour) : undefined,
                pricePerDay: pricePerDay !== undefined ? parseFloat(pricePerDay) : undefined,
            }
        })

        return NextResponse.json(room)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update room' }, { status: 500 })
    }
}
