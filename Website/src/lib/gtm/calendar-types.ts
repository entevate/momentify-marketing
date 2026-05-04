export type SolutionId = "trade-shows" | "recruiting" | "field-sales" | "facilities" | "events-venues"

export type TaskCategory =
  | "linkedin-post"
  | "social-post"
  | "cold-email"
  | "lead-magnet"
  | "discovery-call"
  | "partner-outreach"
  | "content-creation"
  | "internal-review"
  | "follow-up"
  | "event-prep"

export interface CalendarTask {
  id: string
  title: string
  category: TaskCategory
  solution: SolutionId
  date: string  // ISO date "2026-03-24"
  timeSlot?: "morning" | "afternoon"
  duration: number  // minutes
  completed: boolean
  description?: string
  sortOrder: number
  roxTouchpoint?: string  // which ROX dimension this supports
  // Linkage to the saved Library item this task was scheduled from.
  // When present, TaskDetailModal can render the rendered asset preview
  // (e.g. social-post HTML) inline.
  libraryItemId?: string
  // Optional render hint — usually "social-post" for inline iframe preview.
  // Other content types (cold-email, lead-magnet, etc.) only show metadata.
  assetType?: string
  // Optional context fields surfaced from the Library brief.
  industry?: string
  motion?: string
  // Linkage to an EmailDraft when this task represents a scheduled send.
  // Set on tasks created via /api/gtm/email/drafts/[id]/schedule. When
  // present, TaskDetailModal renders the email preview + Send Now button
  // and (if the draft has autoSend === true) the cron will fire it on
  // its scheduled date.
  emailDraftId?: string
}

export interface TaskCategoryMeta {
  key: TaskCategory
  label: string
  iconName: string  // lucide icon name reference
  color: string
  bgLight: string  // rgba for light mode bg
  bgDark: string   // rgba for dark mode bg
}

export interface JourneyStage {
  id: string
  label: string
  description: string
  touchpoints: string[]
  roxDimension?: string
  icon: string
}
