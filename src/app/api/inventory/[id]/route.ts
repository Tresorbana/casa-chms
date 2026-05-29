import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const body = await request.json();
    const { stock, adjustment, minStock, name, category, unit, price } = body;

    const existing = await prisma.inventoryItem.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    let nextStock = existing.stock;
    if (typeof stock === 'number') {
      nextStock = stock;
    } else if (typeof adjustment === 'number') {
      nextStock = Math.max(0, existing.stock + adjustment);
    }

    const item = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        stock: nextStock,
        ...(minStock !== undefined && { minStock: parseInt(String(minStock), 10) }),
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(unit !== undefined && { unit }),
        ...(price !== undefined && { price: parseFloat(String(price)) }),
      },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Failed to update inventory item' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await prisma.inventoryItem.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
