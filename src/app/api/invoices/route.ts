import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestName, amount, type, items, masterInvoiceId } = body;

    // Validation for Master Invoice
    if (type === 'MASTER' && (!items || items.length === 0)) {
      // Logic to auto-compile master invoice from sub-invoices if provided
    }

    const invoice = await prisma.invoice.create({
      data: {
        guestName,
        amount,
        type: type || 'ROOM',
        masterInvoiceId,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true,
        subInvoices: true
      }
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Search / List invoices
  try {
    const invoices = await prisma.invoice.findMany({
      take: 20,
      orderBy: { date: 'desc' },
      include: { items: true }
    });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
