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
import type { Palette } from "@/lib/gtm/pillar-palettes"
import type { TemplateManifest } from "./types"
import { templateRegistry } from "./_registry"

/** Optional background photo for social-post renders. `bgOpacity` is 0–100. */
export type RenderMedia = { bgImage?: string; bgOpacity?: number }

/**
 * Thin-line icons available for the CTA pill. Each is a 24x24 stroke path
 * set at 1.75px with round caps/joins so it reads at the same visual weight
 * as the pill's 600-weight Inter label. `currentColor` inherits the pill's
 * text color, so the same icon works on a filled and an inverted pill.
 *
 * The CTA_ICON slot's value is one of these ids (or "none"). renderTemplate
 * expands `{{CTA_ICON}}` to the raw <svg> below, tagged data-slot="CTA_ICON"
 * so the standard hidden-slot rule collapses it.
 */
export const CTA_ICONS: Record<string, { label: string; path: string }> = {
  "arrow-right":   { label: "Arrow",         path: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>' },
  "calendar":      { label: "Calendar",      path: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>' },
  "play":          { label: "Play",          path: '<path d="M7 5v14l11-7z"/>' },
  "download":      { label: "Download",      path: '<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>' },
  "external-link": { label: "External link", path: '<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/>' },
  "mail":          { label: "Mail",          path: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>' },
  "phone":         { label: "Phone",         path: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>' },
  "sparkle":       { label: "Sparkle",       path: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m12 7 1.6 3.4L17 12l-3.4 1.6L12 17l-1.6-3.4L7 12l3.4-1.6z"/>' },
}
export const CTA_ICON_IDS = Object.keys(CTA_ICONS)
export const DEFAULT_CTA_ICON = "arrow-right"

/** Raw SVG for a CTA icon id; "" for "none" or an unknown id. */
export function ctaIconSvg(id: string | undefined): string {
  const icon = id ? CTA_ICONS[id] : undefined
  if (!icon) return ""
  return `<svg class="cta-icon" data-slot="CTA_ICON" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon.path}</svg>`
}

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
 * Caller slot values are HTML-escaped (they are text nodes in every
 * template); reserved palette/media keys are raw CSS values.
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
    if (key in slots) return escapeHtml(slots[key])
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
