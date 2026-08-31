/**
 * Public Link in Bio page: /links
 * The single team-shared landing page linked from the Instagram profile. Reads the
 * config from KV and renders it via the shared render module (preview == production).
 * Missing config or any failure serves a branded coming-soon placeholder with HTTP
 * 200 — this URL lives in a bio and must never 404.
 */

import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/gtm/kv-store'
import { LINKPAGE_CONFIG_KEY, type LinkPageConfig } from '@/lib/gtm/link-page-types'
import { renderComingSoonHtml, renderLinkPageHtml } from '@/lib/gtm/render-link-page'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const raw = await kv.get(LINKPAGE_CONFIG_KEY)
    const config = raw ? (typeof raw === 'string' ? (JSON.parse(raw) as LinkPageConfig) : (raw as LinkPageConfig)) : null
    if (!config) return placeholder()

    const origin = process.env.PAGES_PUBLIC_ORIGIN || new URL(request.url).origin
    const html = renderLinkPageHtml(config, { origin, beacon: true })
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // Save = live within ~a minute; the beacon is client-side so caching loses no views.
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('links serve failed:', error)
    return placeholder()
  }
}

function placeholder(): NextResponse {
  return new NextResponse(renderComingSoonHtml(), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, s-maxage=60' },
  })
}
