/**
 * Shared helpers for the template preview iframes (picker thumbnails and the
 * enlarged preview modal).
 */

import type { TemplateManifest } from "@/lib/gtm/templates/types"

export type PickerMedia = { bgImage?: string; bgOpacity?: number }

/**
 * Each preview iframe is rendered at the template's NATIVE stage size so its
 * clamp()-based font math hits the sizes designers tuned it for, then
 * CSS-scaled down to fit its box. The sizes must match the `.stage`
 * width/height in template.html exactly — the templates center the stage in
 * the body, so a larger viewport shows the card floating inside dead space
 * (16:9 is 1280×720, not 1920×1080).
 */
export function nativeSize(aspect: TemplateManifest["aspectRatio"]): { width: number; height: number } {
  if (aspect === "16:9") return { width: 1280, height: 720 }
  if (aspect === "3:4") return { width: 1080, height: 1440 }
  return { width: 1080, height: 1080 }
}

export function templatePreviewSrc(t: TemplateManifest, solution: string): string {
  return `/api/gtm/template-preview?assetType=${encodeURIComponent(t.assetType)}&templateId=${encodeURIComponent(t.id)}&pillar=${encodeURIComponent(solution)}`
}

/**
 * Paint the chosen background photo into a preview frame. The frames are
 * same-origin (`/api/gtm/template-preview`), and every social-post template
 * reads its photo from `--bg-image` / `--bg-opacity` declared on its root
 * (`.stage`, or `.card` for wide-banner-11), so setting those inline on the
 * root mirrors exactly what `mediaMap()` does at fill time — without shipping
 * a multi-MB data URI through a GET URL. Clearing the photo removes them again.
 */
export function applyMediaToFrame(frame: HTMLIFrameElement, media: PickerMedia | undefined) {
  let doc: Document | null
  try {
    doc = frame.contentDocument
  } catch {
    return
  }
  const root = doc?.querySelector<HTMLElement>(".stage, .card")
  if (!root) return
  const uri = (media?.bgImage ?? "").replace(/["\\]/g, "").trim()
  if (!uri) {
    root.style.removeProperty("--bg-image")
    root.style.removeProperty("--bg-opacity")
    return
  }
  const raw = Number(media?.bgOpacity)
  const pct = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 100
  root.style.setProperty("--bg-image", `url("${uri}")`)
  root.style.setProperty("--bg-opacity", String(Math.round(pct) / 100))
}
