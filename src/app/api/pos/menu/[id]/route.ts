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
        const { name, category, price, description, available } = body

        const item = await prisma.menuItem.update({
            where: { id },
            data: {
                name,
                category,
                price: price ? parseFloat(price) : undefined,
                description,
                available
            }
        })

        return NextResponse.json(item)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
    }
}
