"use client"

import React from "react"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { CalendarTask } from "@/lib/gtm/calendar-types"
import TaskCard from "./TaskCard"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface ListViewProps {
  tasks: CalendarTask[]
  onToggleComplete: (taskId: string) => void
  onTaskClick: (task: CalendarTask) => void
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function groupByDate(tasks: CalendarTask[]): Record<string, CalendarTask[]> {
  const groups: Record<string, CalendarTask[]> = {}
  for (const task of tasks) {
    if (!groups[task.date]) groups[task.date] = []
    groups[task.date].push(task)
  }
  return groups
}

export default function ListView({
  tasks,
  onToggleComplete,
  onTaskClick,
}: ListViewProps) {
  const grouped = groupByDate(tasks)
  const sortedDates = Object.keys(grouped).sort()

  if (sortedDates.length === 0) {
    return (
      <div
        style={{
          fontFamily: font,
          textAlign: "center",
          padding: "48px 0",
          color: "var(--gtm-text-muted)",
          fontSize: 14,
        }}
      >
        No tasks scheduled
      </div>
    )
  }

  return (
    <div style={{ fontFamily: font, display: "flex", flexDirection: "column", gap: 24 }}>
      {sortedDates.map((date) => {
        const dateTasks = grouped[date].sort((a, b) => a.sortOrder - b.sortOrder)

        return (
          <div key={date}>
            {/* Date header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--gtm-text-primary)",
                }}
              >
                {formatDateHeader(date)}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--gtm-text-muted)",
                  background: "var(--gtm-bg-page)",
                  border: "1px solid var(--gtm-border)",
                  borderRadius: 100,
                  padding: "2px 8px",
                }}
              >
                {dateTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <SortableContext items={dateTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {dateTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    variant="full"
                    onToggleComplete={onToggleComplete}
                    onClick={onTaskClick}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        )
      })}
    </div>
  )
}
