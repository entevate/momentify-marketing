import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { KV, requireGtmAuth, type RecurringSchedule } from "@/lib/gtm/content-types"
import { nextSundayOn } from "@/lib/gtm/schedule-planner"

/**
 * GET  /api/gtm/recurring  - list all recurring schedules
 * POST /api/gtm/recurring  - create a new recurring schedule
 *
 * Both paths are auth-gated via the shared gtm_auth cookie.
 */

export async function GET() {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const ids = (await kv.smembers(KV.recurringIndex)) as string[] | null
    if (!ids || ids.length === 0) {
      return NextResponse.json({ schedules: [] })
    }
    const records = await Promise.all(
      ids.map((id) => kv.get<RecurringSchedule>(KV.recurring(id)))
    )
    const schedules = records
      .filter((r): r is RecurringSchedule => !!r)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    return NextResponse.json({ schedules })
  } catch (error) {
    console.error("[recurring GET] error", error)
    return NextResponse.json({ schedules: [], error: "KV unavailable" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = (await request.json()) as Partial<RecurringSchedule>
    if (!Array.isArray(body.pillars) || body.pillars.length === 0) {
      return NextResponse.json({ error: "pillars required" }, { status: 400 })
    }
    if (!Array.isArray(body.contentTypes) || body.contentTypes.length === 0) {
      return NextResponse.json({ error: "contentTypes required" }, { status: 400 })
    }

    const id = `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const record: RecurringSchedule = {
      id,
      createdAt: new Date().toISOString(),
      nextRunOn: body.nextRunOn || nextSundayOn(),
      enabled: body.enabled !== false,
      pillars: body.pillars,
      contentTypes: body.contentTypes,
      industry: body.industry || "general",
      motion: body.motion === "partner" ? "partner" : "direct",
      personas: Array.isArray(body.personas) ? body.personas : [],
      additionalContext: body.additionalContext,
      postsPerWeek: typeof body.postsPerWeek === "number" ? body.postsPerWeek : 3,
      weekdaysOnly: body.weekdaysOnly !== false,
    }

    await kv.set(KV.recurring(id), record)
    await kv.sadd(KV.recurringIndex, id)
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error("[recurring POST] error", error)
    return NextResponse.json({ error: "Failed to create recurring schedule" }, { status: 500 })
  }
}
