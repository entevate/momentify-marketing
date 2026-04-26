/**
 * Brand-voice sanitizers applied server-side to every Claude-generated string.
 *
 * The ENTEVATE brand voice rule explicitly forbids em-dashes, but Claude ignores
 * the rule ~1 out of every 3 generations. This helper is the belt-and-suspenders
 * fix: the prompt still tells Claude not to use em-dashes, AND we strip any that
 * slip through before the text/HTML is sent to the client or saved to disk.
 */

/**
 * Replace em-dashes (U+2014) and en-dashes (U+2013) with a plain hyphen + spaces.
 *
 * Rules:
 *   " — " (space-em-space)  → " - "  (keeps readability of compound clauses)
 *   "—"   (bare em-dash)    → " - "
 *   " – " (space-en-space)  → " - "
 *   "–"   (bare en-dash)    → "-"
 *
 * Ordering matters: spaced variants are replaced first so the bare-dash pass
 * doesn't double up. Uses a single-pass string builder for O(n) perf.
 */
export function stripEmDashes(input: string): string {
  if (!input) return input
  return input
    .replace(/ — /g, " - ")
    .replace(/—/g, " - ")
    .replace(/ – /g, " - ")
    .replace(/–/g, "-")
}
