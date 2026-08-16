/**
 * Content types that render as an HTML/graphic asset (a Canva-rendered card,
 * carousel, infographic, etc.) versus plain text (cold emails, DM sequences,
 * scripts). Mirrors ContentLibrary's `HTML_ASSET_TYPES` gate so any surface
 * that decides whether to offer a graphic — Content Library, the calendar's
 * TaskDetailModal — stays in sync.
 *
 * Keyed on the library item's `contentType` (brand-studio's content-type
 * vocabulary: cold-emails, linkedin-dm, social-post, carousel, lead-magnet,
 * discovery-script, partner-pitch, battle-card, microsite, pitch-deck,
 * infographic, one-pager), NOT on `assetType` — `assetType` is a derived
 * graphic "kind" that `assetTypeForContentType` defaults to social-post for
 * every content type, visual or not, so it can't be used to tell them apart.
 */
const VISUAL_CONTENT_TYPES = new Set([
  "infographic",
  "microsite",
  "carousel",
  "social-post",
  "linkedin-post",
  "one-pager",
  "pitch-deck",
])

export function isVisualContentType(contentType: string): boolean {
  const ct = (contentType || "").toLowerCase().trim()
  return VISUAL_CONTENT_TYPES.has(ct)
}
