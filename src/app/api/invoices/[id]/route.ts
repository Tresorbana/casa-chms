import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = params.id;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        subInvoices: {
          include: { items: true } // Include detailed items for sub-invoices in Master view
        }
      }
    });

    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = params.id;
    const body = await request.json();
    const { status } = body;

    if (!status || !['PAID', 'UNPAID'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
      include: { items: true, subInvoices: { include: { items: true } } },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}
