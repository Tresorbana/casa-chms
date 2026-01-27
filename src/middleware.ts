import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const session = await getSession()
    const { pathname } = request.nextUrl

    // Protected routes
    const protectedRoutes = ['/settings', '/dashboard', '/cms', '/pos', '/inventory', '/reports']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (pathname === '/login' && session) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
