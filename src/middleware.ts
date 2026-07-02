import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'
import { canAccessRoute } from '@/lib/rbac'

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')?.value
    const session = sessionCookie ? await decrypt(sessionCookie) : null

    const { pathname } = request.nextUrl
    const method = request.method.toUpperCase()

    const isLoginPage = pathname === '/login'

    if (pathname.startsWith('/_next') || pathname === '/favicon.ico' || pathname === '/logo.png') {
        return NextResponse.next()
    }

    const allowed = canAccessRoute(session?.user?.role, pathname, method)
    const hasSession = Boolean(session)

    if (allowed) {
        if (session && isLoginPage) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }

    if (pathname.startsWith('/api')) {
        return NextResponse.json(
            { error: hasSession ? 'Forbidden' : 'Unauthorized' },
            { status: hasSession ? 403 : 401 }
        )
    }

    if (!hasSession) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
