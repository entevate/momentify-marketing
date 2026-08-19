/**
 * Public QR redirect: /q/<id> → 302 to the code's destination, logging the
 * scan first. This is the URL printed inside every QR code, which is what
 * makes them dynamic — edit the destination in the QR Library and existing
 * prints keep working. Unknown ids fall through to the app root.
 */

import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/gtm/kv-store'
import type { QrCode, QrDevice, QrScan } from '@/lib/gtm/qr-types'

const CODES_KEY = 'gtm:qr:codes'
const MAX_EVENTS = 5000

function deviceFrom(ua: string): QrDevice {
  const s = ua.toLowerCase()
  if (/ipad|tablet|kindle|silk/.test(s)) return 'tablet'
  if (/mobi|iphone|android/.test(s)) return 'mobile'
  if (/mozilla|chrome|safari|firefox|edg/.test(s)) return 'desktop'
  return 'other'
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params
  const fallback = new URL('/', request.url)
  if (!/^[a-z0-9-]{4,40}$/.test(id)) return NextResponse.redirect(fallback, 302)

  let destination = ''
  try {
    const raw = await kv.get(CODES_KEY)
    const codes: QrCode[] = !raw ? [] : typeof raw === 'string' ? JSON.parse(raw) : raw
    destination = codes.find((c) => c.id === id)?.destination || ''
  } catch (error) {
    console.error('qr redirect lookup failed:', error)
  }
  if (!destination) return NextResponse.redirect(fallback, 302)

  // Log the scan; never let logging break the redirect.
  try {
    const scan: QrScan = {
      at: new Date().toISOString(),
      device: deviceFrom(request.headers.get('user-agent') || ''),
      country: request.headers.get('x-vercel-ip-country') || undefined,
      referer: request.headers.get('referer') || undefined,
    }
    await Promise.all([
      kv.incr(`gtm:qr:count:${id}`),
      kv.lpush(`gtm:qr:scans:${id}`, JSON.stringify(scan)),
    ])
    await kv.ltrim(`gtm:qr:scans:${id}`, 0, MAX_EVENTS - 1)
  } catch (error) {
    console.error('qr scan log failed:', error)
  }

  return NextResponse.redirect(destination, 302)
}
