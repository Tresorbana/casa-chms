import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const dateFilter = {
      ...(from && { gte: new Date(from) }),
      ...(to && { lte: new Date(to + 'T23:59:59.999Z') }),
    };

    const [expenses, paidInvoices] = await Promise.all([
      prisma.expense.findMany({
        where: Object.keys(dateFilter).length ? { date: dateFilter } : undefined,
        orderBy: { date: 'desc' },
      }),
      prisma.invoice.findMany({
        where: {
          status: 'PAID',
          ...(Object.keys(dateFilter).length ? { paidAt: dateFilter } : {}),
        },
        include: { items: true },
      }),
    ]);

    const totalIncome = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = totalIncome - totalExpenses;

    const incomeByType = paidInvoices.reduce((acc: Record<string, number>, inv) => {
      acc[inv.type] = (acc[inv.type] || 0) + inv.amount;
      return acc;
    }, {});

    const expensesByCategory = expenses.reduce((acc: Record<string, number>, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      profit,
      incomeByType,
      expensesByCategory,
      expenses,
      invoices: paidInvoices,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch finance data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, description, amount, date, paymentMethod, vendor } = body;

    if (!category || !description || !amount) {
      return NextResponse.json(
        { error: 'category, description, and amount are required' },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        category,
        description,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        paymentMethod,
        vendor,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
