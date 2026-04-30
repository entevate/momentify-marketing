"use client"

import React, { useEffect, useCallback, useState } from "react"
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
  Pencil,
  Trash2,
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
  onEditTask?: (task: CalendarTask) => void
  onDeleteTask?: (taskId: string) => void
}

export default function TaskDetailModal({
  task,
  onClose,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}: TaskDetailModalProps) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editDate, setEditDate] = useState("")
  const [editTimeSlot, setEditTimeSlot] = useState<"morning" | "afternoon">("morning")
  const [editDuration, setEditDuration] = useState(30)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Reset edit state when task changes
  useEffect(() => {
    if (task) {
      setEditTitle(task.title)
      setEditDescription(task.description || "")
      setEditDate(task.date)
      setEditTimeSlot(task.timeSlot || "morning")
      setEditDuration(task.duration)
      setEditing(false)
      setConfirmDelete(false)
    }
  }, [task])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editing) {
          setEditing(false)
        } else {
          onClose()
        }
      }
    },
    [onClose, editing]
  )

  useEffect(() => {
    if (task) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [task, handleKeyDown])

  const handleSaveEdit = useCallback(() => {
    if (!task || !onEditTask) return
    onEditTask({
      ...task,
      title: editTitle,
      description: editDescription,
      date: editDate,
      timeSlot: editTimeSlot,
      duration: editDuration,
    })
    setEditing(false)
  }, [task, onEditTask, editTitle, editDescription, editDate, editTimeSlot, editDuration])

  const handleDelete = useCallback(() => {
    if (!task || !onDeleteTask) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDeleteTask(task.id)
    onClose()
  }, [task, onDeleteTask, confirmDelete, onClose])

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
            {/* Action buttons: Edit, Delete, Close */}
            <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 4 }}>
              {onEditTask && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  title="Edit task"
                  style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    color: "var(--gtm-text-muted)", padding: 4, borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gtm-text-primary)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--gtm-text-muted)"; e.currentTarget.style.background = "transparent" }}
                >
                  <Pencil size={16} />
                </button>
              )}
              {onDeleteTask && (
                <button
                  onClick={handleDelete}
                  title={confirmDelete ? "Click again to confirm" : "Delete task"}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    color: confirmDelete ? "#ef4444" : "var(--gtm-text-muted)", padding: 4, borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => { if (!confirmDelete) { e.currentTarget.style.color = "#ef4444" } }}
                  onMouseLeave={(e) => { if (!confirmDelete) { e.currentTarget.style.color = "var(--gtm-text-muted)"; setConfirmDelete(false) } }}
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "var(--gtm-text-muted)", padding: 4, borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gtm-text-primary)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--gtm-text-muted)"; e.currentTarget.style.background = "transparent" }}
              >
                <X size={18} />
              </button>
            </div>

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

            {editing ? (
              /* Edit mode */
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    fontSize: 16, fontWeight: 600, color: "var(--gtm-text-primary)",
                    fontFamily: font, background: "var(--gtm-bg-page)",
                    border: "1px solid var(--gtm-border)", borderRadius: 8,
                    padding: "8px 12px", outline: "none",
                  }}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  placeholder="Description..."
                  style={{
                    fontSize: 13, color: "var(--gtm-text-muted)",
                    fontFamily: font, background: "var(--gtm-bg-page)",
                    border: "1px solid var(--gtm-border)", borderRadius: 8,
                    padding: "8px 12px", outline: "none", resize: "vertical",
                  }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    style={{
                      flex: 1, fontSize: 13, fontFamily: font,
                      background: "var(--gtm-bg-page)", border: "1px solid var(--gtm-border)",
                      borderRadius: 8, padding: "6px 10px", color: "var(--gtm-text-primary)",
                    }}
                  />
                  <select
                    value={editTimeSlot}
                    onChange={(e) => setEditTimeSlot(e.target.value as "morning" | "afternoon")}
                    style={{
                      fontSize: 13, fontFamily: font, background: "var(--gtm-bg-page)",
                      border: "1px solid var(--gtm-border)", borderRadius: 8,
                      padding: "6px 10px", color: "var(--gtm-text-primary)",
                    }}
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                  </select>
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) => setEditDuration(parseInt(e.target.value, 10) || 15)}
                    min={15}
                    max={480}
                    step={15}
                    style={{
                      width: 70, fontSize: 13, fontFamily: font,
                      background: "var(--gtm-bg-page)", border: "1px solid var(--gtm-border)",
                      borderRadius: 8, padding: "6px 10px", color: "var(--gtm-text-primary)",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button
                    onClick={handleSaveEdit}
                    style={{
                      flex: 1, fontFamily: font, display: "flex", alignItems: "center",
                      justifyContent: "center", gap: 6, fontSize: 13, fontWeight: 600,
                      color: "#fff", background: "var(--gtm-cyan)", border: "none",
                      borderRadius: 10, padding: "10px 20px", cursor: "pointer",
                      transition: "all 200ms ease",
                    }}
                  >
                    <Check size={16} /> Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    style={{
                      fontFamily: font, fontSize: 13, fontWeight: 600,
                      color: "var(--gtm-text-muted)", background: "transparent",
                      border: "1px solid var(--gtm-border)", borderRadius: 10,
                      padding: "10px 20px", cursor: "pointer",
                      transition: "all 200ms ease",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View mode */
              <>
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

                {/* Asset preview — renders for tasks linked to a Library item
                    that has a rendered HTML asset. Storage is namespaced by
                    assetType: social-post stores the rendered template,
                    carousel stores the swipeable shell HTML (which embeds 6
                    rendered cards via iframe). The iframe URL forwards the
                    task's assetType so each one resolves under its own
                    namespace via /api/gtm/asset-preview. */}
                {task.libraryItemId && (task.assetType === "social-post" || task.assetType === "carousel") && (
                  <div
                    style={{
                      marginBottom: 20,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid var(--gtm-border)",
                      background: "var(--gtm-bg-page)",
                      aspectRatio: "1 / 1",
                      width: "100%",
                    }}
                  >
                    <iframe
                      title="Scheduled asset preview"
                      src={`/api/gtm/asset-preview?solution=${encodeURIComponent(task.solution)}&assetType=${encodeURIComponent(task.assetType)}&itemId=${encodeURIComponent(task.libraryItemId)}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        display: "block",
                      }}
                      sandbox="allow-scripts"
                    />
                  </div>
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
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
