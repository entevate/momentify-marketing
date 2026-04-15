import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { del } from "@vercel/blob"
import { KV, requireGtmAuth, type ContentItem } from "@/lib/gtm/content-types"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    const item = await kv.get<ContentItem>(KV.content(id))
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: "KV not available" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    // Check for attached blob file
    const item = await kv.get<ContentItem>(KV.content(id))
    if (item?.blobUrl) {
      try {
        await del(item.blobUrl)
      } catch {
        // Blob may already be gone
      }
    }

    await kv.del(KV.content(id))
    await kv.srem(KV.contentIndex, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete content", details: String(error) },
      { status: 500 }
    )
  }
}
