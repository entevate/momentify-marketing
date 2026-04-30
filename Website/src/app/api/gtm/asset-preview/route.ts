import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { kv } from "@/lib/gtm/kv-store"
import { assetBlobPath, assetFilename, assetKvKey, isValidAssetParam } from "@/lib/gtm/asset-helpers"

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
 *
 * Lookup order (each falls through on miss):
 *   1. KV cache: `assetKvKey(...)` -> blob URL written by fill-template /
 *      fill-carousel / asset-upload. Fast happy path.
 *   2. Deterministic blob URL: derived from the public store host that
 *      we extract from BLOB_READ_WRITE_TOKEN/GTM_READ_WRITE_TOKEN. Works
 *      whenever the put() actually succeeded, even if KV.set silently
 *      failed afterward (which has bitten us in production).
 *   3. Local FS fallback: dev-only - reads `public/gtm/<filename>` if
 *      the route was hit locally without blob configured.
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

    // ─── 1. KV cache hit ───────────────────────────────────────────────
    try {
      const url = await kv.get<string>(assetKvKey(solution, assetType, itemId))
      if (url) {
        const proxied = await proxyHtml(url)
        if (proxied) return proxied
      }
    } catch {
      /* fall through */
    }

    // ─── 2. Deterministic blob URL ─────────────────────────────────────
    const blobPath = assetBlobPath(solution, assetType, itemId)
    const blobHost = publicBlobHost()
    if (blobPath && blobHost) {
      const directUrl = `${blobHost}/${blobPath}`
      const proxied = await proxyHtml(directUrl)
      if (proxied) {
        // Best-effort backfill so future requests hit KV directly.
        kv.set(assetKvKey(solution, assetType, itemId), directUrl).catch(() => { /* ignore */ })
        return proxied
      }
    }

    // ─── 3. Local FS fallback ──────────────────────────────────────────
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

/**
 * Fetch a URL (absolute or same-origin /gtm/... path) and re-emit the
 * body with text/html + inline disposition. Returns null on fetch
 * failure so the caller can fall through to the next lookup.
 */
async function proxyHtml(url: string): Promise<Response | null> {
  try {
    const target = url.startsWith("http") ? url : url
    const res = await fetch(target, { cache: "no-store" })
    if (!res.ok) return null
    const html = await res.text()
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": "inline",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch {
    return null
  }
}

/**
 * Extract the public blob host from a Vercel Blob token. Tokens look like
 *   vercel_blob_rw_<storeId>_<secret>
 * The corresponding public host is
 *   https://<storeId>.public.blob.vercel-storage.com
 *
 * Returns null when no token is configured (token-less envs can't build
 * a deterministic URL; caller falls through to the FS fallback).
 */
function publicBlobHost(): string | null {
  const token =
    process.env.GTM_READ_WRITE_TOKEN ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    ""
  if (!token) return null
  // Format: vercel_blob_rw_<storeId>_<secret>
  // Some older tokens include hyphens in storeId; we anchor on the
  // `vercel_blob_rw_` prefix and grab everything up to the next `_`.
  const m = token.match(/^vercel_blob_rw_([A-Za-z0-9-]+)_/)
  if (!m) return null
  return `https://${m[1]}.public.blob.vercel-storage.com`
}
