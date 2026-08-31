/**
 * Public click redirect: /links/r/<id> → 302 to the destination, logging the click
 * first. Every clickable thing on /links routes through here — link buttons (their
 * lb_ id), social icons (s_<social>), and the footer (footer). Unknown or disabled
 * ids bounce back to /links (never 404). Logging is wrapped so it can never break the
 * redirect.
 */

import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/gtm/kv-store'
import { deviceFromUa } from '@/lib/gtm/pages-types'
import {
  LINKPAGE_CLICKEVENTS_KEY,
  LINKPAGE_CLICKEVENTS_MAX,
  LINKPAGE_CLICKS_BYDAY_KEY,
  LINKPAGE_CLICKS_KEY,
  LINKPAGE_CONFIG_KEY,
  normalizeUrl,
  SOCIAL_IDS,
  todayUtc,
  type LinkClickEvent,
  type LinkPageConfig,
  type SocialId,
} from '@/lib/gtm/link-page-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ID_RE = /^(lb_[a-z0-9]{1,40}|s_(?:instagram|x|facebook|linkedin|youtube)|footer)$/

async function readConfig(): Promise<LinkPageConfig | null> {
  const raw = await kv.get(LINKPAGE_CONFIG_KEY)
  if (!raw) return null
  return typeof raw === 'string' ? (JSON.parse(raw) as LinkPageConfig) : (raw as LinkPageConfig)
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await ctx.params
  const home = new URL('/links', request.url)
  if (!ID_RE.test(id)) return NextResponse.redirect(home, 302)

  let destination = ''
  try {
    const config = await readConfig()
    if (config) destination = resolve(id, config)
  } catch (error) {
    console.error('link redirect lookup failed:', error)
  }
  if (!destination) return NextResponse.redirect(home, 302)

  // Log the click; never let logging break the redirect.
  try {
    const day = todayUtc()
    const event: LinkClickEvent = {
      at: new Date().toISOString(),
      linkId: id,
      device: deviceFromUa(request.headers.get('user-agent') || ''),
      country: request.headers.get('x-vercel-ip-country') || undefined,
      referer: request.headers.get('referer') || undefined,
    }
    await Promise.all([
      kv.hincrby(LINKPAGE_CLICKS_KEY, id, 1),
      kv.hincrby(LINKPAGE_CLICKS_BYDAY_KEY, `${day}:${id}`, 1),
      kv.lpush(LINKPAGE_CLICKEVENTS_KEY, JSON.stringify(event)),
    ])
    await kv.ltrim(LINKPAGE_CLICKEVENTS_KEY, 0, LINKPAGE_CLICKEVENTS_MAX - 1)
  } catch (error) {
    console.error('link click log failed:', error)
  }

  return NextResponse.redirect(normalizeUrl(destination), 302)
}

/** Resolve a click id to its destination: link (if enabled) → social → footer. */
function resolve(id: string, config: LinkPageConfig): string {
  if (id.startsWith('lb_')) {
    const link = (config.links || []).find((l) => l.id === id)
    return link && link.enabled ? link.url : ''
  }
  if (id.startsWith('s_')) {
    const social = id.slice(2) as SocialId
    return SOCIAL_IDS.includes(social) ? (config.socials?.[social] || '') : ''
  }
  if (id === 'footer') return config.footerUrl || process.env.PAGES_PUBLIC_ORIGIN || ''
  return ''
}
