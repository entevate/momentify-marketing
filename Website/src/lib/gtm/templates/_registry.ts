/**
 * Template registry - imports every template manifest in the repo and
 * exposes a single map keyed by asset type. Consumers (gallery page,
 * preview API, fill-template endpoint) read from `templateRegistry`
 * rather than hitting the filesystem themselves.
 *
 * Manifests are imported as JSON so they're bundled at build time.
 */

import boldStat1x1 from "./social-post/bold-stat-1x1/manifest.json"
import boldStat34 from "./social-post/bold-stat-34/manifest.json"
import boldStat169 from "./social-post/bold-stat-169/manifest.json"
import headlineQuote11 from "./social-post/headline-quote-11/manifest.json"
import headlineQuote34 from "./social-post/headline-quote-34/manifest.json"
import headlineQuote169 from "./social-post/headline-quote-169/manifest.json"
import wideBanner11 from "./social-post/wide-banner-11/manifest.json"
import wideBanner34 from "./social-post/wide-banner-34/manifest.json"
import wideBanner169 from "./social-post/wide-banner-169/manifest.json"
import roxReport11 from "./social-post/rox-report-11/manifest.json"
import roxReport34 from "./social-post/rox-report-34/manifest.json"
import roxReport169 from "./social-post/rox-report-169/manifest.json"
import solutionFeature11 from "./social-post/solution-feature-11/manifest.json"
import solutionFeature34 from "./social-post/solution-feature-34/manifest.json"
import solutionFeature169 from "./social-post/solution-feature-169/manifest.json"
import type { TemplateManifest } from "./types"

// Cast via unknown - the JSON type-inferred shape is narrower (literal
// types) than TemplateManifest, so go through unknown once and trust the
// runtime shape. Adding a new manifest? Import above, push below.
const socialPost: TemplateManifest[] = [
  boldStat1x1,
  boldStat34,
  boldStat169,
  headlineQuote11,
  headlineQuote34,
  headlineQuote169,
  wideBanner11,
  wideBanner34,
  wideBanner169,
  roxReport11,
  roxReport34,
  roxReport169,
  solutionFeature11,
  solutionFeature34,
  solutionFeature169,
].map((m) => m as unknown as TemplateManifest)

export const templateRegistry: Record<string, TemplateManifest[]> = {
  "social-post": socialPost,
}

/** Flat list of every registered template, handy for gallery iteration. */
export const allTemplates: TemplateManifest[] = Object.values(templateRegistry).flat()
