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
 */
export function renderTemplate(
  html: string,
  slots: Record<string, string>,
  palette: Palette,
  media?: RenderMedia
): string {
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
  return html.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_m, key: string) => {
    if (key in paletteMap) return paletteMap[key]
    if (key in slots) return escapeHtml(slots[key])
    return ""
  })
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
