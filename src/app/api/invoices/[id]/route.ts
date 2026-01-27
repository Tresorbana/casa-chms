import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: id,
      },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { guestName, amount, status, items } = body;

    // Transaction to update invoice and replace items
    const invoice = await prisma.$transaction(async (tx) => {
      // 1. Update invoice details
      const updatedInvoice = await tx.invoice.update({
        where: { id: id },
        data: {
          guestName,
          amount,
          status,
        },
      });

      // 2. Delete existing items (simplest strategy for full update)
      await tx.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });

      // 3. Create new items
      if (items && items.length > 0) {
        await tx.invoiceItem.createMany({
          data: items.map((item: any) => ({
            invoiceId: id,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          })),
        });
      }

      return updatedInvoice;
    });

    // Fetch the final result with items
    const finalInvoice = await prisma.invoice.findUnique({
      where: { id: id },
      include: { items: true },
    });

    return NextResponse.json(finalInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Cascade delete is handled by database if configured, or we delete items first
    // Prisma schema doesn't explicitly show onDelete: Cascade, so we should delete items first or rely on a transaction
    
    await prisma.$transaction(async (tx) => {
      await tx.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });
      
      await tx.invoice.delete({
        where: { id: id },
      });
    });

    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}
