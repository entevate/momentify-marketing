/**
 * Public view beacon for the Link in Bio page (no auth — called by visitors'
 * browsers). POST { vid, referrer? }. A dedicated endpoint on purpose — it must not
 * be overloaded onto /api/gtm/page-event, which validates against the pages index.
 * Atomic day-bucket first, then the read-modify-write stats blob. No config → 404.
 */

import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/gtm/kv-store'
import { deviceFromUa } from '@/lib/gtm/pages-types'
import {
  CAPS,
  LINKPAGE_CONFIG_KEY,
  LINKPAGE_STATS_KEY,
  LINKPAGE_VIEWS_BYDAY_KEY,
  todayUtc,
  type LinkPageConfig,
  type LinkPageStats,
} from '@/lib/gtm/link-page-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { vid?: string; referrer?: string }
    const vid = (body.vid || 'anon').slice(0, 40)

    const rawCfg = await kv.get(LINKPAGE_CONFIG_KEY)
    const config = rawCfg ? (typeof rawCfg === 'string' ? (JSON.parse(rawCfg) as LinkPageConfig) : (rawCfg as LinkPageConfig)) : null
    if (!config) return NextResponse.json({ ok: false }, { status: 404 })

    // Atomic day bucket first — exact windowed counts, no race, no truncation.
    await kv.hincrby(LINKPAGE_VIEWS_BYDAY_KEY, todayUtc(), 1)

    const rawStats = await kv.get(LINKPAGE_STATS_KEY)
    const stats: LinkPageStats = rawStats
      ? (typeof rawStats === 'string' ? (JSON.parse(rawStats) as LinkPageStats) : (rawStats as LinkPageStats))
      : { views: 0, viewers: {}, events: [] }

    stats.views += 1
    if (Object.keys(stats.viewers).length < CAPS.viewers || stats.viewers[vid] !== undefined) {
      stats.viewers[vid] = (stats.viewers[vid] || 0) + 1
    }

    let referrer: string | undefined
    try {
      if (body.referrer) referrer = new URL(body.referrer).hostname.slice(0, 80) || undefined
    } catch { /* opaque/invalid referrer — drop */ }
    const dec = (v: string | null) => {
      if (!v) return undefined
      try { return decodeURIComponent(v).slice(0, 60) } catch { return v.slice(0, 60) }
    }

    stats.events.unshift({
      at: new Date().toISOString(),
      vid,
      device: deviceFromUa(request.headers.get('user-agent') || ''),
      country: dec(request.headers.get('x-vercel-ip-country')),
      region: dec(request.headers.get('x-vercel-ip-country-region')),
      city: dec(request.headers.get('x-vercel-ip-city')),
      referrer,
    })
    stats.events = stats.events.slice(0, CAPS.viewEvents)

    await kv.set(LINKPAGE_STATS_KEY, JSON.stringify(stats))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
