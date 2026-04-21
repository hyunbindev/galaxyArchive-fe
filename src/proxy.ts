import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'



const AUTHENTICATED_PATHS = [
    '/article/write',
]

export default async function middleware(request: NextRequest) {
    const session = request.cookies.get('JSESSIONID')?.value
    const { pathname } = request.nextUrl

    if (!session) {
        if (AUTHENTICATED_PATHS.some(path => pathname.startsWith(path))) {
            const loginUrl = new URL('/login',request.url)
            loginUrl.searchParams.set('callbackUrl',pathname)

            return NextResponse.redirect(loginUrl)
        }
        return NextResponse.next()
    }

    try {
        const response = await fetch(`/api/v1/user/me`, {
            headers: { 'Cookie': `JSESSIONID=${session}` },
            cache: 'no-store',
            signal: AbortSignal.timeout(2000)
        })

        if (response.status === 401) {
            const res = NextResponse.next()
            res.cookies.delete('JSESSIONID')
            return res
        }
    } catch (e) {
        // 백엔드 서버 점검 중일 때를 대비한 예외 처리
        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next|api|favicon.ico).*)'],
}