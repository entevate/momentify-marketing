/**
 * Published Pages: standalone HTML (case studies, microsites) served at
 * public /p/<slug> URLs with injected OG meta and a view/time beacon.
 * Index in KV; HTML in Blob; per-page stats in KV.
 */

export interface PageItem {
  id: string
  slug: string
  title: string
  description: string
  /** public absolute URL used for og:image (a public Blob URL) */
  ogImage?: string
  /** blob URL of the raw HTML */
  htmlUrl: string
  /** pillar tags (multi-select, same ids as the nav practice areas) */
  pillars?: string[]
  source: 'upload' | 'builder'
  createdAt: string
  updatedAt?: string
}

export interface PageEvent {
  at: string
  vid: string
  event: 'view' | 'time'
  seconds?: number
  device: 'mobile' | 'tablet' | 'desktop' | 'other'
  country?: string
  region?: string
  city?: string
  /** where the reader came from (host only) */
  referrer?: string
}

export interface PageStats {
  views: number
  seconds: number
  viewers: Record<string, number> // vid → view count (capped)
  events: PageEvent[] // recent, capped
}

export interface PageWithStats extends PageItem {
  views: number
  uniqueViewers: number
  totalSeconds: number
  lastViewedAt?: string
}

export const PAGES_KEY = 'gtm:pages'
export const pageStatsKey = (slug: string) => `gtm:pages:stats:${slug}`

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export function deviceFromUa(ua: string): PageEvent['device'] {
  if (/mobile|iphone|android.*mobile/i.test(ua)) return 'mobile'
  if (/ipad|tablet|android/i.test(ua)) return 'tablet'
  if (/mozilla|chrome|safari|firefox|edg/i.test(ua)) return 'desktop'
  return 'other'
}
