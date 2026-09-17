import { stripEmDashes } from "@/lib/gtm/sanitize"
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
 * truncate to each slot's maxChars. Null when the input is not an object.
 */
export function filterSlots(input: unknown, spec: SlotSpec[]): Record<string, string> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null
  const out: Record<string, string> = {}
  for (const s of spec) {
    const v = (input as Record<string, unknown>)[s.key]
    if (v === undefined || v === null) continue
    out[s.key] = stripEmDashes(String(v)).slice(0, s.maxChars)
  }
  return out
}
