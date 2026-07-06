import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const events = await prisma.restaurantEvent.findMany({
      orderBy: { eventDate: 'desc' },
      include: { items: true },
    });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch restaurant events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const createdByName = session?.user?.name ?? null;

    const body = await request.json();
    const {
      name,
      guestName,
      guestContact,
      guestEmail,
      eventType,
      eventDate,
      startTime,
      endTime,
      partySize,
      specialRequests,
      notes,
    } = body;

    if (!name || !guestName || !eventDate || !startTime || !partySize) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (endTime && new Date(endTime) <= new Date(startTime)) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
    }

    const event = await prisma.restaurantEvent.create({
      data: {
        name,
        guestName,
        guestContact: guestContact ?? null,
        guestEmail: guestEmail ?? null,
        eventType: eventType ?? 'GROUP_BOOKING',
        eventDate: new Date(eventDate),
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        partySize: parseInt(partySize),
        specialRequests: specialRequests ?? null,
        notes: notes ?? null,
        createdByName,
      },
      include: { items: true },
    });

    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: 'Failed to create restaurant event' }, { status: 500 });
  }
}
