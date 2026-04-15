import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { KV, requireGtmAuth, type CalendarTask } from "@/lib/gtm/content-types"

export async function GET() {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const ids = await kv.smembers(KV.calendarIndex) as string[]
    const tasks: CalendarTask[] = []

    for (const id of ids) {
      const task = await kv.get<CalendarTask>(KV.calendar(id))
      if (task) tasks.push(task)
    }

    tasks.sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date)
      if (dateCmp !== 0) return dateCmp
      return a.sortOrder - b.sortOrder
    })

    return NextResponse.json({ tasks })
  } catch {
    return NextResponse.json({ tasks: [] })
  }
}

export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const task = await request.json() as CalendarTask

    if (!task.id) {
      task.id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    }

    await kv.set(KV.calendar(task.id), task)
    await kv.sadd(KV.calendarIndex, task.id)

    return NextResponse.json({ id: task.id, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}

// PUT: Bulk update (drag-drop reorder)
export async function PUT(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const tasks = await request.json()

    if (!Array.isArray(tasks)) {
      return NextResponse.json({ error: "Expected array of tasks" }, { status: 400 })
    }

    for (const task of tasks as CalendarTask[]) {
      await kv.set(KV.calendar(task.id), task)
      await kv.sadd(KV.calendarIndex, task.id)
    }

    return NextResponse.json({ success: true, count: tasks.length })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to bulk update tasks" },
      { status: 500 }
    )
  }
}
