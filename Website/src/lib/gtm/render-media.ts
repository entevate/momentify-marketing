import { stripEmDashes } from "@/lib/gtm/sanitize"
import { truncateVisible } from "@/lib/gtm/rich-text"
import type { SlotSpec } from "@/lib/gtm/templates/types"
import type { RenderMedia } from "@/lib/gtm/templates/render"

/** Data-URI images are inlined into the stored HTML, so cap them. */
export const MAX_BG_BYTES = 3 * 1024 * 1024
const DATA_URI = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/

export type MediaParse = { ok: true; media: RenderMedia | undefined } | { ok: false; error: string }

/** Validate optional `bgImage` (inline data URI ≤ 3 MB) and `bgOpacity` (0–100). */
export function parseRenderMedia(body: { bgImage?: unknown; bgOpacity?: unknown }): MediaParse {
  const media: RenderMedia = {}
  if (body.bgImage !== undefined && body.bgImage !== null && body.bgImage !== "") {
    if (typeof body.bgImage !== "string") return { ok: false, error: "bgImage must be a data URI string" }
    const m = body.bgImage.match(DATA_URI)
    if (!m) return { ok: false, error: "bgImage must be a base64 data URI of type image/png, image/jpeg or image/webp" }
    const bytes = Math.floor((m[2].length * 3) / 4)
    if (bytes > MAX_BG_BYTES) return { ok: false, error: "Background image is larger than 3 MB" }
    media.bgImage = body.bgImage
  }
  if (body.bgOpacity !== undefined && body.bgOpacity !== null) {
    const raw = body.bgOpacity
    const isNum = typeof raw === "number"
    const isNumericString = typeof raw === "string" && /^\d+(\.\d+)?$/.test(raw.trim())
    const n = isNum ? raw : isNumericString ? Number(raw) : NaN
    if (!Number.isFinite(n) || n < 0 || n > 100) {
      return { ok: false, error: "bgOpacity must be a number from 0 to 100" }
    }
    media.bgOpacity = n
  }
  return { ok: true, media: Object.keys(media).length ? media : undefined }
}

/**
 * Keep only the manifest's slot keys, coerce to strings, strip em-dashes,
 * truncate to each slot's maxChars measured in VISIBLE characters (rich-text
 * markers are free). Null when the input is not an object.
 */
export function filterSlots(input: unknown, spec: SlotSpec[]): Record<string, string> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null
  const out: Record<string, string> = {}
  for (const s of spec) {
    const v = (input as Record<string, unknown>)[s.key]
    if (v === undefined || v === null) continue
    // Visible-character truncation: a slot's rich-text markers are free and
    // stay balanced, so a hard cut can't leave a dangling `**`.
    out[s.key] = truncateVisible(stripEmDashes(String(v)), s.maxChars)
  }
  return out
}

/**
 * Slot keys the user toggled off, filtered to the manifest's own keys and
 * deduped. Anything that is not an array of strings (absent body field,
 * object, string, number) yields `[]`, i.e. nothing hidden - the contract's
 * default, which renders byte-identically to before the feature existed.
 *
 * Filtering against the spec is what keeps a caller from injecting an
 * arbitrary attribute selector into the rendered style tag.
 */
export function parseHidden(input: unknown, spec: SlotSpec[]): string[] {
  if (!Array.isArray(input)) return []
  const allowed = new Set(spec.map((s) => s.key))
  const out = new Set<string>()
  for (const v of input) {
    if (typeof v === "string" && allowed.has(v)) out.add(v)
  }
  return [...out]
}

/**
 * Per-card variant for carousels: exactly `count` arrays, each parsed by
 * `parseHidden`. A wrong shape (not an array, or the wrong length) yields
 * `count` independent empty arrays rather than a partial result, so a
 * malformed field can never desynchronise the hidden lists from the cards.
 */
export function parseHiddenCards(input: unknown, spec: SlotSpec[], count: number): string[][] {
  const empty = () => Array.from({ length: count }, () => [] as string[])
  if (!Array.isArray(input) || input.length !== count) return empty()
  return input.map((c) => parseHidden(c, spec))
}
