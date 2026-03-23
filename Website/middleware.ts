import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /gtm routes (except login and auth API)
  if (
    pathname.startsWith('/gtm') &&
    !pathname.startsWith('/gtm/login') &&
    !pathname.startsWith('/api/gtm/auth')
  ) {
    const authCookie = request.cookies.get('gtm_auth')
    if (!authCookie) {
      return NextResponse.redirect(new URL('/gtm/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/gtm/:path*'],
}
