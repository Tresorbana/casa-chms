import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')?.value
    const session = sessionCookie ? await decrypt(sessionCookie) : null

    const { pathname } = request.nextUrl

    // Protect root / and other routes
    const isLoginPage = pathname === '/login'

    // Allow public access to static files and api/auth
    if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname === '/favicon.ico' || pathname === '/logo.png') {
        return NextResponse.next()
    }

    // If user is not logged in and trying to access protected route (everything except login)
    if (!session && !isLoginPage) {
        if (pathname.startsWith('/api')) {
            // Allow public submission of inquiries and preflight checks
            if (pathname === '/api/inquiries' && (request.method === 'POST' || request.method === 'OPTIONS')) {
                return NextResponse.next()
            }
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }


    // If user is logged in and trying to access login page
    if (session && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
