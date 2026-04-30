import { NextResponse } from "next/server"
import { kv } from "@/lib/gtm/kv-store"
import { put } from "@vercel/blob"
import { KV, requireGtmAuth, type MicrositeRecord } from "@/lib/gtm/content-types"

const token = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || ""

// Strip brand-nav and internal tooling scripts from HTML
export function stripBrandNav(html: string): string {
  return html
    // Remove brand-nav CSS link
    .replace(/<link[^>]*brand-nav\.css[^>]*\/?>/gi, "")
    // Remove brand-nav JS script
    .replace(/<script[^>]*brand-nav\.js[^>]*><\/script>/gi, "")
    // Remove BRAND_SKIP_AUTH script block
    .replace(/<script>\s*window\.BRAND_SKIP_AUTH\s*=\s*true;\s*<\/script>/gi, "")
    // Remove theme persistence IIFE
    .replace(/<script>\s*\(function\(\)\{var t=localStorage\.getItem\('mk-theme'\);if\(t\)document\.documentElement\.dataset\.theme=t;\}\)\(\);\s*<\/script>/gi, "")
    // Remove asset path-fix script (the one that rewrites /gtm/assets/ to /assets/)
    .replace(/<script>\s*document\.querySelectorAll\('img'\)\.forEach[\s\S]*?<\/script>/gi, "")
}

export async function GET() {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const slugs = await kv.smembers(KV.micrositeIndex) as string[]
    const sites: MicrositeRecord[] = []

    for (const slug of slugs) {
      const record = await kv.get<MicrositeRecord>(KV.microsite(slug))
      if (record) sites.push(record)
    }

    sites.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return NextResponse.json({ sites })
  } catch {
    return NextResponse.json({ sites: [] })
  }
}

export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json() as {
      slug: string
      title: string
      description?: string
      solution: string
      html: string
      contentId?: string
    }

    if (!body.slug || !body.html) {
      return NextResponse.json({ error: "Missing slug or html" }, { status: 400 })
    }

    // Sanitize slug: lowercase, alphanumeric + hyphens only
    const slug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")

    // Strip brand-nav from HTML
    const cleanHtml = stripBrandNav(body.html)

    // Upload to Blob
    const blob = await put(`gtm/microsites/${slug}.html`, cleanHtml, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "text/html",
      token,
    })

    // Create KV record
    const record: MicrositeRecord = {
      slug,
      title: body.title,
      description: body.description,
      solution: body.solution,
      blobUrl: blob.url,
      contentId: body.contentId,
      publishedAt: new Date().toISOString(),
    }

    await kv.set(KV.microsite(slug), record)
    await kv.sadd(KV.micrositeIndex, slug)

    return NextResponse.json({ success: true, slug, blobUrl: blob.url })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to publish microsite" },
      { status: 500 }
    )
  }
}
