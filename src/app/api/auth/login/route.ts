import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { login } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { recordActivity } from '@/lib/activity-log'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      await recordActivity({
        user: null,
        action: 'LOGIN_FAILED',
        category: 'AUTH',
        method: 'POST',
        path: '/api/auth/login',
        metadata: { email, reason: 'user-not-found' },
        status: 'FAILED',
        request,
      })
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      await recordActivity({
        user: { id: user.id, name: user.name, role: user.role },
        action: 'LOGIN_FAILED',
        category: 'AUTH',
        method: 'POST',
        path: '/api/auth/login',
        metadata: { email, reason: 'bad-password' },
        status: 'FAILED',
        request,
      })
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Create session
    await login({ id: user.id, email: user.email, name: user.name, role: user.role })

    await recordActivity({
      user: { id: user.id, name: user.name, role: user.role },
      action: 'LOGIN_SUCCESS',
      category: 'AUTH',
      method: 'POST',
      path: '/api/auth/login',
      metadata: { email },
      request,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
