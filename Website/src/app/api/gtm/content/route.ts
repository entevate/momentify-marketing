import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { KV, requireGtmAuth, type ContentItem } from "@/lib/gtm/content-types"

export async function GET(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const solution = searchParams.get("solution")

    const ids = await kv.smembers(KV.contentIndex) as string[]
    const items: ContentItem[] = []

    for (const id of ids) {
      const item = await kv.get<ContentItem>(KV.content(id))
      if (item) {
        if (!solution || solution === "all" || item.solution === solution) {
          items.push(item)
        }
      }
    }

    // Sort newest first
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ items: [] })
  }
}

export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const item = await request.json() as ContentItem

    if (!item.id) {
      item.id = `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    }
    if (!item.createdAt) {
      item.createdAt = new Date().toISOString()
    }

    await kv.set(KV.content(item.id), item)
    await kv.sadd(KV.contentIndex, item.id)

    return NextResponse.json({ id: item.id, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    )
  }
}
