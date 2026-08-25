/**
 * Published Pages management (authed via signed-cookie — Momentify convention)
 * GET    → list pages with stats, or ?slug= → one page's event detail
 * POST   → create/update { id?, slug?, title, description?, html?, ogImage?, pillars?, source? }
 * DELETE → ?id=...
 */

import { NextResponse } from 'next/server'
import { del, put } from '@vercel/blob'
import { kv } from '@/lib/gtm/kv-store'
import { requireGtmAuth } from '@/lib/gtm/content-types'
import { renderSizedHtmlBatch } from '@/lib/gtm/render-png'
import { PAGES_KEY, pageStatsKey, slugify, type PageItem, type PageStats, type PageWithStats } from '@/lib/gtm/pages-types'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

// Fleet blob convention: pass the RW token explicitly so @vercel/blob never
// falls back to OIDC (unavailable under local `next dev`).
const token = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || ''

async function readPages(): Promise<PageItem[]> {
  try {
    const raw = await kv.get(PAGES_KEY)
    if (!raw) return []
    return typeof raw === 'string' ? JSON.parse(raw) : (raw as PageItem[])
  } catch {
    return []
  }
}

async function readStats(slug: string): Promise<PageStats | null> {
  try {
    const raw = await kv.get(pageStatsKey(slug))
    if (!raw) return null
    return typeof raw === 'string' ? JSON.parse(raw) : (raw as PageStats)
  } catch {
    return null
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Detail mode: ?slug= returns the raw event stream for one page.
  const slug = new URL(request.url).searchParams.get('slug')
  if (slug) {
    const s = await readStats(slug)
    return NextResponse.json({ slug, views: s?.views || 0, seconds: s?.seconds || 0, events: s?.events || [] })
  }

  const pages = await readPages()
  const withStats: PageWithStats[] = await Promise.all(
    pages.map(async (p) => {
      const s = await readStats(p.slug)
      return {
        ...p,
        views: s?.views || 0,
        uniqueViewers: s ? Object.keys(s.viewers || {}).length : 0,
        totalSeconds: s?.seconds || 0,
        lastViewedAt: s?.events?.[0]?.at,
      }
    })
  )
  return NextResponse.json({ pages: withStats })
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = (await request.json()) as {
      id?: string
      slug?: string
      title?: string
      description?: string
      html?: string
      ogImage?: string
      pillars?: string[]
      source?: string
    }
    const title = (body.title || '').trim()
    if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })

    const pages = await readPages()
    const existing = body.id ? pages.find((p) => p.id === body.id) : undefined

    // Slug: sticky once created — printed/shared links must never break.
    const slug = existing?.slug || slugify(body.slug || title)
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
    if (!existing && pages.some((p) => p.slug === slug)) {
      return NextResponse.json({ error: `Slug "${slug}" is taken` }, { status: 400 })
    }

    let htmlUrl = existing?.htmlUrl || ''
    const freshHtml = typeof body.html === 'string' && body.html.trim() ? body.html : null
    if (freshHtml) {
      if (freshHtml.length > 3_500_000) return NextResponse.json({ error: 'HTML too large (max 3.5MB)' }, { status: 400 })
      const blob = await put(`gtm/pages/${slug}.html`, freshHtml, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'text/html; charset=utf-8',
        token,
      })
      // Public blob URL, used directly — Momentify has no /files proxy.
      htmlUrl = blob.url
    }
    if (!htmlUrl) return NextResponse.json({ error: 'html required for a new page' }, { status: 400 })

    // Auto-generate the OG image by screenshotting the page's own HTML at
    // 1200×630 when none is provided. Best-effort — a render failure must never
    // block publishing (the page just ships without a social-preview image).
    let ogImage = (body.ogImage || existing?.ogImage || '').trim() || undefined
    if (!ogImage && freshHtml) {
      try {
        const [png] = await renderSizedHtmlBatch([{ html: freshHtml, width: 1200, height: 630 }])
        const ogBlob = await put(`gtm/pages/og/${slug}-${Date.now().toString(36)}.png`, png, {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'image/png',
          token,
        })
        ogImage = ogBlob.url
      } catch (err) {
        console.error('pages auto-OG render failed (non-fatal):', err)
      }
    }

    const item: PageItem = {
      id: existing?.id || `pg_${Date.now().toString(36)}`,
      slug,
      title,
      description: (body.description || '').trim(),
      ogImage,
      htmlUrl,
      pillars: Array.isArray(body.pillars)
        ? body.pillars.filter((p): p is string => typeof p === 'string').slice(0, 10)
        : existing?.pillars,
      source: body.source === 'builder' ? 'builder' : existing?.source || 'upload',
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: existing ? new Date().toISOString() : undefined,
    }
    await kv.set(PAGES_KEY, JSON.stringify([item, ...pages.filter((p) => p.id !== item.id)]))
    return NextResponse.json({ success: true, page: item }, { status: existing ? 200 : 201 })
  } catch (error) {
    console.error('pages POST failed:', error)
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 })
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const pages = await readPages()
  const page = pages.find((p) => p.id === id)
  await kv.set(PAGES_KEY, JSON.stringify(pages.filter((p) => p.id !== id)))
  if (page) {
    await kv.del(pageStatsKey(page.slug)).catch(() => {})
    if (page.htmlUrl) await del(page.htmlUrl, { token }).catch(() => {})
    // Clean up the auto-generated OG image too (only if it's one of ours in Blob).
    if (page.ogImage && page.ogImage.includes('/gtm/pages/og/')) await del(page.ogImage, { token }).catch(() => {})
  }
  return NextResponse.json({ success: true })
}
