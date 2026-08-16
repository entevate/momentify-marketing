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
