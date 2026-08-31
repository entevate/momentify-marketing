/**
 * Link in Bio config + analytics (authed).
 *   GET                    → { config | null }
 *   GET ?stats=1&days=N     → computed windowed analytics (N ∈ 7/28/90)
 *   POST                    → validate/normalize/save; best-effort OG auto-screenshot
 *
 * One always-live team page: save = live immediately, no draft/publish state machine.
 * Momentify: signed-cookie auth (requireGtmAuth() no-arg) + the kv-store wrapper.
 */

import { NextRequest, NextResponse } from 'next/server'
import { del, put } from '@vercel/blob'
import { kv } from '@/lib/gtm/kv-store'
import { requireGtmAuth } from '@/lib/gtm/content-types'
import { renderSizedHtmlBatch } from '@/lib/gtm/render-png'
import { renderLinkPageHtml } from '@/lib/gtm/render-link-page'
import {
  CAPS,
  clampLogoSize,
  isHexColor,
  LINKPAGE_CLICKS_BYDAY_KEY,
  LINKPAGE_CLICKS_KEY,
  LINKPAGE_CONFIG_KEY,
  LINKPAGE_STATS_KEY,
  LINKPAGE_VIEWS_BYDAY_KEY,
  newLinkId,
  SOCIAL_IDS,
  type LinkButton,
  type LinkPageConfig,
  type LinkPageStats,
  type LinkStyle,
  type SocialId,
} from '@/lib/gtm/link-page-types'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const token = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || ''
const DAYS_ALLOWED = new Set([7, 28, 90])
const PRUNE_AFTER_DAYS = 120

function unauth() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

