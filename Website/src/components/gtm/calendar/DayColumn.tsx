"use client"

import React, { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { CalendarTask } from "@/lib/gtm/calendar-types"
import TaskCard from "./TaskCard"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface DayColumnProps {
  date: string
  tasks: CalendarTask[]
  isToday: boolean
  isWeekend: boolean
  onToggleComplete: (taskId: string) => void
  onTaskClick: (task: CalendarTask) => void
  onDeleteTask?: (taskId: string) => void
}

export default function DayColumn({
  date,
  tasks,
  isToday,
  isWeekend,
  onToggleComplete,
  onTaskClick,
  onDeleteTask,
}: DayColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: date })
  const [hovered, setHovered] = useState(false)

  const dayNumber = new Date(date + "T00:00:00").getDate()
  const visibleTasks = isWeekend ? [] : tasks.slice(0, 3)
  const overflowCount = isWeekend ? 0 : Math.max(0, tasks.length - 3)

  return (
    <div
      ref={setNodeRef}
      style={{
        fontFamily: font,
        background: isOver
          ? "rgba(12, 244, 223, 0.04)"
          : hovered
            ? "rgba(255,255,255,0.02)"
            : "transparent",
        border: "1px solid var(--gtm-border)",
        borderLeft: isToday ? "2px solid var(--gtm-cyan)" : "1px solid var(--gtm-border)",
        borderRadius: 8,
        padding: 8,
        minHeight: 120,
        opacity: isWeekend ? 0.4 : 1,
        transition: "all 200ms ease",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Date number */}
      <span
        style={{
          fontSize: 12,
          fontWeight: isToday ? 700 : 400,
          color: isToday ? "var(--gtm-cyan)" : "var(--gtm-text-muted)",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {dayNumber}
      </span>

      {/* Task cards */}
      <SortableContext items={visibleTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              variant="compact"
              onToggleComplete={onToggleComplete}
              onClick={onTaskClick}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      </SortableContext>

      {/* Overflow indicator */}
      {overflowCount > 0 && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--gtm-text-muted)",
            textAlign: "center",
            padding: "2px 0",
          }}
        >
          +{overflowCount} more
        </span>
      )}
    </div>
  )
}
