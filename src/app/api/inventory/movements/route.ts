import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    const movements = await prisma.stockMovement.findMany({
      where: itemId ? { itemId } : undefined,
      include: { item: { select: { name: true, unit: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return NextResponse.json(movements);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch movements' }, { status: 500 });
  }
}
