import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { gtmAuthToken } from '@/lib/gtm/auth-token'

export async function POST(request: Request) {
  const { password } = await request.json()
  const expected = process.env.GTM_PASSWORD

  if (!expected) {
    return NextResponse.json({ success: false }, { status: 500 })
  }

  const inputBuf = Buffer.from(String(password))
  const expectedBuf = Buffer.from(expected)

  const isValid =
    inputBuf.length === expectedBuf.length &&
    crypto.timingSafeEqual(inputBuf, expectedBuf)

  const token = gtmAuthToken()
  if (!isValid || !token) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  // Signed token, not the literal "true" — an unauthenticated visitor cannot
  // reproduce it without GTM_PASSWORD. httpOnly so page scripts can't read it.
  response.cookies.set('gtm_auth', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 2592000, // 30 days
    path: '/',
  })

  return response
}
