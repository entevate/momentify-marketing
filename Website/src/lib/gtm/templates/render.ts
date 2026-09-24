/**
 * Template rendering + loading helpers.
 *
 * `renderTemplate` is pure - string substitution only, no I/O. That makes
 * it trivially unit-testable and usable in both server and (future) edge
 * contexts.
 *
 * `loadTemplate` reads the static HTML from disk. This module runs in
 * Next.js's Node server runtime, so `fs` is available.
 */

import fs from "fs/promises"
import path from "path"
import { escapeHtml } from "@/lib/gtm/link-page-types"
import { renderRichText } from "@/lib/gtm/rich-text"
import type { Palette } from "@/lib/gtm/pillar-palettes"
import type { TemplateManifest } from "./types"
import { templateRegistry } from "./_registry"

/** Optional background photo for social-post renders. `bgOpacity` is 0–100. */
export type RenderMedia = { bgImage?: string; bgOpacity?: number }

// The icon map lives in its own fs-free module so client components can
// import it without dragging this file's `fs/promises` into the browser
// bundle. Re-exported here so server callers keep a single import site.
import { ctaIconSvg } from "./cta-icons"
export { CTA_ICONS, CTA_ICON_IDS, DEFAULT_CTA_ICON, ctaIconSvg } from "./cta-icons"

/** Reserved keys: BG_IMAGE → `url("…")` or `none`; BG_OPACITY → 0–1. */
export function mediaMap(media?: RenderMedia): Record<string, string> {
  const uri = (media?.bgImage ?? "").replace(/["\\]/g, "").trim()
  const raw = Number(media?.bgOpacity)
  const pct = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 100
  return {
    BG_IMAGE: uri ? `url("${uri}")` : "none",
    BG_OPACITY: String(Math.round(pct) / 100),
  }
}

/**
 * Replace `{{KEY}}` placeholders in `html` with values from `slots`, then
 * inject palette CSS variables via an additional replacement pass on the
 * reserved palette keys: PRIMARY, PRIMARY_LIGHT, PRIMARY_DARK, HERO_GRAD,
 * LIGHT_BG, DECOR_PATTERN, DECOR_SIZE, plus the media keys BG_IMAGE and
 * BG_OPACITY. Reserved keys always win over `slots`. Missing keys resolve to
 * empty strings (so an unfilled slot degrades gracefully, rather than
 * showing the literal `{{KEY}}`).
 *
 * Caller slot values are HTML-escaped and then run through
 * `renderRichText`, which turns the stored plain-text markers (newline,
 * `**bold**`, `__underline__`, `*italic*`) into `<br>`/`<strong>`/`<u>`/`<em>`
 * (they are text nodes in every template - no slot sits inside an
 * attribute). A value with no markers is substituted byte-identically to
 * before. Reserved palette/media keys are raw CSS values.
 *
 * `hidden` lists slot keys the user toggled off. A hidden key renders as an
 * empty string whatever `slots` holds, AND gets a
 * `[data-slot="KEY"]{display:none !important}` rule so its element (tagged by
 * scripts/add-slot-tags.mjs) collapses rather than leaving a gap - emptying
 * the text alone still leaves the element's padding, border, and flex/grid
 * track behind. Every rule goes in ONE style tag injected immediately before
 * `</head>`, or prepended when the document has no head.
 *
 * An absent or empty `hidden` injects nothing at all, so existing output stays
 * byte-identical. Keys that are not plain `[A-Z0-9_]+` are dropped rather than
 * escaped: nothing caller-controlled should reach a raw style tag.
 */
export function renderTemplate(
  html: string,
  slots: Record<string, string>,
  palette: Palette,
  media?: RenderMedia,
  hidden?: string[]
): string {
  // Dedupe so a repeated key never yields a repeated rule.
  const hiddenSet = new Set(
    (hidden ?? []).filter((k) => typeof k === "string" && /^[A-Z0-9_]+$/.test(k))
  )
  const hiddenKeys = [...hiddenSet]
  const paletteMap: Record<string, string> = {
    PRIMARY: palette.primary,
    PRIMARY_LIGHT: palette.light,
    PRIMARY_DARK: palette.dark,
    HERO_GRAD: palette.heroGrad,
    LIGHT_BG: palette.lightBg,
    DECOR_PATTERN: palette.decorPattern,
    DECOR_SIZE: palette.decorSize,
    ...mediaMap(media),
  }
  const filled = html.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_m, key: string) => {
    if (key in paletteMap) return paletteMap[key]
    if (hiddenSet.has(key)) return ""
    // CTA_ICON holds an icon id, not copy: expand to raw SVG rather than
    // escaped text. Unknown ids and "none" resolve to nothing.
    if (key === "CTA_ICON") return ctaIconSvg(slots[key])
    // Escape FIRST, then convert the light markers (**bold**, __underline__,
    // *italic*, newline) to tags: a user's `<` can never open an element,
    // because by the time renderRichText sees it, it is already `&lt;`.
    if (key in slots) return renderRichText(escapeHtml(slots[key]))
    return ""
  })
  if (hiddenKeys.length === 0) return filled

  const rules = hiddenKeys.map((k) => `[data-slot="${k}"]{display:none !important}`).join("")
  const styleTag = `<style>${rules}</style>`
  const headClose = filled.indexOf("</head>")
  return headClose < 0
    ? styleTag + filled
    : filled.slice(0, headClose) + styleTag + filled.slice(headClose)
}

/**
 * List all templates registered for an asset type. Pure read from the
 * in-process registry (populated by `_registry.ts` at import time).
 */
export function listTemplates(assetType: string): TemplateManifest[] {
  return templateRegistry[assetType] || []
}

/**
 * Look up a template's manifest by id, scoped to an asset type.
 */
export function findTemplate(
  assetType: string,
  templateId: string
): TemplateManifest | undefined {
  return listTemplates(assetType).find((t) => t.id === templateId)
}

/**
 * Read a template's HTML body from disk. The template file sits beside its
 * manifest at `src/lib/gtm/templates/{assetType}/{templateId}/template.html`.
 * Returns null if the file cannot be read (missing, permission error, etc).
 */
export async function loadTemplateHtml(
  assetType: string,
  templateId: string
): Promise<string | null> {
  // Validate shape so we never reach outside the templates dir.
  if (!/^[a-z0-9_-]+$/.test(assetType)) return null
  if (!/^[a-z0-9_-]+$/.test(templateId)) return null
  const filePath = path.join(
    process.cwd(),
    "src",
    "lib",
    "gtm",
    "templates",
    assetType,
    templateId,
    "template.html"
  )
  try {
    return await fs.readFile(filePath, "utf-8")
  } catch {
    return null
  }
}
