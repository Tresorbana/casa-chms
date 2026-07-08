import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const itemId = searchParams.get('itemId') || undefined;

    const periodStart = start ? new Date(start) : undefined;
    const periodEnd = end ? new Date(new Date(end).setHours(23, 59, 59, 999)) : undefined;

    // All inventory items (optionally filtered)
    const allItems = await prisma.inventoryItem.findMany({
      where: itemId ? { id: itemId } : undefined,
      orderBy: { name: 'asc' },
    });

    // Movements in the selected period
    const periodMovements = await prisma.stockMovement.findMany({
      where: {
        ...(itemId ? { itemId } : {}),
        ...(periodStart || periodEnd
          ? {
              createdAt: {
                ...(periodStart ? { gte: periodStart } : {}),
                ...(periodEnd ? { lte: periodEnd } : {}),
              },
            }
          : {}),
      },
      include: { item: { select: { name: true, unit: true, category: true } } },
      orderBy: { createdAt: 'asc' },
    });

    // For opening balance: movements AFTER period start (to subtract from current stock)
    const movementsAfterPeriod = periodStart
      ? await prisma.stockMovement.findMany({
          where: {
            ...(itemId ? { itemId } : {}),
            createdAt: { gt: periodEnd ?? new Date() },
          },
          select: { itemId: true, type: true, quantity: true },
        })
      : [];

    // Compute per-item summary
    const itemMap = new Map(allItems.map((i) => [i.id, i]));

    // Closing balance = current stock (always)
    // Opening balance = closing_balance - sum(IN in period) + sum(OUT in period) + adjustments after period
    const perItem = allItems.map((item) => {
      const myMoves = periodMovements.filter((m) => m.itemId === item.id);
      const totalIn = myMoves.filter((m) => m.type === 'IN').reduce((s, m) => s + m.quantity, 0);
      const totalOut = myMoves.filter((m) => m.type === 'OUT').reduce((s, m) => s + m.quantity, 0);
      const net = totalIn - totalOut;

      // Opening balance: current_stock - IN_after_period + OUT_after_period - IN_in_period + OUT_in_period
      const afterIn = movementsAfterPeriod
        .filter((m) => m.itemId === item.id && m.type === 'IN')
        .reduce((s, m) => s + m.quantity, 0);
      const afterOut = movementsAfterPeriod
        .filter((m) => m.itemId === item.id && m.type === 'OUT')
        .reduce((s, m) => s + m.quantity, 0);
      const closingBalance = item.stock;
      const openingBalance = closingBalance - afterIn + afterOut - totalIn + totalOut;

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        unit: item.unit,
        unitPrice: item.price,
        openingBalance: Math.max(0, openingBalance),
        totalIn,
        totalOut,
        net,
        closingBalance,
        stockValue: closingBalance * item.price,
        movements: myMoves,
      };
    });

    // Group movements by date (YYYY-MM-DD)
    const byDate: Record<string, { date: string; totalIn: number; totalOut: number; items: any[] }> = {};
    for (const m of periodMovements) {
      const dateKey = new Date(m.createdAt).toISOString().slice(0, 10);
      if (!byDate[dateKey]) byDate[dateKey] = { date: dateKey, totalIn: 0, totalOut: 0, items: [] };
      if (m.type === 'IN') byDate[dateKey].totalIn += m.quantity;
      else byDate[dateKey].totalOut += m.quantity;
      byDate[dateKey].items.push({
        id: m.id,
        time: m.createdAt,
        itemId: m.itemId,
        itemName: m.item.name,
        unit: m.item.unit,
        category: m.item.category,
        type: m.type,
        quantity: m.quantity,
        reason: m.reason,
        reference: m.reference,
      });
    }

    const dailySummary = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));

    const grandTotalIn = perItem.reduce((s, i) => s + i.totalIn, 0);
    const grandTotalOut = perItem.reduce((s, i) => s + i.totalOut, 0);
    const totalInventoryValue = allItems.reduce((s, i) => s + i.stock * i.price, 0);
    const lowStockCount = allItems.filter((i) => i.stock <= (i.minStock || 5)).length;

    return NextResponse.json({
      period: { start: periodStart?.toISOString() ?? null, end: periodEnd?.toISOString() ?? null },
      summary: {
        totalItems: allItems.length,
        grandTotalIn,
        grandTotalOut,
        grandNet: grandTotalIn - grandTotalOut,
        totalInventoryValue,
        lowStockCount,
        totalMovements: periodMovements.length,
      },
      perItem,
      dailySummary,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate inventory report' }, { status: 500 });
  }
}
