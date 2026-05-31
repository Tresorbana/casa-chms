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
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
        subInvoices: true,
      },
    });

    // For RESTAURANT invoices, deduct from inventory via linked MenuItems
    if (type === 'RESTAURANT' && items && items.length > 0) {
      for (const orderItem of items) {
        // Look up MenuItem by name matching the invoice item description
        const menuItem = await prisma.menuItem.findFirst({
          where: { name: orderItem.description },
        });

        if (menuItem?.inventoryItemId) {
          const inventoryItem = await prisma.inventoryItem.findUnique({
            where: { id: menuItem.inventoryItemId },
          });

          if (inventoryItem) {
            const deductQty = orderItem.quantity ?? 1;
            const newStock = Math.max(0, inventoryItem.stock - deductQty);

            await prisma.inventoryItem.update({
              where: { id: menuItem.inventoryItemId },
              data: { stock: newStock },
            });

            await prisma.stockMovement.create({
              data: {
                itemId: menuItem.inventoryItemId,
                type: 'OUT',
                quantity: deductQty,
                reason: 'RESTAURANT_SALE',
                reference: invoice.id,
              },
            });
          }
        }
      }
    }

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
      include: { items: true },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
