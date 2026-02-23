import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const floors = await prisma.floor.findMany({
            orderBy: { number: 'asc' },
            include: {
                rooms: true,
            },
        });
        return NextResponse.json(floors, {
            headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch floors' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { number } = body;

        const floor = await prisma.floor.create({
            data: {
                number: parseInt(number),
            },
        });

        return NextResponse.json(floor);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create floor' }, { status: 500 });
    }
}
