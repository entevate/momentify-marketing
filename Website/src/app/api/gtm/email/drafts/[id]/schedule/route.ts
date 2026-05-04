import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { getDraft, saveDraft } from "@/lib/gtm/email-store"
import { kv } from "@/lib/gtm/kv-store"
import { KV, type CalendarTask } from "@/lib/gtm/content-types"

/**
 * POST /api/gtm/email/drafts/[id]/schedule
 *
 * Body: { date: "2026-05-15", timeSlot?: "morning" | "afternoon", autoSend?: boolean }
 *
 * Creates a CalendarTask for the scheduled send and links it to the
 * draft bidirectionally. If autoSend === true, the cron at
 * /api/gtm/email/cron/dispatch will fire the send when scheduledFor is
 * reached. Otherwise the user fires manually from the calendar task.
 */
export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await ctx.params
  const draft = await getDraft(id)
  if (!draft) return NextResponse.json({ error: "Draft not found" }, { status: 404 })
  if (draft.status === "sent") {
    return NextResponse.json({ error: "Draft has already been sent" }, { status: 400 })
  }

  const body = await request.json().catch(() => ({}))
  const date: string | undefined = body.date
  const timeSlot: "morning" | "afternoon" | undefined =
    body.timeSlot === "morning" || body.timeSlot === "afternoon" ? body.timeSlot : undefined
  const autoSend = !!body.autoSend

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 })
  }

  // Build scheduledFor as 09:00 UTC on the chosen date when autoSend is
  // true (matches the cron schedule). For manual scheduling, the time
  // doesn't matter materially - we just store noon UTC for ordering.
  const hour = autoSend ? "09" : "12"
  const scheduledFor = `${date}T${hour}:00:00.000Z`

  // Create the calendar task.
  const taskId = `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const task: CalendarTask = {
    id: taskId,
    title: draft.subject || "Email send",
    category: "cold-email",
    solution: (draft.solution as CalendarTask["solution"]) || "trade-shows",
    date,
    timeSlot,
    duration: 30,
    completed: false,
    description: `Email send: ${draft.subject || "(no subject)"}\n${draft.recipients.length} recipient group(s)`,
    sortOrder: Date.now(),
    motion: draft.motion,
    assetType: "email",
    emailDraftId: draft.id,
  }
  await kv.set(KV.calendar(task.id), task)
  await kv.sadd(KV.calendarIndex, task.id)

  // Link the draft back to the task and flip status.
  draft.status = "scheduled"
  draft.scheduledFor = scheduledFor
  draft.autoSend = autoSend
  draft.calendarTaskId = task.id
  const saved = await saveDraft(draft)

  return NextResponse.json({ draft: saved, task })
}
