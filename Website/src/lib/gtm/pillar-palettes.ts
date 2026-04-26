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
    name: "Violet",
    primary: "#6B21D4",
    light: "#9B5FE8",
    dark: "#2D0770",
    heroGrad: "linear-gradient(135deg, #2D0770 0%, #4A0FA8 55%, #9B5FE8 100%)",
    lightBg: "linear-gradient(145deg, #F8F4FF 0%, #EDE6FF 100%)",
    // Fine blueprint grid - structured, architectural; evokes trade show floor plans
    decorPattern: "linear-gradient(rgba(155,95,232,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(155,95,232,0.10) 1px, transparent 1px)",
    decorSize: "44px 44px, 44px 44px",
  },
  recruiting: {
    name: "Teal",
    primary: "#0AA891",
    light: "#5FD9C2",
    dark: "#040E28",
    heroGrad: "linear-gradient(135deg, #040E28 0%, #1A8A76 55%, #5FD9C2 100%)",
    lightBg: "linear-gradient(145deg, #E8FDF8 0%, #F0FFFC 100%)",
    // Scattered bokeh orbs - soft glows suggesting talent, energy, connection
    decorPattern: "radial-gradient(circle at 22% 28%, rgba(10,168,145,0.18), transparent 38%), radial-gradient(circle at 78% 18%, rgba(95,217,194,0.16), transparent 34%), radial-gradient(circle at 60% 82%, rgba(10,168,145,0.15), transparent 36%), radial-gradient(circle at 18% 88%, rgba(95,217,194,0.13), transparent 30%)",
    decorSize: "auto",
  },
  "field-sales": {
    name: "Amber",
    primary: "#D4940A",
    light: "#F2B33D",
    dark: "#1A0A00",
    heroGrad: "linear-gradient(135deg, #1A0A00 0%, #A86B00 55%, #F2B33D 100%)",
    lightBg: "linear-gradient(145deg, #FFF9E8 0%, #FFFCF0 100%)",
    // Halftone dot grid - precise, operational, on-the-ground feel
    decorPattern: "radial-gradient(circle, rgba(242,179,61,0.13) 1px, transparent 1.4px)",
    decorSize: "18px 18px",
  },
  facilities: {
    name: "Indigo",
    primary: "#3A2073",
    light: "#5B4499",
    dark: "#0D0820",
    heroGrad: "linear-gradient(135deg, #0D0820 0%, #3A2073 55%, #5B4499 100%)",
    lightBg: "linear-gradient(145deg, #EEF0FF 0%, #F4F5FF 100%)",
    // Concentric topographic rings - evokes space, place, architectural depth
    decorPattern: "repeating-radial-gradient(circle at 25% 70%, transparent 0 36px, rgba(91,68,153,0.14) 36px 37px, transparent 37px 74px, rgba(91,68,153,0.10) 74px 75px)",
    decorSize: "auto",
  },
  "events-venues": {
    name: "Crimson",
    primary: "#D43D1A",
    light: "#F25E3D",
    dark: "#1A0400",
    heroGrad: "linear-gradient(135deg, #1A0400 0%, #8F200A 55%, #F25E3D 100%)",
    lightBg: "linear-gradient(145deg, #FFF2EE 0%, #FFF7F5 100%)",
    // Spotlight radial glows - stage lighting, live event energy
    decorPattern: "radial-gradient(circle at 50% 0%, rgba(242,94,61,0.22), transparent 55%), radial-gradient(circle at 20% 90%, rgba(212,61,26,0.16), transparent 40%), radial-gradient(circle at 80% 85%, rgba(242,94,61,0.14), transparent 38%)",
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
