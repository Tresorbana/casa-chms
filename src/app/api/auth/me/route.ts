import { NextResponse } from 'next/server'
import { getSession, login } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ user: null })
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })
  if (!user) return NextResponse.json({ user: null })
  return NextResponse.json({ user })
}

export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { name, currentPassword, newPassword } = await request.json()
    const userId = session.user.id

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const updates: { name?: string; password?: string } = {}

    if (name !== undefined) {
      const trimmed = name.trim()
      if (!trimmed) return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 })
      updates.name = trimmed
    }

    if (newPassword !== undefined) {
      if (!currentPassword) return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
      const valid = await bcrypt.compare(currentPassword, user.password)
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      if (newPassword.length < 6) return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
      updates.password = await bcrypt.hash(newPassword, 10)
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const updated = await prisma.user.update({ where: { id: userId }, data: updates })

    // Refresh session cookie with updated name
    await login({ id: updated.id, email: updated.email, name: updated.name, role: updated.role })

    return NextResponse.json({ success: true, user: { id: updated.id, email: updated.email, name: updated.name, role: updated.role } })
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
