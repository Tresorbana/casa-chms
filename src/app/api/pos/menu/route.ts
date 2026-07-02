import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'

    const where = showAll ? {} : { available: true }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { category: 'asc' }
    })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, price, description, inventoryItemId } = body;
    const parsedPrice = Number(price);

    if (!name || !category || Number.isNaN(parsedPrice)) {
      return NextResponse.json({ error: 'Name, category, and valid price are required' }, { status: 400 });
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        category,
        price: parsedPrice,
        description: description || null,
        inventoryItemId: inventoryItemId || null,
      }
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}
