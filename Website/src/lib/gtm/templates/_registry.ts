/**
 * Template registry - imports every template manifest in the repo and
 * exposes a single map keyed by asset type. Consumers (gallery page,
 * preview API, fill-template endpoint) read from `templateRegistry`
 * rather than hitting the filesystem themselves.
 *
 * Manifests are imported as JSON so they're bundled at build time.
 */

import boldStat1x1 from "./social-post/bold-stat-1x1/manifest.json"
import headlineQuote34 from "./social-post/headline-quote-34/manifest.json"
import wideBanner169 from "./social-post/wide-banner-169/manifest.json"
import type { TemplateManifest } from "./types"

// Cast via unknown - the JSON type-inferred shape is narrower (literal
// types) than TemplateManifest, so go through unknown once and trust the
// runtime shape. Adding a new manifest? Import above, push below.
const socialPost: TemplateManifest[] = [
  boldStat1x1,
  headlineQuote34,
  wideBanner169,
].map((m) => m as unknown as TemplateManifest)

export const templateRegistry: Record<string, TemplateManifest[]> = {
  "social-post": socialPost,
}

/** Flat list of every registered template, handy for gallery iteration. */
export const allTemplates: TemplateManifest[] = Object.values(templateRegistry).flat()
