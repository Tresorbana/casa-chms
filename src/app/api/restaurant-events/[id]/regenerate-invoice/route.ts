import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    const createdByName = session?.user?.name ?? null;
    const createdById = session?.user?.id ?? null;

    const event = await prisma.restaurantEvent.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (event.items.length === 0) return NextResponse.json({ error: 'No items to invoice' }, { status: 400 });

    // Delete old invoice if exists
    if (event.invoiceId) {
      await prisma.invoiceItem.deleteMany({ where: { invoiceId: event.invoiceId } });
      await prisma.invoice.delete({ where: { id: event.invoiceId } });
    }

    const total = event.items.reduce((sum, item) => sum + item.totalPrice, 0);

    const invoice = await prisma.invoice.create({
      data: {
        guestName: event.guestName,
        amount: total,
        type: 'RESTAURANT',
        date: new Date(event.startTime),
        createdByName,
        createdById,
        items: {
          create: event.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    await prisma.restaurantEvent.update({
      where: { id },
      data: { invoiceId: invoice.id, totalAmount: total, status: 'COMPLETED' },
    });

    return NextResponse.json({ invoiceId: invoice.id });
  } catch {
    return NextResponse.json({ error: 'Failed to regenerate invoice' }, { status: 500 });
  }
}
