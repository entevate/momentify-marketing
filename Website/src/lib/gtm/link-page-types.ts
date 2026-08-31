/**
 * Link in Bio: a single, team-shared, mobile-first branded landing page served at
 * public /links (the Instagram-bio destination), with per-link click + page-view
 * analytics. One always-live page — no slugs, no draft/publish state machine.
 *
 * This module is import-clean on purpose (zero imports): the shared render module
 * pulls its helpers from here, and that render function must stay free of any
 * server-only or 'use client' import so it can run in both the public route and the
 * builder's live preview.
 */

export type LinkStyle = 'filled' | 'glass' | 'ghost'
// filled = solid pillar color · glass = translucent white over the dark bg · ghost = outline

export interface LinkButton {
  /**
   * 'lb_' + ts36 + random. STICKY FOREVER once created — it is baked into
   * /links/r/<id> URLs and the click-stats hash fields. The save handler preserves
   * incoming lb_ ids verbatim and mints ids only for genuinely new rows.
   */
  id: string
  label: string
  url: string
  note?: string
  style: LinkStyle
  /** fill hex for 'filled'; defaults to the page accent */
  color?: string
  /** large emphasized card treatment */
  featured?: boolean
  /** off = hidden, value kept (toggle-keeps-value house pattern) */
  enabled: boolean
}

export type SocialId = 'instagram' | 'x' | 'facebook' | 'linkedin' | 'youtube'
export const SOCIAL_IDS: SocialId[] = ['instagram', 'x', 'facebook', 'linkedin', 'youtube']

export interface LinkPageConfig {
  header: {
    showLogo: boolean
    /** custom logo image URL; when set it replaces the built-in brand lockup */
    logoUrl?: string
    /** rendered logo height in px (brand lockup or custom image); see LOGO_SIZE */
    logoSize?: number
    avatarUrl?: string
    headline: string
    bio: string
  }
  accent: string
  /** muted looping bg video (media URL) */
  background?: { enabled: boolean; url: string }
  featured?: { enabled: boolean; kind: 'video' | 'image'; url: string; name?: string }
  /** cap 20 */
  links: LinkButton[]
  /** blank = icon hidden */
  socials: Partial<Record<SocialId, string>>
  /** defaults to the brand domain */
  footerUrl?: string
  seo: { title: string; description: string; ogImage?: string }
  updatedAt: string
}

/** A single click event, kept in a capped list for the recent-activity feed. */
export interface LinkClickEvent {
  at: string
  linkId: string
  device: 'mobile' | 'tablet' | 'desktop' | 'other'
  country?: string
  referer?: string
}

/** View-beacon blob (single writer: the view beacon). */
export interface LinkPageStats {
  views: number
  viewers: Record<string, number> // vid → count, capped 5000
  events: LinkViewEvent[] // recent, capped 500
}

export interface LinkViewEvent {
  at: string
  vid: string
  device: 'mobile' | 'tablet' | 'desktop' | 'other'
  country?: string
  region?: string
  city?: string
  referrer?: string
}

/* ---- KV keys (single team page, so no per-slug namespacing) ---- */
export const LINKPAGE_CONFIG_KEY = 'gtm:linkpage:config'
export const LINKPAGE_STATS_KEY = 'gtm:linkpage:stats'
export const LINKPAGE_VIEWS_BYDAY_KEY = 'gtm:linkpage:views:byday' // HASH: YYYY-MM-DD → count
export const LINKPAGE_CLICKS_KEY = 'gtm:linkpage:clicks' // HASH: linkId → lifetime count
export const LINKPAGE_CLICKS_BYDAY_KEY = 'gtm:linkpage:clicks:byday' // HASH: YYYY-MM-DD:linkId → count
export const LINKPAGE_CLICKEVENTS_KEY = 'gtm:linkpage:clickevents' // LIST of LinkClickEvent, ltrim ≤2000
export const LINKPAGE_CLICKEVENTS_MAX = 2000

/* ---- Validation caps (enforced in the authed POST) ---- */
export const CAPS = { headline: 120, bio: 400, label: 60, note: 80, links: 20, viewers: 5000, viewEvents: 500 } as const

/** Logo height bounds (px) and the shared default. */
export const LOGO_SIZE = { min: 16, max: 160, default: 40 } as const

/** Clamp a logo height to the allowed range, falling back to the default. */
export function clampLogoSize(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n)) return LOGO_SIZE.default
  return Math.max(LOGO_SIZE.min, Math.min(LOGO_SIZE.max, Math.round(n)))
}

/** UTC day stamp — buckets are UTC everywhere so "today" is consistent across writers. */
export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Mint a sticky link id. Only ever called for genuinely new rows. */
export function newLinkId(): string {
  return 'lb_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/** HTML-escape every user string before it reaches the rendered page. */
export function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Normalize a raw href: add https:// when a bare domain, keep mailto:/tel: intact. */
export function normalizeUrl(raw: string): string {
  const s = String(raw ?? '').trim()
  if (!s) return ''
  if (/^(https?:|mailto:|tel:)/i.test(s)) return s
  return 'https://' + s.replace(/^\/+/, '')
}

/**
 * Relative luminance of a hex fill (0..1). Filled buttons pick navy ink over light
 * fills (sky, gold) and white ink over dark ones — white text on gold is unreadable.
 */
export function relativeLuminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex ?? '').trim())
  if (!m) return 0
  const n = parseInt(m[1], 16)
  const chan = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2]
}

/** True for a valid 6-digit hex color (with or without leading #). */
export function isHexColor(s: string): boolean {
  return /^#?[0-9a-f]{6}$/i.test(String(s ?? '').trim())
}
