import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

const SUPERVISOR_EMAIL = 'supervisor@gmail.com';
const SUPERVISOR_PASSWORD = 'Hhhhhhh@';

async function ensureSupervisor() {
  const existing = await prisma.user.findUnique({ where: { email: SUPERVISOR_EMAIL } });
  if (existing) {
    if (existing.role !== 'SUPERVISOR') {
      await prisma.user.update({ where: { id: existing.id }, data: { role: 'SUPERVISOR' } });
      return { created: false, promoted: true };
    }
    return { created: false, promoted: false };
  }
  const hashedPassword = await bcrypt.hash(SUPERVISOR_PASSWORD, 10);
  await prisma.user.create({
    data: {
      email: SUPERVISOR_EMAIL,
      password: hashedPassword,
      name: 'Supervisor',
      role: 'SUPERVISOR',
    },
  });
  return { created: true, promoted: false };
}

export async function GET() {
  try {
    const result = await ensureSupervisor();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error('[supervisor-bootstrap]', error);
    return NextResponse.json({ error: 'Failed to bootstrap supervisor' }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
