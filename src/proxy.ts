import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTHENTICATED_PATHS = [
    '/article/write',
]

export default async function middleware(request: NextRequest) {
    const session = request.cookies.get('JSESSIONID')?.value
    const { pathname } = request.nextUrl

    const isProtectedPath = AUTHENTICATED_PATHS.some(path => pathname.startsWith(path))

    if (isProtectedPath && !session) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next|api|favicon.ico).*)'],
}