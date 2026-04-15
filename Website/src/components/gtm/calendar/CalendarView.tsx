"use client"

import React from "react"
import type { CalendarTask } from "@/lib/gtm/calendar-types"
import DayColumn from "./DayColumn"

const font = "'Inter', system-ui, -apple-system, sans-serif"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

interface CalendarViewProps {
  tasks: CalendarTask[]
  currentMonth: Date
  onToggleComplete: (taskId: string) => void
  onTaskClick: (task: CalendarTask) => void
  onDeleteTask?: (taskId: string) => void
}

function getCalendarDays(month: Date): string[] {
  const year = month.getFullYear()
  const m = month.getMonth()

  const firstDay = new Date(year, m, 1)
  const lastDay = new Date(year, m + 1, 0)

  // getDay() returns 0=Sun. Convert to Mon=0 based.
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days: string[] = []

  // Pad start
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, m, -i)
    days.push(d.toISOString().split("T")[0])
  }

  // Month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, m, i)
    days.push(d.toISOString().split("T")[0])
  }

  // Pad end to fill complete weeks
  while (days.length % 7 !== 0) {
    const lastDate = new Date(days[days.length - 1])
    lastDate.setDate(lastDate.getDate() + 1)
    days.push(lastDate.toISOString().split("T")[0])
  }

  return days
}

function isWeekendDate(dateStr: string): boolean {
  const d = new Date(dateStr + "T00:00:00")
  const dow = d.getDay()
  return dow === 0 || dow === 6
}

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0]
}

export default function CalendarView({
  tasks,
  currentMonth,
  onToggleComplete,
  onTaskClick,
  onDeleteTask,
}: CalendarViewProps) {
  const days = getCalendarDays(currentMonth)
  const todayISO = getTodayISO()

  const tasksByDate: Record<string, CalendarTask[]> = {}
  for (const task of tasks) {
    if (!tasksByDate[task.date]) tasksByDate[task.date] = []
    tasksByDate[task.date].push(task)
  }

  return (
    <div style={{ fontFamily: font }}>
      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
          marginBottom: 4,
        }}
      >
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--gtm-text-muted)",
              textAlign: "center",
              padding: "4px 0",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Grid of day cells */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
        }}
      >
        {days.map((date) => (
          <DayColumn
            key={date}
            date={date}
            tasks={(tasksByDate[date] ?? []).sort((a, b) => a.sortOrder - b.sortOrder)}
            isToday={date === todayISO}
            isWeekend={isWeekendDate(date)}
            onToggleComplete={onToggleComplete}
            onTaskClick={onTaskClick}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  )
}
