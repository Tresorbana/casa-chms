import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const dateFilter = {
      ...(from && { gte: new Date(from) }),
      ...(to && { lte: new Date(to + 'T23:59:59.999Z') }),
    };

    const items = await prisma.otherIncome.findMany({
      where: Object.keys(dateFilter).length ? { date: dateFilter } : undefined,
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch other income' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const createdByName = session?.user?.name ?? null;

    const body = await request.json();
    const { description, amount, category, date, paymentMethod, source } = body;

    if (!description || !amount) {
      return NextResponse.json({ error: 'Description and amount are required' }, { status: 400 });
    }

    const income = await prisma.otherIncome.create({
      data: {
        description,
        amount: parseFloat(amount),
        category: category ?? 'OTHER',
        date: date ? new Date(date) : new Date(),
        paymentMethod: paymentMethod ?? null,
        source: source ?? null,
        createdByName,
      },
    });

    return NextResponse.json(income);
  } catch {
    return NextResponse.json({ error: 'Failed to record income' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.otherIncome.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 });
  }
}
