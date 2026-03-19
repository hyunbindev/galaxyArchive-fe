import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    console.log("🚀 문지기 작동 중! 요청 경로:", request.nextUrl.pathname);


    return NextResponse.next();
}

// 4미들웨어가 실행될 경로 최적화 (이거 안 하면 이미지/JS 읽을 때도 다 실행됨)
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}