import { NextResponse } from "next/server"
import { kv } from "@/lib/gtm/kv-store"
import { put, del } from "@vercel/blob"
import { KV, requireGtmAuth, type MicrositeRecord } from "@/lib/gtm/content-types"
import { stripBrandNav } from "../route"

const token = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || ""

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params
  try {
    const record = await kv.get<MicrositeRecord>(KV.microsite(slug))
    if (!record) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(record)
  } catch {
    return NextResponse.json({ error: "KV not available" }, { status: 500 })
  }
}

// Re-publish with new HTML
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params
  try {
    const existing = await kv.get<MicrositeRecord>(KV.microsite(slug))
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await request.json() as { html: string; title?: string; description?: string }

    // Strip brand-nav and upload to Blob (overwrites existing)
    const cleanHtml = stripBrandNav(body.html)
    const blob = await put(`gtm/microsites/${slug}.html`, cleanHtml, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "text/html",
      token,
    })

    const updated: MicrositeRecord = {
      ...existing,
      blobUrl: blob.url,
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      publishedAt: new Date().toISOString(),
    }

    await kv.set(KV.microsite(slug), updated)

    return NextResponse.json({ success: true, blobUrl: blob.url })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to re-publish" },
      { status: 500 }
    )
  }
}

// Unpublish: delete Blob file + KV record
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params
  try {
    const record = await kv.get<MicrositeRecord>(KV.microsite(slug))
    if (record?.blobUrl) {
      try {
        await del(record.blobUrl)
      } catch {
        // Blob may already be gone
      }
    }

    await kv.del(KV.microsite(slug))
    await kv.srem(KV.micrositeIndex, slug)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to unpublish" },
      { status: 500 }
    )
  }
}
