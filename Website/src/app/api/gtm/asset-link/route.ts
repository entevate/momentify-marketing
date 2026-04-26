import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { assetKvKey, isValidAssetParam } from "@/lib/gtm/asset-helpers"
import { requireGtmAuth } from "@/lib/gtm/content-types"

/**
 * POST /api/gtm/asset-link
 *
 * Body: { pillar, assetType, fromItemId, toItemId }
 *
 * Copies the blob URL + cached templateId that live under one asset KV key
 * to another. Used when Content Builder saves a draft-rendered social post
 * to the Library: the rendered HTML already exists at a draft-scoped path,
 * and we want it to also be discoverable under the new library item's id
 * without re-running Claude / re-rendering the template.
 *
 * Both keys end up pointing to the SAME blob URL — no copy of the blob
 * itself is performed. If the user later deletes the draft, the blob
 * remains accessible via the library key until that's also cleared.
 */
export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { pillar, assetType, fromItemId, toItemId } = body ?? {}

    if (!pillar || !assetType || !fromItemId || !toItemId) {
      return NextResponse.json(
        { error: "Missing pillar, assetType, fromItemId, or toItemId" },
        { status: 400 }
      )
    }
    for (const v of [pillar, assetType, fromItemId, toItemId] as string[]) {
      if (!isValidAssetParam(v)) {
        return NextResponse.json({ error: "Invalid parameter format" }, { status: 400 })
      }
    }

    const fromKey = assetKvKey(pillar, assetType, fromItemId)
    const toKey = assetKvKey(pillar, assetType, toItemId)
    const [blobUrl, templateId] = await Promise.all([
      kv.get<string>(fromKey),
      kv.get<string>(`${fromKey}:template`),
    ])
    if (!blobUrl) {
      return NextResponse.json({ error: "Source asset not found in KV" }, { status: 404 })
    }

    await Promise.all([
      kv.set(toKey, blobUrl),
      templateId ? kv.set(`${toKey}:template`, templateId) : Promise.resolve(),
    ])

    return NextResponse.json({ success: true, url: blobUrl, templateId: templateId || undefined })
  } catch (error) {
    console.error("[asset-link] error", error)
    return NextResponse.json({ error: "Failed to link asset" }, { status: 500 })
  }
}
