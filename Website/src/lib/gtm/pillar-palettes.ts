/**
 * Momentify GTM solution palettes - single source of truth.
 *
 * Covers Momentify's five go-to-market solution pillars:
 *   trade-shows, recruiting, field-sales, facilities, events-venues
 *
 * Used by the template renderer, Claude asset-generation prompts, and any
 * future consumer so that mutating a color in one place updates every surface.
 */

export type PillarId = "trade-shows" | "recruiting" | "field-sales" | "facilities" | "events-venues"

export interface Palette {
  name: string
  primary: string
  light: string
  dark: string
  /** CSS gradient string used on hero/cover regions */
  heroGrad: string
  /** CSS gradient string used on tinted/light accent regions */
  lightBg: string
  /**
   * Pillar-specific decorative background pattern - a CSS background-image
   * value (gradient or url()). Gives each pillar a signature motif:
   *   - trade-shows:    fine grid lines (structured, booth/floor plan feel)
   *   - recruiting:     scattered bokeh orbs (energy, talent attraction)
   *   - field-sales:    halftone dot grid (operational, on-the-ground)
   *   - facilities:     concentric topographic rings (place, space, depth)
   *   - events-venues:  spotlight radial glows (stage lighting, live events)
   */
  decorPattern: string
  /**
   * Corresponding background-size (keyed to decorPattern). Gradients use
   * "auto" since they handle their own period; the dot grid needs an
   * explicit tile size.
   */
  decorSize: string
}

export const pillarPalettes: Record<PillarId, Palette> = {
  "trade-shows": {
    name: "Teal",
    primary: "#2bbfa8",
    light: "#6dd4a0",
    dark: "#0B2F2A",
    heroGrad: "linear-gradient(90deg, #2bbfa8 0%, #6dd4a0 100%)",
    lightBg: "linear-gradient(135deg, rgba(43,191,168,0.12) 0%, rgba(109,212,160,0.12) 100%)",
    // Fine blueprint grid - structured, architectural; evokes trade show floor plans
    decorPattern: "linear-gradient(rgba(43,191,168,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(43,191,168,0.08) 1px, transparent 1px)",
    decorSize: "44px 44px, 44px 44px",
  },
  recruiting: {
    name: "Blue",
    primary: "#2060d8",
    light: "#38c6f4",
    dark: "#0a1f4a",
    heroGrad: "linear-gradient(90deg, #2060d8 0%, #38c6f4 100%)",
    lightBg: "linear-gradient(135deg, rgba(32,96,216,0.12) 0%, rgba(56,198,244,0.12) 100%)",
    // Scattered bokeh orbs - soft glows suggesting talent, energy, connection
    decorPattern: "radial-gradient(circle at 22% 28%, rgba(32,96,216,0.18), transparent 38%), radial-gradient(circle at 78% 18%, rgba(56,198,244,0.16), transparent 34%), radial-gradient(circle at 60% 82%, rgba(32,96,216,0.15), transparent 36%), radial-gradient(circle at 18% 88%, rgba(56,198,244,0.13), transparent 30%)",
    decorSize: "auto",
  },
  "field-sales": {
    name: "Orange",
    primary: "#e8782a",
    light: "#f5b731",
    dark: "#1A0400",
    heroGrad: "linear-gradient(90deg, #e8782a 0%, #f5b731 100%)",
    lightBg: "linear-gradient(135deg, rgba(232,120,42,0.12) 0%, rgba(245,183,49,0.12) 100%)",
    // Halftone dot grid - precise, operational, on-the-ground feel
    decorPattern: "radial-gradient(circle, rgba(232,120,42,0.11) 1px, transparent 1.4px)",
    decorSize: "18px 18px",
  },
  facilities: {
    name: "Purple",
    primary: "#6a6b9e",
    light: "#8e90c0",
    dark: "#0D0820",
    heroGrad: "linear-gradient(90deg, #5b5c8c 0%, #8e90c0 100%)",
    lightBg: "linear-gradient(135deg, rgba(91,92,140,0.12) 0%, rgba(142,144,192,0.12) 100%)",
    // Concentric topographic rings - evokes space, place, architectural depth
    decorPattern: "repeating-radial-gradient(circle at 25% 70%, transparent 0 36px, rgba(142,144,192,0.14) 36px 37px, transparent 37px 74px, rgba(142,144,192,0.10) 74px 75px)",
    decorSize: "auto",
  },
  "events-venues": {
    name: "Magenta",
    primary: "#c8256a",
    light: "#e86090",
    dark: "#280010",
    heroGrad: "linear-gradient(90deg, #c8256a 0%, #e86090 100%)",
    lightBg: "linear-gradient(135deg, rgba(200,37,106,0.12) 0%, rgba(232,96,144,0.12) 100%)",
    // Spotlight radial glows - stage lighting, live event energy
    decorPattern: "radial-gradient(circle at 50% 0%, rgba(200,37,106,0.20), transparent 55%), radial-gradient(circle at 20% 90%, rgba(232,96,144,0.14), transparent 40%), radial-gradient(circle at 80% 85%, rgba(200,37,106,0.12), transparent 38%)",
    decorSize: "auto",
  },
}

export const defaultPalette: Palette = pillarPalettes["trade-shows"]

export function paletteFor(solution: string): Palette {
  return pillarPalettes[solution as PillarId] || defaultPalette
}

export const pillarLabels: Record<PillarId, string> = {
  "trade-shows": "Trade Shows",
  recruiting: "Recruiting",
  "field-sales": "Field Sales",
  facilities: "Facilities",
  "events-venues": "Events & Venues",
}

export function isPillarId(v: string): v is PillarId {
  return (
    v === "trade-shows" ||
    v === "recruiting" ||
    v === "field-sales" ||
    v === "facilities" ||
    v === "events-venues"
  )
}
