import { NextResponse } from 'next/server'
import { logout, getSession } from '@/lib/auth'
import { recordActivity } from '@/lib/activity-log'

export async function POST(request: Request) {
  const session = await getSession()
  await logout()
  if (session?.user) {
    await recordActivity({
      user: session.user,
      action: 'LOGOUT',
      category: 'AUTH',
      method: 'POST',
      path: '/api/auth/logout',
      request,
    })
  }
  return NextResponse.json({ success: true })
}
