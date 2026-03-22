import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'



const AUTHENTICATED_PATHS = [
    '/article/write',
]

export default function proxy(request: NextRequest) {
    const session = request.cookies.get('JSESSIONID')
    const { pathname } = request.nextUrl

    console.log(pathname)

    const isRequiredAuthentication = AUTHENTICATED_PATHS.some(path =>
        pathname.startsWith(path)
    )

    if (isRequiredAuthentication && !session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }


    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|favicon.ico).*)'],
}