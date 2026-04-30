import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { kv } from "@/lib/gtm/kv-store"
import { assetFilename, assetKvKey, isValidAssetParam } from "@/lib/gtm/asset-helpers"

/**
 * GET /api/gtm/asset-preview?solution=X&assetType=Y[&itemId=Z]
 *
 * Proxies the stored HTML asset back to the caller with `Content-Type:
 * text/html` and an inline disposition. We cannot redirect the iframe
 * straight at the raw Vercel Blob URL because Vercel Blob serves every
 * `.html` blob with `Content-Disposition: attachment` plus a strict CSP
 * (`default-src 'none'`), which forces a download instead of rendering
 * and blocks inline scripts/fonts. Fetching the body server-side and
 * re-emitting it with our own headers bypasses both restrictions.
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

    // Primary: fetch the HTML from the cached blob URL and proxy it.
    try {
      const url = await kv.get<string>(assetKvKey(solution, assetType, itemId))
      if (url) {
        const res = await fetch(url, { cache: "no-store" })
        if (res.ok) {
          const html = await res.text()
          return new Response(html, {
            status: 200,
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "Content-Disposition": "inline",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          })
        }
      }
    } catch {
      /* fall through to fs fallback */
    }

    // Local-dev fallback
    const filename = assetFilename(solution, assetType, itemId)
    const filePath = path.join(process.cwd(), "public/gtm", filename)
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, "utf-8")
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": "inline",
        },
      })
    }

    return NextResponse.json({ error: "Asset not yet generated" }, { status: 404 })
  } catch (error) {
    console.error("[asset-preview] error", error)
    return NextResponse.json({ error: "Failed to read asset" }, { status: 500 })
  }
}
