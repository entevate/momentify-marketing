/**
 * QR Library types. QR codes are dynamic: the printed code encodes the
 * short redirect URL (/q/<id>), so the destination can be edited later
 * without reprinting. Every hit on /q/<id> is logged as a scan.
 */

export interface QrCode {
  id: string
  name: string
  destination: string
  campaign?: string
  /** pillar ids this code belongs to (multi-select, for sort/filter) */
  pillars?: string[]
  /** foreground (module) color, hex */
  fg: string
  /** background color, hex — or 'transparent' */
  bg: string
  createdAt: string
  updatedAt?: string
}

export type QrDevice = 'mobile' | 'tablet' | 'desktop' | 'other'

export interface QrScan {
  /** ISO timestamp */
  at: string
  device: QrDevice
  /** ISO 3166-1 alpha-2, from the Vercel geo header when available */
  country?: string
  referer?: string
}

export interface QrCodeWithStats extends QrCode {
  scans: number
  lastScanAt?: string
}

export interface QrScanDetail {
  code: QrCode
  scans: number
  events: QrScan[]
}

/** Pillar options for the builder's multi-select (mirrors the GTM nav). */
export const QR_PILLARS = [
  { id: 'general', label: 'General Momentify', color: '#1A56DB' },
  { id: 'trade-shows', label: 'Trade Shows', color: '#6B21D4' },
  { id: 'recruiting', label: 'Recruiting', color: '#0AA891' },
  { id: 'field-sales', label: 'Field Sales', color: '#D4940A' },
  { id: 'facilities', label: 'Facilities', color: '#3A2073' },
  { id: 'events-venues', label: 'Events & Venues', color: '#D43D1A' },
] as const

/** Brand-first color presets for the builder. */
export const QR_FG_PRESETS = ['#12243f', '#000000', '#1A56DB', '#00753a', '#c62828', '#1a56db'] as const
export const QR_BG_PRESETS = ['#ffffff', 'transparent', '#f4f5f7', '#fff4e8'] as const

export function shortUrlFor(id: string, origin?: string): string {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/q/${id}`
}
