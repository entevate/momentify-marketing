/**
 * Thin-line icons available for the CTA pill.
 *
 * Kept in its own dependency-free module (no fs, no registry) because the
 * client-side SlotEditor imports it. render.ts pulls in `fs/promises` for
 * loadTemplateHtml, so importing the icon map from there would drag a
 * Node-only module into the browser bundle and fail the Turbopack build.
 *
 * Each icon is a 24x24 stroke path set at 1.75px with round caps/joins so
 * it reads at the same visual weight as the pill's 600-weight Inter label.
 * `currentColor` inherits the pill's text color, so one icon works on a
 * filled and an inverted pill alike.
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
