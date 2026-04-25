import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import apiClient, {lightApi} from "@/lib/ApiClient";
import {notFound} from "next/dist/client/components/not-found";
import {UserInfo} from "@/components/header/getUser";



const AUTHENTICATED_PATHS = [
    '/article/write',
]

export default async function middleware(request: NextRequest) {
    const session = request.cookies.get('JSESSIONID')?.value
    const { pathname } = request.nextUrl

    const isProtectedPath = AUTHENTICATED_PATHS.some(path => pathname.startsWith(path))

    if (!session) {
        if (isProtectedPath) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(loginUrl)
        }
        return NextResponse.next()
    }

    if (isProtectedPath) {
        try {
            await lightApi.get('/api/v1/users/me')
                .baseUrl(process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL)
                .isCredentialRequest(true)
                .cookies({ JSESSIONID: session })

            return NextResponse.next()
        } catch (e: any) {
            // 여기서 delete 하는 건 합법이다!
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('callbackUrl', pathname)

            const res = NextResponse.redirect(loginUrl)
            res.cookies.delete('JSESSIONID') // 미들웨어에선 이게 됨
            return res
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next|api|favicon.ico).*)'],
}