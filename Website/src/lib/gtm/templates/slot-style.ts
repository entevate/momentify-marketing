/**
 * Per-slot type controls: a size scale and a line-height override for
 * headline slots.
 *
 * The settings ride along inside the slot values under derived keys
 * (`HEADLINE__SIZE`, `HEADLINE__LEADING`), so the editor draft, "Update
 * preview", the KV restore and carousels all carry them with no extra
 * plumbing. The keys never appear as `{{…}}` placeholders in a template.
 *
 * fs-free so the client editor can import it.
 */

import type { SlotSpec } from "./types"

export const SIZE_SUFFIX = "__SIZE"
export const LEADING_SUFFIX = "__LEADING"

/** Size is a percent of the template's own font size. */
export const SIZE_MIN = 50
export const SIZE_MAX = 160
export const SIZE_STEP = 5
/** Unitless line-height. Unset means the template's own value. */
export const LEADING_MIN = 0.8
export const LEADING_MAX = 1.6
export const LEADING_STEP = 0.02
/** Where the line-spacing slider sits before the user moves it. */
export const LEADING_DEFAULT_POS = 1.1

/** Slot kinds that get the type controls. */
export function hasTypeControls(s: SlotSpec): boolean {
  return s.kind === "headline"
}

/** The derived value keys a manifest allows, e.g. ["HEADLINE__SIZE", "HEADLINE__LEADING"]. */
export function styleKeysFor(spec: SlotSpec[]): string[] {
  return spec.filter(hasTypeControls).flatMap((s) => [s.key + SIZE_SUFFIX, s.key + LEADING_SUFFIX])
}

/**
 * A stored style value, or "" when it is missing, not a number or out of
 * range. Size 100 also reads as "" since it is the template default.
 */
export function normStyleValue(key: string, raw: unknown): string {
  const n = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN
  if (!Number.isFinite(n)) return ""
  if (key.endsWith(SIZE_SUFFIX)) {
    const v = Math.round(Math.min(SIZE_MAX, Math.max(SIZE_MIN, n)))
    return v === 100 ? "" : String(v)
  }
  if (key.endsWith(LEADING_SUFFIX)) {
    const v = Math.round(Math.min(LEADING_MAX, Math.max(LEADING_MIN, n)) * 100) / 100
    return String(v)
  }
  return ""
}

/**
 * CSS rules for every style key present in `values`. The size sets
 * `--slot-scale`, which each template's headline font-size multiplies by;
 * the line-height overrides the template's directly. Empty string when
 * nothing is set, so a render without settings stays byte-identical.
 */
export function slotStyleRules(values: Record<string, string>): string {
  const bySlot = new Map<string, string[]>()
  for (const [key, raw] of Object.entries(values)) {
    const m = key.match(/^([A-Z0-9_]+?)(__SIZE|__LEADING)$/)
    if (!m) continue
    const v = normStyleValue(key, raw)
    if (!v) continue
    const decls = bySlot.get(m[1]) ?? []
    decls.push(m[2] === SIZE_SUFFIX ? `--slot-scale:${Number(v) / 100}` : `line-height:${v} !important`)
    bySlot.set(m[1], decls)
  }
  return [...bySlot].map(([slot, decls]) => `[data-slot="${slot}"]{${decls.join(";")}}`).join("")
}
