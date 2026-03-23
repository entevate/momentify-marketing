"use client"

import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  GripVertical,
  Check,
  Clock,
  Zap,
} from "lucide-react"
import type { CalendarTask } from "@/lib/gtm/calendar-types"
import { taskCategories, solutionMeta } from "@/lib/gtm/calendar-categories"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface TaskCardProps {
  task: CalendarTask
  variant: "compact" | "full"
  onToggleComplete: (taskId: string) => void
  onClick: (task: CalendarTask) => void
  isDragging?: boolean
}

export default function TaskCard({
  task,
  variant,
  onToggleComplete,
  onClick,
  isDragging = false,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id })

  const category = taskCategories[task.category]
  const solution = solutionMeta[task.solution]

  const transformStyle = CSS.Transform.toString(transform)

  const isCompact = variant === "compact"

  return (
    <div
      ref={setNodeRef}
      style={{
        fontFamily: font,
        background: "var(--gtm-bg-card)",
        border: "1px solid var(--gtm-border)",
        borderRadius: isCompact ? 8 : 12,
        padding: isCompact ? "6px 8px" : "12px 16px",
        display: "flex",
        alignItems: isCompact ? "center" : "flex-start",
        gap: isCompact ? 6 : 10,
        cursor: "pointer",
        opacity: isDragging ? 0.5 : task.completed ? 0.5 : 1,
        transition: "all 200ms ease",
        transform: transformStyle,
        ...(transition ? { transition } : {}),
        boxShadow: isDragging ? "var(--gtm-shadow-hover)" : "var(--gtm-shadow)",
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.boxShadow = "var(--gtm-shadow-hover)"
          e.currentTarget.style.borderColor = "var(--gtm-cyan)"
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = isDragging ? "var(--gtm-shadow-hover)" : "var(--gtm-shadow)"
        e.currentTarget.style.borderColor = "var(--gtm-border)"
      }}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: "grab",
          color: "var(--gtm-text-faint)",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <GripVertical size={isCompact ? 12 : 16} />
      </div>

      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleComplete(task.id)
        }}
        style={{
          width: isCompact ? 16 : 20,
          height: isCompact ? 16 : 20,
          borderRadius: 4,
          border: task.completed
            ? "none"
            : "1.5px solid var(--gtm-border)",
          background: task.completed
            ? "var(--gtm-cyan)"
            : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "all 200ms ease",
          padding: 0,
        }}
        onMouseEnter={(e) => {
          if (!task.completed) {
            e.currentTarget.style.borderColor = "var(--gtm-cyan)"
          }
        }}
        onMouseLeave={(e) => {
          if (!task.completed) {
            e.currentTarget.style.borderColor = "var(--gtm-border)"
          }
        }}
      >
        {task.completed && (
          <Check size={isCompact ? 10 : 14} color="#fff" strokeWidth={3} />
        )}
      </button>

      {/* Content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: isCompact ? "row" : "column",
          alignItems: isCompact ? "center" : "flex-start",
          gap: isCompact ? 6 : 6,
        }}
        onClick={() => onClick(task)}
      >
        {/* Category color dot + title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            minWidth: 0,
            flex: isCompact ? 1 : undefined,
            width: isCompact ? undefined : "100%",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: category?.color ?? "var(--gtm-text-faint)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: isCompact ? 12 : 14,
              fontWeight: 500,
              color: "var(--gtm-text-primary)",
              textDecoration: task.completed ? "line-through" : "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task.title}
          </span>
        </div>

        {/* Solution badge (always shown) */}
        {solution && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: solution.color,
              background: `${solution.color}1F`,
              borderRadius: 100,
              padding: "2px 8px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {solution.label}
          </span>
        )}

        {/* Full variant extras */}
        {!isCompact && (
          <>
            {task.description && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--gtm-text-muted)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {task.description}
              </p>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 2,
                flexWrap: "wrap",
              }}
            >
              {/* Duration chip */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: "var(--gtm-text-muted)",
                  background: "var(--gtm-bg-page)",
                  borderRadius: 100,
                  padding: "2px 8px",
                }}
              >
                <Clock size={10} />
                {task.duration}m
              </span>

              {/* Time slot */}
              {task.timeSlot && (
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--gtm-text-muted)",
                    textTransform: "capitalize",
                  }}
                >
                  {task.timeSlot}
                </span>
              )}

              {/* ROX touchpoint */}
              {task.roxTouchpoint && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    color: "var(--gtm-cyan)",
                    background: "rgba(12, 244, 223, 0.08)",
                    borderRadius: 100,
                    padding: "2px 8px",
                  }}
                >
                  <Zap size={10} />
                  {task.roxTouchpoint}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
