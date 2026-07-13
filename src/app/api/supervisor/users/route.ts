import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { normalizeRole } from '@/lib/rbac';

function isSupervisor(role: string | null | undefined) {
  return normalizeRole(role) === 'SUPERVISOR';
}

export async function GET() {
  const session = await getSession();
  if (!session || !isSupervisor(session.user?.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: session ? 403 : 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('[supervisor/users]', error);
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
}
