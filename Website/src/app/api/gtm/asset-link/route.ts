import { NextResponse } from "next/server"
import { kv } from "@/lib/gtm/kv-store"
import { assetKvKey, isValidAssetParam } from "@/lib/gtm/asset-helpers"
import { requireGtmAuth } from "@/lib/gtm/content-types"

/** Records written next to the base key by fill-template / fill-carousel. */
const SIDE_RECORDS = ["template", "aspect", "cards", "slots", "hidden"] as const

/**
 * POST /api/gtm/asset-link
 *
 * Body: { pillar, assetType, fromItemId, toItemId }
 *
 * Copies the blob URL and its side records (templateId, aspect, carousel
 * card URLs, slot values, hidden slots) from one asset KV key to another. Used when Content Builder saves a draft-rendered social post
 * to the Library: the rendered HTML already exists at a draft-scoped path,
 * and we want it to also be discoverable under the new library item's id
 * without re-running Claude / re-rendering the template.
 *
 * The side records matter for carousels: without `:aspect`/`:template` the
 * saved item would export at the 1:1 fallback size, and without `:cards`
 * carousel-download would derive card URLs under the NEW id, where no
 * cards were ever written. `:slots`/`:hidden` let the slot editor restore.
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
    const [blobUrl, ...sideValues] = await Promise.all([
      kv.get<string>(fromKey),
      ...SIDE_RECORDS.map((suffix) => kv.get<string>(`${fromKey}:${suffix}`)),
    ])
    if (!blobUrl) {
      return NextResponse.json({ error: "Source asset not found in KV" }, { status: 404 })
    }
    const templateId = sideValues[SIDE_RECORDS.indexOf("template")]

    await Promise.all([
      kv.set(toKey, blobUrl),
      ...SIDE_RECORDS.map((suffix, i) => {
        const v = sideValues[i]
        return v ? kv.set(`${toKey}:${suffix}`, v) : Promise.resolve()
      }),
    ])

    return NextResponse.json({ success: true, url: blobUrl, templateId: templateId || undefined })
  } catch (error) {
    console.error("[asset-link] error", error)
    return NextResponse.json({ error: "Failed to link asset" }, { status: 500 })
  }
}
