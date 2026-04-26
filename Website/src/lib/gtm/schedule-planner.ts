/**
 * Schedule planning - shared by the Generate Schedule modal (client) and the
 * cron handler (server). Pure functions: no I/O, no React, no Next.
 *
 * Responsibilities:
 *   - Enumerate target dates in a range (weekdays-only or full 7-day)
 *   - Pick a distribution of posts across those dates based on posts-per-week
 *   - Round-robin assign (pillar × contentType × persona) to each date so the
 *     result has balanced coverage rather than all-one-pillar clustering
 */

export interface PlanInput {
  startDate: string           // ISO date
  endDate: string             // ISO date, inclusive
  postsPerWeek: number        // 1-10
  weekdaysOnly: boolean
  pillars: string[]           // ["experiential","oi","innovation"] (at least 1)
  contentTypes: string[]      // at least 1 content type value
  industry: string
  motion: "direct" | "partner"
  personas: string[]          // at least 1 persona label; "" allowed if user left empty
  additionalContext?: string
}

export interface PlanEntry {
  date: string                // ISO date
  solution: string            // = pillar
  contentType: string
  industry: string
  motion: "direct" | "partner"
  persona: string
  additionalContext?: string
  /** Stable index within the plan; useful for progress UI and dedupe */
  index: number
}

// ─── Date helpers ────────────────────────────────────────────────────────

function parseDate(iso: string): Date {
  // Treat the ISO date as local-midnight so weekday math is consistent
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function isWeekday(d: Date): boolean {
  const dow = d.getDay()
  return dow !== 0 && dow !== 6
}

/** Inclusive list of ISO dates between start and end, optionally weekdays only. */
export function enumerateDates(startDate: string, endDate: string, weekdaysOnly: boolean): string[] {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  if (end < start) return []
  const out: string[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    if (!weekdaysOnly || isWeekday(cursor)) out.push(toIsoDate(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return out
}

/** Count ISO weeks (7-day windows) that overlap the inclusive range. */
export function weeksInRange(startDate: string, endDate: string): number {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  const days = Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
  return Math.max(1, Math.ceil(days / 7))
}

// ─── Plan builder ────────────────────────────────────────────────────────

/**
 * Build the full list of plan entries. Total count =
 *   weeks × postsPerWeek  (capped by available eligible dates).
 * Dates are selected evenly-spaced across the eligible set, so "3 per week"
 * over 4 weeks produces 12 dates roughly evenly separated.
 *
 * (pillar × contentType × persona) is round-robin'd across dates so you get
 * balanced coverage regardless of how many options the user selected.
 */
export function buildSchedulePlan(input: PlanInput): PlanEntry[] {
  const dates = enumerateDates(input.startDate, input.endDate, input.weekdaysOnly)
  if (dates.length === 0) return []

  const weeks = weeksInRange(input.startDate, input.endDate)
  const desired = Math.max(1, input.postsPerWeek * weeks)
  const total = Math.min(desired, dates.length)

  // Pick `total` dates evenly distributed across `dates`
  const pickedDates: string[] = []
  if (total >= dates.length) {
    pickedDates.push(...dates)
  } else {
    const stride = dates.length / total
    for (let i = 0; i < total; i++) {
      const idx = Math.min(dates.length - 1, Math.floor(i * stride))
      pickedDates.push(dates[idx])
    }
  }

  // Normalize choice lists - always at least one entry so round-robin works
  const pillars = input.pillars.length ? input.pillars : ["experiential"]
  const contentTypes = input.contentTypes.length ? input.contentTypes : ["cold-emails"]
  const personas = input.personas.length ? input.personas : [""]

  const entries: PlanEntry[] = pickedDates.map((date, i) => ({
    date,
    solution: pillars[i % pillars.length],
    contentType: contentTypes[i % contentTypes.length],
    industry: input.industry,
    motion: input.motion,
    persona: personas[i % personas.length],
    additionalContext: input.additionalContext,
    index: i,
  }))

  return entries
}

// ─── Content-type → calendar category mapping ───────────────────────────
// Calendar task categories partially overlap with Content Builder content
// types, but there are a few legacy categories (`cold-email` singular etc.)
// used by the hand-coded default tasks. This helper maps new generations into
// the calendar-category taxonomy without renaming existing categories.

export function contentTypeToCategory(contentType: string): string {
  const map: Record<string, string> = {
    "cold-emails": "cold-email",          // legacy singular
    "linkedin-dm": "linkedin-post",
    "social-post": "social-post",
    "carousel": "carousel",
    "lead-magnet": "lead-magnet",
    "discovery-script": "discovery-call",
    "partner-pitch": "partner-outreach",
    "battle-card": "content-creation",
    "microsite": "microsite",
    "infographic": "infographic",
    "one-pager": "one-pager",
    "pitch-deck": "pitch-deck",
  }
  return map[contentType] || "content-creation"
}

// ─── Next-Sunday helper for recurring schedules ─────────────────────────

/**
 * Returns the ISO date of the next Sunday strictly after `from` (defaults to
 * today). Used to set `nextRunOn` when a RecurringSchedule is created.
 */
export function nextSundayOn(from?: Date): string {
  const d = from ? new Date(from) : new Date()
  d.setHours(0, 0, 0, 0)
  const dow = d.getDay() // 0 = Sun
  const daysUntil = dow === 0 ? 7 : 7 - dow
  d.setDate(d.getDate() + daysUntil)
  return toIsoDate(d)
}

/**
 * Given the date of a recurring schedule's Sunday firing, return the ISO
 * dates of the upcoming week's Mon-Fri (or Mon-Sun when weekdaysOnly=false).
 */
export function upcomingWeekDates(sundayDate: string, weekdaysOnly: boolean): string[] {
  const sun = parseDate(sundayDate)
  const start = new Date(sun)
  start.setDate(start.getDate() + 1) // Monday
  const end = new Date(sun)
  end.setDate(end.getDate() + (weekdaysOnly ? 5 : 7)) // Fri or following Sun
  return enumerateDates(toIsoDate(start), toIsoDate(end), weekdaysOnly)
}
