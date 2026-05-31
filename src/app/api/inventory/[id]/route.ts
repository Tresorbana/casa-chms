import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const body = await request.json();
    const { stock, adjustment, minStock, name, category, unit, price, reason } = body;

    const existing = await prisma.inventoryItem.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    let nextStock = existing.stock;
    let stockDelta = 0;

    if (typeof stock === 'number') {
      stockDelta = stock - existing.stock;
      nextStock = stock;
    } else if (typeof adjustment === 'number') {
      stockDelta = adjustment;
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

    // Record a StockMovement whenever stock actually changes
    if (stockDelta !== 0) {
      await prisma.stockMovement.create({
        data: {
          itemId: params.id,
          type: stockDelta > 0 ? 'IN' : 'OUT',
          quantity: Math.abs(stockDelta),
          reason: reason || 'MANUAL_ADJUSTMENT',
        },
      });
    }

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
