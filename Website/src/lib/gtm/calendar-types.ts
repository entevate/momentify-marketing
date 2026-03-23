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
