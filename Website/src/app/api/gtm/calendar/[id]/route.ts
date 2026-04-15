import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { KV, requireGtmAuth, type CalendarTask } from "@/lib/gtm/content-types"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    const updates = await request.json() as Partial<CalendarTask>
    const existing = await kv.get<CalendarTask>(KV.calendar(id))

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const updated = { ...existing, ...updates, id }
    await kv.set(KV.calendar(id), updated)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    await kv.del(KV.calendar(id))
    await kv.srem(KV.calendarIndex, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}
