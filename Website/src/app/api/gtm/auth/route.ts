import { NextResponse } from 'next/server'
import crypto from 'crypto'

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

  if (!isValid) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('gtm_auth', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 2592000, // 30 days
    path: '/',
  })

  return response
}
