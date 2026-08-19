/**
 * Public tracking beacon for published pages (no auth — called by readers'
 * browsers). POST { slug, vid, event: 'view'|'time', seconds? }.
 * Validates the slug against the page index; counters + recent events in KV.
 */

import { NextResponse } from 'next/server'
import { kv } from '@/lib/gtm/kv-store'
import { PAGES_KEY, deviceFromUa, pageStatsKey, type PageItem, type PageStats } from '@/lib/gtm/pages-types'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { slug?: string; vid?: string; event?: string; seconds?: number; referrer?: string }
    const slug = (body.slug || '').slice(0, 80)
    const vid = (body.vid || 'anon').slice(0, 40)
    const event = body.event === 'time' ? 'time' : body.event === 'view' ? 'view' : null
    if (!slug || !event) return NextResponse.json({ ok: false }, { status: 400 })
    const seconds = event === 'time' ? Math.max(0, Math.min(3600, Math.round(Number(body.seconds) || 0))) : 0
    if (event === 'time' && seconds === 0) return NextResponse.json({ ok: true })

    const rawPages = await kv.get(PAGES_KEY)
    const pages: PageItem[] = rawPages ? (typeof rawPages === 'string' ? JSON.parse(rawPages) : (rawPages as PageItem[])) : []
    if (!pages.some((p) => p.slug === slug)) return NextResponse.json({ ok: false }, { status: 404 })

    const key = pageStatsKey(slug)
    const raw = await kv.get(key)
    const stats: PageStats = raw
      ? typeof raw === 'string'
        ? JSON.parse(raw)
        : (raw as PageStats)
      : { views: 0, seconds: 0, viewers: {}, events: [] }

    if (event === 'view') {
      stats.views += 1
      if (Object.keys(stats.viewers).length < 5000 || stats.viewers[vid] !== undefined) {
        stats.viewers[vid] = (stats.viewers[vid] || 0) + 1
      }
      // Referrer arrives as a URL from the beacon; keep only the host — enough
      // to answer "where do readers come from" without logging full paths.
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
        event,
        device: deviceFromUa(request.headers.get('user-agent') || ''),
        country: dec(request.headers.get('x-vercel-ip-country')),
        region: dec(request.headers.get('x-vercel-ip-country-region')),
        city: dec(request.headers.get('x-vercel-ip-city')),
        referrer,
      })
      stats.events = stats.events.slice(0, 500)
    } else {
      stats.seconds += seconds
    }

    await kv.set(key, JSON.stringify(stats))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
