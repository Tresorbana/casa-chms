import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { number } = body;

        const floor = await prisma.floor.update({
            where: { id: params.id },
            data: {
                number: parseInt(number),
            },
        });

        return NextResponse.json(floor);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update floor' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await prisma.floor.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Floor deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete floor' }, { status: 500 });
    }
}
