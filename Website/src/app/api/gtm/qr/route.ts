/**
 * QR Library CRUD (KV-backed, team-shared).
 * GET            → { codes: QrCodeWithStats[] }
 * GET ?id=<id>   → { code, scans, events } scan detail for one QR
 * POST { code }  → upsert a QR code
 * DELETE ?id=    → remove a code and its scan history
 *
 * Scan events are written by the public redirect at /q/[id] using atomic
 * INCR + LPUSH, so counts survive concurrent scans.
 */

import { NextResponse } from 'next/server'
import { kv } from '@/lib/gtm/kv-store'
import { requireGtmAuth } from '@/lib/gtm/content-types'
import { QR_PILLARS, type QrCode, type QrScan } from '@/lib/gtm/qr-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CODES_KEY = 'gtm:qr:codes'
const countKey = (id: string) => `gtm:qr:count:${id}`
const scansKey = (id: string) => `gtm:qr:scans:${id}`

const ID_RE = /^[a-z0-9-]{4,40}$/
const PILLAR_IDS = QR_PILLARS.map((p) => p.id) as readonly string[]
const isPillar = (id: unknown): id is string => typeof id === 'string' && PILLAR_IDS.includes(id)

async function readCodes(): Promise<QrCode[]> {
  const raw = await kv.get(CODES_KEY)
  if (!raw) return []
  return typeof raw === 'string' ? (JSON.parse(raw) as QrCode[]) : (raw as QrCode[])
}

function parseScan(raw: unknown): QrScan | null {
  try {
    const s = typeof raw === 'string' ? JSON.parse(raw) : raw
    return s && typeof s === 'object' && 'at' in s ? (s as QrScan) : null
  } catch {
    return null
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = new URL(request.url).searchParams.get('id')
  try {
    const codes = await readCodes()

    if (id) {
      const code = codes.find((c) => c.id === id)
      if (!code) return NextResponse.json({ error: 'Unknown QR id' }, { status: 400 })
      const [count, rawEvents] = await Promise.all([kv.get<number>(countKey(id)), kv.lrange(scansKey(id), 0, 4999)])
      const events = (rawEvents || []).map(parseScan).filter((s): s is QrScan => s !== null)
      return NextResponse.json({ code, scans: count || 0, events })
    }

    const counts = codes.length ? await kv.mget<(number | null)[]>(...codes.map((c) => countKey(c.id))) : []
    const withStats = await Promise.all(
      codes.map(async (c, i) => {
        const latest = parseScan((await kv.lrange(scansKey(c.id), 0, 0))[0])
        return { ...c, scans: counts[i] || 0, lastScanAt: latest?.at }
      })
    )
    return NextResponse.json({ codes: withStats })
  } catch (error) {
    console.error('qr GET failed:', error)
    return NextResponse.json({ error: 'QR store unavailable' }, { status: 500 })
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = (await request.json()) as { code?: Partial<QrCode> }
    const c = body.code
    if (!c || !ID_RE.test(c.id || '') || !c.name?.trim() || !c.destination?.trim()) {
      return NextResponse.json({ error: 'code with id, name, destination required' }, { status: 400 })
    }
    let dest: URL
    try {
      dest = new URL(c.destination)
    } catch {
      return NextResponse.json({ error: 'destination must be a full URL (https://...)' }, { status: 400 })
    }
    if (dest.protocol !== 'https:' && dest.protocol !== 'http:') {
      return NextResponse.json({ error: 'destination must be http(s)' }, { status: 400 })
    }

    const codes = await readCodes()
    if (codes.length >= 200 && !codes.some((x) => x.id === c.id)) {
      return NextResponse.json({ error: 'Max 200 QR codes' }, { status: 400 })
    }
    const existing = codes.find((x) => x.id === c.id)
    const now = new Date().toISOString()
    const saved: QrCode = {
      id: c.id!,
      name: c.name.trim().slice(0, 120),
      destination: dest.toString(),
      campaign: c.campaign?.trim().slice(0, 80) || undefined,
      pillars: Array.isArray(c.pillars) && c.pillars.some(isPillar) ? c.pillars.filter(isPillar) : undefined,
      fg: c.fg || '#111111',
      bg: c.bg || '#ffffff',
      createdAt: existing?.createdAt || now,
      updatedAt: existing ? now : undefined,
    }
    const next = existing ? codes.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...codes]
    await kv.set(CODES_KEY, JSON.stringify(next))
    return NextResponse.json({ success: true, code: saved })
  } catch (error) {
    console.error('qr POST failed:', error)
    return NextResponse.json({ error: 'Failed to save QR code' }, { status: 500 })
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = new URL(request.url).searchParams.get('id') || ''
  if (!ID_RE.test(id)) return NextResponse.json({ error: 'id required' }, { status: 400 })
  try {
    const codes = await readCodes()
    await kv.set(CODES_KEY, JSON.stringify(codes.filter((c) => c.id !== id)))
    await Promise.all([kv.del(countKey(id)), kv.del(scansKey(id))])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('qr DELETE failed:', error)
    return NextResponse.json({ error: 'Failed to delete QR code' }, { status: 500 })
  }
}
