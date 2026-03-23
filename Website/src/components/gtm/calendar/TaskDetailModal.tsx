"use client"

import React, { useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  X,
  Check,
  Clock,
  Zap,
  Linkedin,
  Share2,
  Mail,
  BookOpen,
  Phone,
  Handshake,
  FileText,
  ClipboardCheck,
  Reply,
  CalendarCheck,
} from "lucide-react"
import type { CalendarTask } from "@/lib/gtm/calendar-types"
import { taskCategories, solutionMeta } from "@/lib/gtm/calendar-categories"

const font = "'Inter', system-ui, -apple-system, sans-serif"

// Map icon names to components
const iconMap: Record<string, React.ElementType> = {
  Linkedin,
  Share2,
  Mail,
  BookOpen,
  Phone,
  Handshake,
  FileText,
  ClipboardCheck,
  Reply,
  CalendarCheck,
}

interface TaskDetailModalProps {
  task: CalendarTask | null
  onClose: () => void
  onToggleComplete: (taskId: string) => void
}

export default function TaskDetailModal({
  task,
  onClose,
  onToggleComplete,
}: TaskDetailModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (task) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [task, handleKeyDown])

  if (!task) return null

  const category = taskCategories[task.category]
  const solution = solutionMeta[task.solution]
  const CategoryIcon = category ? iconMap[category.iconName] : null

  return (
    <AnimatePresence>
      {task && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: font,
              maxWidth: 480,
              width: "100%",
              background: "var(--gtm-bg-card)",
              border: "1px solid var(--gtm-border)",
              borderRadius: 16,
              padding: 32,
              position: "relative",
              boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--gtm-text-muted)",
                padding: 4,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--gtm-text-primary)"
                e.currentTarget.style.background = "rgba(255,255,255,0.05)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--gtm-text-muted)"
                e.currentTarget.style.background = "transparent"
              }}
            >
              <X size={18} />
            </button>

            {/* Category icon + label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {CategoryIcon && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: category ? `${category.color}1F` : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CategoryIcon size={14} color={category?.color} />
                </div>
              )}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: category?.color ?? "var(--gtm-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {category?.label}
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--gtm-text-primary)",
                margin: "0 0 8px 0",
                textDecoration: task.completed ? "line-through" : "none",
                opacity: task.completed ? 0.5 : 1,
                lineHeight: 1.3,
              }}
            >
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--gtm-text-muted)",
                  margin: "0 0 16px 0",
                  lineHeight: 1.5,
                }}
              >
                {task.description}
              </p>
            )}

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {/* Solution badge */}
              {solution && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: solution.color,
                    background: `${solution.color}1F`,
                    borderRadius: 100,
                    padding: "4px 12px",
                  }}
                >
                  {solution.label}
                </span>
              )}

              {/* Duration */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: "var(--gtm-text-muted)",
                  background: "var(--gtm-bg-page)",
                  borderRadius: 100,
                  padding: "4px 12px",
                }}
              >
                <Clock size={12} />
                {task.duration} min
              </span>

              {/* Time slot */}
              {task.timeSlot && (
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--gtm-text-muted)",
                    background: "var(--gtm-bg-page)",
                    borderRadius: 100,
                    padding: "4px 12px",
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
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--gtm-cyan)",
                    background: "rgba(12, 244, 223, 0.08)",
                    borderRadius: 100,
                    padding: "4px 12px",
                  }}
                >
                  <Zap size={12} />
                  {task.roxTouchpoint}
                </span>
              )}
            </div>

            {/* Completion toggle */}
            <button
              onClick={() => onToggleComplete(task.id)}
              style={{
                fontFamily: font,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                color: task.completed ? "var(--gtm-text-muted)" : "#fff",
                background: task.completed
                  ? "transparent"
                  : "var(--gtm-cyan)",
                border: task.completed
                  ? "1px solid var(--gtm-border)"
                  : "none",
                borderRadius: 10,
                padding: "10px 20px",
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1"
              }}
            >
              <Check size={16} />
              {task.completed ? "Mark incomplete" : "Mark complete"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
