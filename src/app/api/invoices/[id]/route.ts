import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isValidPaymentMethod } from '@/lib/payment-methods';
import { getSession } from '@/lib/auth';
import { recordActivity } from '@/lib/activity-log';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = params.id;
    let invoice: any;
    try {
      invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          items: true,
          subInvoices: { include: { items: true } },
          booking: { include: { room: true } },
        },
      });
    } catch {
      // Fallback if Prisma client hasn't regenerated yet after schema change
      invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          items: true,
          subInvoices: { include: { items: true } },
        },
      });
    }

    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

    return NextResponse.json(invoice);
  } catch {
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
    const { status, paymentMethod, guestSignature } = body;

    const existing = await prisma.invoice.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const data: {
      status?: string;
      paymentMethod?: string | null;
      paidAt?: Date | null;
      guestSignature?: string;
    } = {};

    if (guestSignature !== undefined) {
      const trimmed = String(guestSignature).trim();
      if (!trimmed) {
        return NextResponse.json({ error: 'Signature cannot be empty' }, { status: 400 });
      }
      data.guestSignature = trimmed;
    }

    if (status !== undefined) {
      if (!['PAID', 'UNPAID'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      if (status === 'PAID') {
        if (!paymentMethod || !isValidPaymentMethod(paymentMethod)) {
          return NextResponse.json(
            { error: 'A valid payment method is required (Cash, Bank transfer, Momo, or Card)' },
            { status: 400 }
          );
        }
        data.status = 'PAID';
        data.paymentMethod = paymentMethod;
        data.paidAt = new Date();
        if (!existing.guestSignature && !data.guestSignature) {
          data.guestSignature = existing.guestName;
        }
      } else {
        data.status = 'UNPAID';
        data.paymentMethod = null;
        data.paidAt = null;
      }
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data,
      include: { items: true, subInvoices: { include: { items: true } } },
    });

    const session = await getSession();
    await recordActivity({
      user: session?.user,
      action: data.status === 'PAID' ? 'INVOICE_PAID' : data.status === 'UNPAID' ? 'INVOICE_UNPAID' : 'INVOICE_UPDATED',
      category: 'INVOICES',
      entity: 'Invoice',
      entityId: invoice.id,
      method: 'PATCH',
      path: `/api/invoices/${id}`,
      metadata: {
        guestName: invoice.guestName,
        amount: invoice.amount,
        type: invoice.type,
        status: invoice.status,
        paymentMethod: invoice.paymentMethod,
      },
      request,
    });

    return NextResponse.json(invoice);
  } catch {
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}
