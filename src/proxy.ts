import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {randomUUID} from "node:crypto";

const AUTHENTICATED_PATHS = [
    '/article/write',
]

export default async function middleware(request: NextRequest) {
    const session = request.cookies.get('GAL_AUT')?.value
    const visitorId = request.cookies.get('GAL_VISITOR')?.value
    const { pathname } = request.nextUrl

    const isProtectedPath = AUTHENTICATED_PATHS.some(path => pathname.startsWith(path))

    if (isProtectedPath && !session) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }
    const response = NextResponse.next()


    if (!visitorId) {
        try {
            const identityResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/internal/api/v1/tracking/identity`,
                {
                    method: 'POST',
                    cache: 'no-store',
                },
            )

            if (identityResponse.ok) {
                const identity = await identityResponse.text()

                response.cookies.set('GAL_VISITOR', identity, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30,
                })
            } else {
                console.error('Tracking identity issue failed', identityResponse.status)
            }
        } catch (error) {
            console.error('Tracking identity fetch failed', error)
        }
    }

    return response
}

export const config = {
    matcher: ['/((?!_next|api|favicon.ico).*)'],
}