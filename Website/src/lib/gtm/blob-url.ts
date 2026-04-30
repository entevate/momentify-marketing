/**
 * Deterministic Vercel Blob public-URL recovery.
 *
 * The asset persistence pipeline (fill-template, fill-carousel, etc.)
 * writes to a known blob path via `assetBlobPath(...)` and then caches
 * the returned blob URL in KV. When KV writes silently fail in
 * production we still need a way to find the asset, so any consumer
 * route can call `resolveAssetUrl(...)` to:
 *   1. Try KV first (cheap)
 *   2. If KV miss, construct the deterministic public URL from the
 *      blob token's embedded storeId
 *   3. Best-effort backfill KV for the next request
 *
 * This makes the asset routes tolerant of partial-KV state without
 * requiring KV to be 100% reliable.
 */

import { kv } from "@/lib/gtm/kv-store"
import { assetBlobPath, assetKvKey } from "@/lib/gtm/asset-helpers"

/**
 * Extract the public blob host from a Vercel Blob token. Tokens look like
 *   vercel_blob_rw_<storeId>_<secret>
 * The corresponding public host is
 *   https://<storeId>.public.blob.vercel-storage.com
 *
 * Returns null when no token is configured.
 */
export function publicBlobHost(): string | null {
  const token =
    process.env.GTM_READ_WRITE_TOKEN ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    ""
  if (!token) return null
  const m = token.match(/^vercel_blob_rw_([A-Za-z0-9-]+)_/)
  if (!m) return null
  return `https://${m[1]}.public.blob.vercel-storage.com`
}

/**
 * Build the deterministic public blob URL for an asset, without hitting
 * KV. Returns null when the blob token isn't configured (so callers
 * know to fall through to other lookup strategies).
 */
export function deterministicAssetUrl(
  solution: string,
  assetType: string,
  itemId?: string
): string | null {
  const host = publicBlobHost()
  if (!host) return null
  const blobPath = assetBlobPath(solution, assetType, itemId)
  if (!blobPath) return null
  return `${host}/${blobPath}`
}

/**
 * Resolve an asset URL using the full lookup chain:
 *   KV cache -> deterministic URL (backfilling KV if found) -> null.
 *
 * Returns the URL string when the asset is reachable somewhere, or null
 * when neither path turns up anything.
 */
export async function resolveAssetUrl(
  solution: string,
  assetType: string,
  itemId?: string
): Promise<string | null> {
  const key = assetKvKey(solution, assetType, itemId)

  // KV first (fast happy path).
  try {
    const cached = await kv.get<string>(key)
    if (cached) return cached
  } catch {
    /* fall through */
  }

  // Deterministic URL recovery. We probe with a HEAD to avoid handing
  // back a URL that doesn't actually exist (e.g. caller asked about an
  // asset that was never put()).
  const direct = deterministicAssetUrl(solution, assetType, itemId)
  if (direct) {
    try {
      const probe = await fetch(direct, { method: "HEAD", cache: "no-store" })
      if (probe.ok) {
        // Best-effort backfill - don't await so we don't add latency.
        kv.set(key, direct).catch(() => { /* ignore */ })
        return direct
      }
    } catch {
      /* ignore */
    }
  }

  return null
}
