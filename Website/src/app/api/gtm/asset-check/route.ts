import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { kv } from "@vercel/kv"
import { assetFilename, assetKvKey, isValidAssetParam } from "@/lib/gtm/asset-helpers"

/**
 * GET /api/gtm/asset-check?solution=X&assetType=Y[&itemId=Z]
 * Returns { exists: boolean, url?: string }.
 * Looks up the blob URL cached in KV by the generate + upload routes.
 * Falls back to the legacy public/gtm path on local dev so existing files
 * keep rendering.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const solution = searchParams.get("solution") ?? ""
    const assetType = searchParams.get("assetType") ?? ""
    const itemId = searchParams.get("itemId") ?? undefined

    if (!solution || !assetType) {
      return NextResponse.json({ error: "Missing solution or assetType query param" }, { status: 400 })
    }
    if (!isValidAssetParam(solution) || !isValidAssetParam(assetType)) {
      return NextResponse.json({ error: "Invalid solution or assetType format" }, { status: 400 })
    }
    if (itemId && !isValidAssetParam(itemId)) {
      return NextResponse.json({ error: "Invalid itemId format" }, { status: 400 })
    }

    // Primary: look up the blob URL cached in KV, but return a same-origin
    // proxy URL so the iframe can render it inline. (Raw blob URLs serve
    // .html with Content-Disposition: attachment + strict CSP.)
    //
    // Also return the templateId written by fill-template (if any) so the
    // client can reconstruct the template's aspect ratio for the preview
    // iframe.
    try {
      const baseKey = assetKvKey(solution, assetType, itemId)
      const [blobUrl, templateId] = await Promise.all([
        kv.get<string>(baseKey),
        kv.get<string>(`${baseKey}:template`),
      ])
      if (blobUrl) {
        const proxyUrl = `/api/gtm/asset-preview?solution=${encodeURIComponent(solution)}&assetType=${encodeURIComponent(assetType)}${itemId ? `&itemId=${encodeURIComponent(itemId)}` : ""}`
        return NextResponse.json({ exists: true, url: proxyUrl, templateId: templateId || undefined })
      }
    } catch {
      /* fall through to fs fallback */
    }

    // Local-dev fallback: check for a file in public/gtm
    try {
      const filename = assetFilename(solution, assetType, itemId)
      const filePath = path.join(process.cwd(), "public/gtm", filename)
      if (fs.existsSync(filePath)) {
        return NextResponse.json({ exists: true, url: `/gtm/${filename}` })
      }
    } catch {
      /* no fallback available */
    }

    return NextResponse.json({ exists: false })
  } catch (error) {
    console.error("[asset-check] error", error)
    return NextResponse.json({ exists: false })
  }
}
