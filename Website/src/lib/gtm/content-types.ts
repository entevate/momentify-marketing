import { cookies } from "next/headers"

export { type CalendarTask, type SolutionId, type TaskCategory } from "./calendar-types"

export interface ContentItem {
  id: string
  contentType: string
  platform?: "linkedin" | "twitter" | "instagram"
  motion: "direct" | "partner"
  solution: string
  content: string
  graphic?: string            // base64 data URL for inline graphics
  blobUrl?: string            // Vercel Blob URL for attached files
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

// Auth check for API routes (reads gtm_auth cookie)
export async function requireGtmAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get("gtm_auth")?.value === "true"
}
