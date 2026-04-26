// ─── Shared validation + path helpers for the generic asset-* API routes ───
//
// Assets are now persisted to Vercel Blob (not the local filesystem). Vercel's
// serverless runtime has a read-only FS, so writes to public/gtm fail in prod.
// The old fs.writeFileSync path worked only on local dev.

// Solution/assetType must be filesystem- and URL-safe.
export const isValidAssetParam = (param: string): boolean => /^[a-zA-Z0-9_-]+$/.test(param)

// Supported asset types for one-click generation (pitch-deck intentionally excluded - uses Build-with-Claude-Code flow)
export const SUPPORTED_ASSET_TYPES = ["infographic", "microsite", "carousel", "one-pager"] as const
export type SupportedAssetType = (typeof SUPPORTED_ASSET_TYPES)[number]

export const PITCH_DECK_MESSAGE =
  "Pitch decks use the Build with Claude Code manual flow - one-click generation isn't supported for this asset type."

/**
 * Filename for a generated asset.
 * - Without itemId: `{solution}-{assetType}.html` (one-off from Content Builder)
 * - With itemId:    `{solution}-{assetType}-{itemId}.html` (asset attached to a Library item)
 */
export function assetFilename(solution: string, assetType: string, itemId?: string): string {
  if (itemId && isValidAssetParam(itemId)) return `${solution}-${assetType}-${itemId}.html`
  return `${solution}-${assetType}.html`
}

/**
 * Blob path inside Vercel Blob: `gtm/assets/{filename}`. Passed to `put()`;
 * the returned blob URL is what clients (iframe/preview) use.
 */
export function assetBlobPath(solution: string, assetType: string, itemId?: string): string | null {
  if (!isValidAssetParam(solution) || !isValidAssetParam(assetType)) return null
  if (itemId && !isValidAssetParam(itemId)) return null
  return `gtm/assets/${assetFilename(solution, assetType, itemId)}`
}

/**
 * KV key where the blob URL is cached once the asset has been uploaded/generated.
 * The asset-check route reads this key; the generate + upload routes write it.
 */
export function assetKvKey(solution: string, assetType: string, itemId?: string): string {
  return `gtm:asset:${solution}:${assetType}:${itemId || "none"}`
}
