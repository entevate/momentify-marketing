/**
 * Shared types for the Momentify template system.
 *
 * A template is a static HTML document with `{{DOUBLE_CURLY}}` placeholders.
 * The manifest describes each placeholder (`slot`) and ships sample data the
 * preview route uses when no runtime values have been generated yet.
 */

export type SlotKind =
  | "headline"       // short bold sentence, up to ~14 words
  | "eyebrow"        // uppercase label, 1-3 words
  | "support"        // one supporting sentence, ~20 words
  | "stat_number"    // numerical stat like "73%" or "3.2x"
  | "stat_label"     // caption under the stat
  | "quote"          // pull quote, no quotation marks
  | "attribution"    // quote source (name + role)
  | "cta_label"      // e.g. "Schedule a Discovery Call"
  | "bullet"         // one short bullet point

export interface SlotSpec {
  /** Placeholder key WITHOUT the `{{` `}}` wrappers - e.g. "HEADLINE" */
  key: string
  /** Human-readable label for the slot (used in UIs later) */
  label: string
  kind: SlotKind
  /** Soft character cap - fed to Claude's fill prompt later */
  maxChars: number
  /** Example copy used when no sampleData is provided */
  example: string
}

export interface TemplateManifest {
  /** Stable id, matches the directory name (e.g. "bold-stat-1x1") */
  id: string
  /** Human label shown in the gallery (e.g. "Bold Stat · Square") */
  label: string
  /** Asset type (currently always "social-post") */
  assetType: "social-post"
  /** "1:1" (square), "3:4" (portrait), or "16:9" (landscape) */
  aspectRatio: "1:1" | "3:4" | "16:9"
  /** One-line description for the gallery card */
  description: string
  slots: SlotSpec[]
  /** Canonical filled values for the preview page. Keys match `slots[].key`. */
  sampleData: Record<string, string>
}
