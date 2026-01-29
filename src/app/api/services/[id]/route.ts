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

        await prisma.service.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
    }
}
