import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const id = params.id
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

        await prisma.menuItem.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
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
        const { name, category, price, description, available, inventoryItemId } = body

        const updates: Record<string, unknown> = {}
        if (name !== undefined) updates.name = name
        if (category !== undefined) updates.category = category
        if (price !== undefined) {
            const parsedPrice = Number(price)
            if (Number.isNaN(parsedPrice)) {
                return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
            }
            updates.price = parsedPrice
        }
        if (description !== undefined) updates.description = description
        if (available !== undefined) {
            updates.available = typeof available === 'string' ? available === 'true' : Boolean(available)
        }
        if (inventoryItemId !== undefined) updates.inventoryItemId = inventoryItemId || null

        const item = await prisma.menuItem.update({
            where: { id },
            data: updates
        })

        return NextResponse.json(item)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
    }
}
