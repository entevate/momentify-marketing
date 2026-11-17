import { cookies } from "next/headers"
import { verifyGtmAuthToken } from "./auth-token"

export { type CalendarTask, type SolutionId, type TaskCategory } from "./calendar-types"

export interface ContentItem {
  id: string
  contentType: string
  platform?: "linkedin" | "twitter" | "instagram"
  motion: "direct" | "partner"
  solution: string
  content: string
  persona?: string            // promoted from a smuggled tags[] entry
  graphic?: string            // base64 data URL for inline graphics (legacy, unused)
  blobUrl?: string            // rendered graphic URL — the piece self-carries its graphic
  assetType?: string          // graphic kind (social-post, carousel, …); drives AssetPanel + preview
  templateId?: string         // which template produced the graphic
  kept?: boolean              // Library membership. true → shows in Library. Absent/false → History only.
  createdAt: string
  tags: string[]
}

export interface MicrositeRecord {
  slug: string
  title: string
  description?: string
  solution: string
  blobUrl: string
  contentId?: string
  publishedAt: string
}

export interface RecurringSchedule {
  id: string
  createdAt: string
  lastRunAt?: string
  nextRunOn: string
  enabled: boolean
  pillars: string[]
  contentTypes: string[]
  industry: string
  motion: "direct" | "partner"
  personas: string[]
  additionalContext?: string
  postsPerWeek: number
  weekdaysOnly: boolean
}

// KV key helpers
export const KV = {
  content: (id: string) => `gtm:content:${id}`,
  contentIndex: "gtm:content:index",
  calendar: (id: string) => `gtm:calendar:${id}`,
  calendarIndex: "gtm:calendar:index",
  microsite: (slug: string) => `gtm:microsite:${slug}`,
  micrositeIndex: "gtm:microsite:index",
  recurring: (id: string) => `gtm:recurring:${id}`,
  recurringIndex: "gtm:recurring:index",
} as const

// Auth check for API routes: validates the signed gtm_auth cookie (HMAC keyed by
// GTM_PASSWORD). The old check compared against the literal "true", which any
// visitor could forge; verifyGtmAuthToken requires the password to have produced
// the value. Kept cookie-based (httpOnly, server-set) on purpose — see auth-token.ts.
export async function requireGtmAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  return verifyGtmAuthToken(cookieStore.get("gtm_auth")?.value)
}

export type ThinkingOff = { type: "disabled" } | { type: "between_tools" }

/**
 * The `thinking` value that turns extended thinking off for `model`, or
 * `undefined` when the model has no off switch (omit the field: JSON.stringify
 * drops it). Use as `thinking: thinkingOff(model)` at every call site, so a
 * model bump is one edit here instead of six routes.
 *
 * The API rejects the wrong shape with a 400, so every row below was checked
 * against the live API (2026-10-01). Models not listed get `undefined`, the
 * one shape every model accepted. The unit test pins this table.
 */
export function thinkingOff(model: string): ThinkingOff | undefined {
  // Sonnet 5.5 400s on "disabled"; "between_tools" is its off switch.
  if (/^claude-sonnet-5-5$/.test(model)) return { type: "between_tools" }
  // Accept "disabled". Dated snapshots (-YYYYMMDD) are the same model.
  if (
    /^claude-(?:sonnet-5|sonnet-4-[56]|haiku-4-5|opus-4-[678]|opus-5)(?:-\d{8})?$/.test(model)
  ) {
    return { type: "disabled" }
  }
  // Opus 5.5 and Fable 5/5.1 400 on both "disabled" and "between_tools": thinking
  // can't be turned off there. Anything unverified falls through to the same.
  return undefined
}