async function readConfig(): Promise<LinkPageConfig | null> {
  const raw = await kv.get<LinkPageConfig | string>(LINKPAGE_CONFIG_KEY)
  if (!raw) return null
  return typeof raw === 'string' ? (JSON.parse(raw) as LinkPageConfig) : (raw as LinkPageConfig)
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!(await requireGtmAuth())) return unauth()

  const url = new URL(request.url)
  if (url.searchParams.get('stats') === '1') {
    const daysRaw = Number(url.searchParams.get('days')) || 28
    const days = DAYS_ALLOWED.has(daysRaw) ? daysRaw : 28
    return NextResponse.json(await computeStats(days))
  }

  const config = await readConfig()
  return NextResponse.json({ config: config ?? null })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!(await requireGtmAuth())) return unauth()

  try {
    const body = (await request.json()) as Partial<LinkPageConfig> & { regenerateOg?: boolean }
    const existing = await readConfig()
    const config = normalizeConfig(body, existing)

    // OG auto-screenshot when unset or explicitly refreshed. Best-effort — a render
    // failure never blocks the save.
    const wantOg = !config.seo.ogImage || body.regenerateOg === true
    if (wantOg) {
      try {
        const origin = process.env.PAGES_PUBLIC_ORIGIN || new URL(request.url).origin
        const html = renderLinkPageHtml({ ...config, seo: { ...config.seo, ogImage: undefined } }, { origin, beacon: false })
        const [png] = await renderSizedHtmlBatch([{ html, width: 1200, height: 630 }])
        if (png) {
          if (config.seo.ogImage && config.seo.ogImage.includes('/gtm/links/og/')) {
            await del(config.seo.ogImage, { token }).catch(() => {})
          }
          const ogBlob = await put(`gtm/links/og/links-${Date.now().toString(36)}.png`, png, {
            access: 'public',
            addRandomSuffix: false,
            contentType: 'image/png',
            token,
          })
          config.seo.ogImage = ogBlob.url
        }
      } catch (err) {
        console.error('link-page auto-OG render failed (non-fatal):', err)
      }
    }

    await kv.set(LINKPAGE_CONFIG_KEY, JSON.stringify(config))
    return NextResponse.json({ config })
  } catch (error) {
    console.error('link-page POST failed:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

/* ---- normalize/validate ---- */

function str(v: unknown, cap: number): string {
  return (typeof v === 'string' ? v : '').trim().slice(0, cap)
}
function hex(v: unknown, fallback: string): string {
  if (typeof v === 'string' && isHexColor(v)) return v.startsWith('#') ? v : `#${v}`
  return fallback
}

function normalizeLink(raw: Partial<LinkButton>): LinkButton {
  const style: LinkStyle = raw.style === 'glass' || raw.style === 'ghost' ? raw.style : 'filled'
  const id = typeof raw.id === 'string' && /^lb_[a-z0-9]{1,40}$/.test(raw.id) ? raw.id : newLinkId()
  const link: LinkButton = {
    id,
    label: str(raw.label, CAPS.label),
    url: str(raw.url, 600),
    style,
    enabled: raw.enabled !== false,
  }
  const note = str(raw.note, CAPS.note)
  if (note) link.note = note
  if (raw.featured === true) link.featured = true
  if (typeof raw.color === 'string' && isHexColor(raw.color)) link.color = raw.color.startsWith('#') ? raw.color : `#${raw.color}`
  return link
}

function normalizeConfig(body: Partial<LinkPageConfig>, existing: LinkPageConfig | null): LinkPageConfig {
  const accent = hex(body.accent, existing?.accent || '#0CF4DF')

  const links = Array.isArray(body.links) ? body.links.slice(0, CAPS.links).map(normalizeLink) : existing?.links || []

  const socials: Partial<Record<SocialId, string>> = {}
  const rawSocials = (body.socials || {}) as Partial<Record<SocialId, string>>
  for (const id of SOCIAL_IDS) {
    const v = str(rawSocials[id], 300)
    if (v) socials[id] = v
  }

  const bh: Partial<LinkPageConfig['header']> = body.header || {}
  const header = {
    showLogo: bh.showLogo !== false,
    logoUrl: str(bh.logoUrl, 600) || undefined,
    logoSize: clampLogoSize(bh.logoSize),
    avatarUrl: str(bh.avatarUrl, 600) || undefined,
    headline: str(bh.headline, CAPS.headline),
    bio: str(bh.bio, CAPS.bio),
  }

  const bg = body.background
  const background = bg && bg.enabled && str(bg.url, 600)
    ? { enabled: true, url: str(bg.url, 600) }
    : bg && !bg.enabled
      ? { enabled: false, url: str(bg.url, 600) }
      : existing?.background

  const bf = body.featured
  const featured = bf && str(bf.url, 600)
    ? { enabled: bf.enabled !== false, kind: bf.kind === 'image' ? 'image' as const : 'video' as const, url: str(bf.url, 600), name: str(bf.name, 120) || undefined }
    : existing?.featured

  const seo = {
    title: str(body.seo?.title, 120) || existing?.seo?.title || '',
    description: str(body.seo?.description, 300) || existing?.seo?.description || '',
    ogImage: existing?.seo?.ogImage,
  }

  return {
    header,
    accent,
    background,
    featured,
    links,
    socials,
    footerUrl: str(body.footerUrl, 300) || existing?.footerUrl,
    seo,
    updatedAt: new Date().toISOString(),
  }
}

/* ---- windowed analytics ---- */

function windowDays(days: number): string[] {
  const out: string[] = []
  const now = Date.now()
  for (let i = 0; i < days; i++) out.push(new Date(now - i * 86_400_000).toISOString().slice(0, 10))
  return out
}

async function hgetallNum(key: string): Promise<Record<string, number>> {
  return (await kv.hgetall<Record<string, number>>(key)) ?? {}
}

async function computeStats(days: number) {
  const [config, statsRaw, viewsByDay, clicksLifetime, clicksByDay] = await Promise.all([
    readConfig(),
    kv.get<LinkPageStats | string>(LINKPAGE_STATS_KEY),
    hgetallNum(LINKPAGE_VIEWS_BYDAY_KEY),
    hgetallNum(LINKPAGE_CLICKS_KEY),
    hgetallNum(LINKPAGE_CLICKS_BYDAY_KEY),
  ])

  if (!config) return { configured: false }
  const stats: LinkPageStats | null = statsRaw
    ? (typeof statsRaw === 'string' ? (JSON.parse(statsRaw) as LinkPageStats) : (statsRaw as LinkPageStats))
    : null

  const win = windowDays(days)
  const winSet = new Set(win)

  const viewsWindow = win.reduce((n, d) => n + (Number(viewsByDay[d]) || 0), 0)
  const viewsTotal = stats?.views || Object.values(viewsByDay).reduce((n, v) => n + (Number(v) || 0), 0)
  const uniques = stats ? Object.keys(stats.viewers || {}).length : 0

  const clicksWindowByLink: Record<string, number> = {}
  const clicksByDate: Record<string, number> = {}
  for (const [field, raw] of Object.entries(clicksByDay)) {
    const v = Number(raw) || 0
    const sep = field.indexOf(':')
    if (sep < 0) continue
    const date = field.slice(0, sep)
    const linkId = field.slice(sep + 1)
    if (!winSet.has(date)) continue
    clicksWindowByLink[linkId] = (clicksWindowByLink[linkId] || 0) + v
    clicksByDate[date] = (clicksByDate[date] || 0) + v
  }
  const clicksWindow = Object.values(clicksWindowByLink).reduce((n, v) => n + v, 0)
  const clicksTotal = Object.values(clicksLifetime).reduce((n, v) => n + (Number(v) || 0), 0)

  const seen = new Set<string>()
  const rows: { id: string; label: string; enabled: boolean; social: boolean; clicks: number; clicksWindow: number }[] = []
  for (const l of config.links || []) {
    seen.add(l.id)
    rows.push({ id: l.id, label: l.label || '(untitled)', enabled: l.enabled, social: false, clicks: Number(clicksLifetime[l.id]) || 0, clicksWindow: clicksWindowByLink[l.id] || 0 })
  }
  for (const s of SOCIAL_IDS) {
    if (!(config.socials?.[s] || '').trim()) continue
    const id = `s_${s}`
    seen.add(id)
    rows.push({ id, label: s, enabled: true, social: true, clicks: Number(clicksLifetime[id]) || 0, clicksWindow: clicksWindowByLink[id] || 0 })
  }
  for (const [id, raw] of Object.entries(clicksLifetime)) {
    if (seen.has(id)) continue
    const clicks = Number(raw) || 0
    if (clicks === 0 && !clicksWindowByLink[id]) continue
    rows.push({ id, label: id === 'footer' ? 'Footer' : '(removed link)', enabled: false, social: id.startsWith('s_'), clicks, clicksWindow: clicksWindowByLink[id] || 0 })
  }

  const byDay = win
    .slice()
    .reverse()
    .map((date) => ({ date, views: Number(viewsByDay[date]) || 0, clicks: clicksByDate[date] || 0 }))

  void pruneStale(viewsByDay, clicksByDay)

  return {
    configured: true,
    days,
    viewsWindow,
    viewsTotal,
    uniques,
    clicksWindow,
    clicksTotal,
    ctr: viewsWindow > 0 ? clicksWindow / viewsWindow : 0,
    links: rows,
    byDay,
  }
}

async function pruneStale(viewsByDay: Record<string, number>, clicksByDay: Record<string, number>) {
  try {
    const cutoff = new Date(Date.now() - PRUNE_AFTER_DAYS * 86_400_000).toISOString().slice(0, 10)
    const staleViews = Object.keys(viewsByDay).filter((d) => d < cutoff)
    const staleClicks = Object.keys(clicksByDay).filter((f) => f.slice(0, f.indexOf(':')) < cutoff)
    if (staleViews.length) await kv.hdel(LINKPAGE_VIEWS_BYDAY_KEY, ...staleViews)
    if (staleClicks.length) await kv.hdel(LINKPAGE_CLICKS_BYDAY_KEY, ...staleClicks)
  } catch { /* best effort */ }
}
