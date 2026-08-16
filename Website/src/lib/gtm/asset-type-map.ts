/**
 * A content piece has a contentType (linkedin-post, carousel, infographic, …).
 * A graphic has an assetType (the template family: social-post, carousel,
 * infographic, one-pager, microsite, pitch-deck). Auto-generate produces only a
 * contentType; this maps it to the assetType the AssetPanel and preview gate use,
 * so a placed piece can carry and render a graphic. Unknown types default to
 * social-post (the square-card family) — the safest visual default.
 */
const EXACT: Record<string, string> = {
  "social-post": "social-post",
  "carousel": "carousel",
  "infographic": "infographic",
  "one-pager": "one-pager",
  "microsite": "microsite",
  "pitch-deck": "pitch-deck",
}

export function assetTypeForContentType(contentType: string): string {
  const ct = (contentType || "").toLowerCase().trim()
  if (Object.prototype.hasOwnProperty.call(EXACT, ct)) return EXACT[ct]
  if (ct.includes("carousel")) return "carousel"
  if (ct.includes("infographic")) return "infographic"
  if (ct.includes("one-pager") || ct.includes("onepager")) return "one-pager"
  if (ct.includes("microsite")) return "microsite"
  if (ct.includes("pitch") || ct.includes("deck")) return "pitch-deck"
  // linkedin-post, tweet, instagram, facebook, generic social → square card
  return "social-post"
}
