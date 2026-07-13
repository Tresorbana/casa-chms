import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { normalizeRole } from '@/lib/rbac';

function isSupervisor(role: string | null | undefined) {
  return normalizeRole(role) === 'SUPERVISOR';
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || !isSupervisor(session.user?.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: session ? 403 : 401 });
  }

  const { searchParams } = new URL(request.url);
  const take = Math.min(parseInt(searchParams.get('take') ?? '100'), 500);
  const skip = parseInt(searchParams.get('skip') ?? '0');
  const category = searchParams.get('category');
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const action = searchParams.get('action');
  const search = searchParams.get('q')?.trim();
  const since = searchParams.get('since');
  const until = searchParams.get('until');

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (userId) where.userId = userId;
  if (status) where.status = status;
  if (action) where.action = { contains: action, mode: 'insensitive' };
  if (since || until) {
    where.createdAt = {
      ...(since && { gte: new Date(since) }),
      ...(until && { lte: new Date(until) }),
    };
  }
  if (search) {
    where.OR = [
      { userName: { contains: search, mode: 'insensitive' } },
      { action: { contains: search, mode: 'insensitive' } },
      { entity: { contains: search, mode: 'insensitive' } },
      { entityId: { contains: search, mode: 'insensitive' } },
      { path: { contains: search, mode: 'insensitive' } },
    ];
  }

  try {
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.activityLog.count({ where }),
    ]);
    return NextResponse.json({ logs, total, take, skip });
  } catch (error) {
    console.error('[supervisor/logs]', error);
    return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 });
  }
}
