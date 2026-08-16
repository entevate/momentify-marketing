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
import type { ContentItem } from "@/lib/gtm/content-types"
import { taskCategories, solutionMeta } from "@/lib/gtm/calendar-categories"
import AssetPanel from "../AssetPanel"
import { dispatchLibraryChanged } from "../tabs/SolutionTabs"
import { assetTypeForContentType } from "@/lib/gtm/asset-type-map"
import { isVisualContentType } from "@/lib/gtm/visual-content"

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

  // Linked Library item editor state (only active when task.libraryItemId is set).
  // Loads the ContentItem this calendar piece was scheduled from so its brief can
  // be edited (PUT), its graphic rendered on demand (AssetPanel), and its Library
  // membership toggled (kept).
  const [linkedItem, setLinkedItem] = useState<ContentItem | null>(null)
  const [briefText, setBriefText] = useState<string>("")
  const [briefLoading, setBriefLoading] = useState(false)
  const [briefSaving, setBriefSaving] = useState(false)
  const [briefSaved, setBriefSaved] = useState(false)
  const [keepSaving, setKeepSaving] = useState(false)

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
      setBriefSaved(false)
    }
  }, [task])

  // Load the linked ContentItem when a library-linked task opens (or the link
  // changes). GET /api/gtm/content/{id} returns the raw ContentItem, so
  // item.content is read directly.
  useEffect(() => {
    if (!task?.libraryItemId) {
      setLinkedItem(null)
      setBriefText("")
      return
    }
    let cancelled = false
    setBriefLoading(true)
    fetch(`/api/gtm/content/${encodeURIComponent(task.libraryItemId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((item: ContentItem | null) => {
        if (cancelled || !item) return
        setLinkedItem(item)
        setBriefText(item.content || "")
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setBriefLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [task?.libraryItemId])

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

  // Persist the edited brief on the linked ContentItem, then fire the
  // library-changed event so Library/History views refresh.
  const handleSaveBrief = useCallback(async () => {
    if (!task?.libraryItemId) return
    setBriefSaving(true)
    setBriefSaved(false)
    try {
      const res = await fetch(`/api/gtm/content/${encodeURIComponent(task.libraryItemId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: briefText }),
      })
      if (res.ok) {
        setLinkedItem((prev) => (prev ? { ...prev, content: briefText } : prev))
        dispatchLibraryChanged(task.solution)
        setBriefSaved(true)
        setTimeout(() => setBriefSaved(false), 2000)
      }
    } finally {
      setBriefSaving(false)
    }
  }, [task, briefText])

  // Toggle Library membership (kept) on the linked ContentItem.
  const handleToggleKeep = useCallback(async () => {
    if (!task?.libraryItemId || !linkedItem) return
    const next = !linkedItem.kept
    setKeepSaving(true)
    try {
      const res = await fetch(`/api/gtm/content/${encodeURIComponent(task.libraryItemId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kept: next }),
      })
      if (res.ok) {
        setLinkedItem((prev) => (prev ? { ...prev, kept: next } : prev))
        dispatchLibraryChanged(task.solution)
      }
    } finally {
      setKeepSaving(false)
    }
  }, [task, linkedItem])

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
              maxWidth: task.libraryItemId ? 760 : 480,
              width: "100%",
              ...(task.libraryItemId ? { maxHeight: "90vh", overflowY: "auto" as const } : {}),
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
                    namespace via /api/gtm/asset-preview.

                    NOTE: suppressed for library-linked tasks — the interactive
                    AssetPanel below is the canonical (and non-stale) surface for
                    those. This static preview only serves non-library tasks. */}
                {!task.libraryItemId && (task.assetType === "social-post" || task.assetType === "carousel") && (
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
                      src={`/api/gtm/asset-preview?solution=${encodeURIComponent(task.solution)}&assetType=${encodeURIComponent(task.assetType)}&itemId=${encodeURIComponent(task.libraryItemId || "")}`}
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

                {/* Email task preview - renders when this calendar task
                    represents a scheduled email send (assetType: "email",
                    emailDraftId set). Pulls the draft, shows subject +
                    recipient summary + a Send Now button that POSTs to
                    /api/gtm/email/drafts/[id]/send. */}
                {task.assetType === "email" && task.emailDraftId && (
                  <EmailDraftPanel draftId={task.emailDraftId} taskId={task.id} />
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

                {/* Linked Library piece — editable brief, on-demand graphic, and
                    Library membership toggle. Only shown when this calendar task
                    was scheduled from a saved Library item. */}
                {task.libraryItemId && (
                  <div
                    style={{
                      marginTop: 24,
                      paddingTop: 20,
                      borderTop: "1px solid var(--gtm-border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--gtm-text-faint)",
                          }}
                        >
                          Linked Library Brief
                        </div>
                        {linkedItem && (
                          <button
                            onClick={handleToggleKeep}
                            disabled={keepSaving}
                            style={{
                              fontFamily: font,
                              fontSize: 11,
                              fontWeight: 600,
                              color: linkedItem.kept ? "var(--gtm-text-muted)" : "#00BBA5",
                              background: "transparent",
                              border: "1px solid var(--gtm-border)",
                              borderRadius: 8,
                              padding: "6px 12px",
                              cursor: keepSaving ? "not-allowed" : "pointer",
                              opacity: keepSaving ? 0.6 : 1,
                            }}
                          >
                            {keepSaving
                              ? "Saving..."
                              : linkedItem.kept
                                ? "Remove from Library"
                                : "Keep in Library"}
                          </button>
                        )}
                      </div>

                      {briefLoading ? (
                        <div style={{ fontSize: 13, color: "var(--gtm-text-muted)" }}>Loading brief...</div>
                      ) : (
                        <>
                          <textarea
                            value={briefText}
                            onChange={(e) => setBriefText(e.target.value)}
                            rows={10}
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                              fontSize: 13,
                              fontFamily: font,
                              lineHeight: 1.55,
                              color: "var(--gtm-text-primary)",
                              background: "var(--gtm-bg-page)",
                              border: "1px solid var(--gtm-border)",
                              borderRadius: 8,
                              padding: "10px 12px",
                              outline: "none",
                              resize: "vertical",
                              minHeight: 160,
                            }}
                          />
                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                            <button
                              onClick={handleSaveBrief}
                              disabled={briefSaving}
                              style={{
                                fontFamily: font,
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#fff",
                                background: briefSaving ? "var(--gtm-text-faint)" : "#00BBA5",
                                border: "none",
                                borderRadius: 8,
                                padding: "8px 16px",
                                cursor: briefSaving ? "not-allowed" : "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              {briefSaving ? (
                                "Saving..."
                              ) : briefSaved ? (
                                <>
                                  <Check size={12} />
                                  Saved
                                </>
                              ) : (
                                "Save brief"
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* On-demand graphic — mounted once the linked item is loaded so
                        assetType resolves from the item, then the task, then the
                        content type. Gated on the item's contentType being a
                        genuinely visual type (matches ContentLibrary's gate):
                        assetType alone can't tell visual pieces from non-visual
                        ones (cold-emails, lead-magnet, …) because
                        assetTypeForContentType defaults every unknown content
                        type to "social-post". */}
                    {linkedItem && isVisualContentType(linkedItem.contentType) && (
                      <AssetPanel
                        solution={task.solution}
                        assetType={
                          linkedItem.assetType ||
                          task.assetType ||
                          assetTypeForContentType(linkedItem.contentType || "")
                        }
                        itemId={task.libraryItemId}
                        briefText={briefText}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/**
 * Inline panel rendered when a CalendarTask is an email send.
 * Loads the EmailDraft, shows preview + recipients + Send Now button.
 */
function EmailDraftPanel({ draftId, taskId }: { draftId: string; taskId: string }) {
  type DraftLite = {
    id: string
    subject: string
    bodyHtml: string
    rawHtmlMode: boolean
    recipients: { kind: string; email?: string; audienceId?: string; contactId?: string }[]
    status: string
    autoSend: boolean
    scheduledFor?: string
  }
  const [draft, setDraft] = useState<DraftLite | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/gtm/email/drafts/${draftId}`)
      .then((r) => r.json())
      .then((d) => setDraft(d.draft || null))
      .catch(() => setDraft(null))
  }, [draftId])

  if (!draft) {
    return (
      <div style={{ marginBottom: 20, padding: 12, background: "var(--gtm-bg-page)", borderRadius: 8, fontSize: 12, color: "var(--gtm-text-faint)" }}>
        Loading email draft...
      </div>
    )
  }

  async function sendNow() {
    if (!confirm(`Send "${draft?.subject}" to ${draft?.recipients.length || 0} recipient group(s) now?`)) return
    setBusy(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/gtm/email/drafts/${draftId}/send`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Send failed")
      setMsg(`Sent ${data.sentCount} of ${data.total}${data.failedCount ? ` (${data.failedCount} failed)` : ""}.`)
      // Refresh local draft state.
      const refreshed = await fetch(`/api/gtm/email/drafts/${draftId}`).then((r) => r.json())
      if (refreshed.draft) setDraft(refreshed.draft)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Send failed")
    } finally {
      setBusy(false)
    }
  }

  const previewSrc = draft.rawHtmlMode
    ? draft.bodyHtml
    : `<!doctype html><html><body style="margin:0;padding:0;background:#F4F5F8;font-family:Inter,system-ui,sans-serif;color:#061341;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="padding:24px 16px;">
            <table role="presentation" width="600" style="max-width:600px;width:100%;background:#fff;border-radius:14px;overflow:hidden;">
              <tr><td style="background:linear-gradient(135deg,#061341 0%,#1A56DB 55%,#0CF4DF 100%);padding:18px 28px;color:#fff;font-weight:600;">Momentify</td></tr>
              <tr><td style="padding:28px;font-size:15px;line-height:1.6;">${draft.bodyHtml}</td></tr>
            </table>
          </td></tr>
        </table>
      </body></html>`

  return (
    <div style={{ marginBottom: 20, border: "1px solid var(--gtm-border)", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--gtm-bg-page)", borderBottom: "1px solid var(--gtm-border)", gap: 8, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gtm-text-faint)" }}>
            {draft.status} {draft.autoSend ? "(auto-send)" : "(manual)"}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gtm-text-primary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {draft.subject || "(no subject)"}
          </div>
          <div style={{ fontSize: 11, color: "var(--gtm-text-faint)", marginTop: 2 }}>
            {draft.recipients.length} recipient group(s)
            {draft.scheduledFor && ` · scheduled ${new Date(draft.scheduledFor).toLocaleString()}`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <a
            href={`/gtm/email?tab=drafts`}
            style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, color: "var(--gtm-text-secondary)", textDecoration: "none", border: "1px solid var(--gtm-border)", borderRadius: 6 }}
          >
            Edit
          </a>
          {draft.status !== "sent" && (
            <button
              type="button"
              onClick={sendNow}
              disabled={busy}
              style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, color: "#fff", background: "#00BBA5", border: "none", borderRadius: 6, cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.6 : 1 }}
            >
              {busy ? "Sending..." : "Send Now"}
            </button>
          )}
        </div>
      </div>
      <iframe
        title="Email preview"
        srcDoc={previewSrc}
        sandbox=""
        style={{ width: "100%", height: 360, border: "none", background: "#F4F5F8", display: "block" }}
      />
      {msg && (
        <div style={{ padding: "8px 16px", fontSize: 12, color: "var(--gtm-text-secondary)", borderTop: "1px solid var(--gtm-border)" }}>
          {msg}
        </div>
      )}
      {/* Suppress unused-var warning - taskId is in scope for downstream features (mark complete linkage). */}
      {void taskId}
    </div>
  )
}
