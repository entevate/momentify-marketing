"use client"

/**
 * DraftsTab - left list of drafts + right ComposePane.
 *
 * Supports a `?draftId=X` query param to auto-select an existing draft
 * on mount (e.g. after the Library "Send via Email" button creates a
 * draft and routes here). NEVER creates a draft from URL query params
 * - that caused infinite duplicate creation when refreshing a page that
 * still had ?seed= in the URL after a delete. New drafts are only ever
 * created on explicit user click ("New Draft" / LibrarySeedPanel /
 * ContentLibrary's "Send via Email").
 */

import { useCallback, useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import ComposePane from "./ComposePane"
import LibrarySeedPanel from "./LibrarySeedPanel"
import type { EmailDraft } from "@/lib/gtm/email-types"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface Props {
  /** Optional preselect on mount: ?draftId=X */
  preselectDraftId?: string
}

export default function DraftsTab({ preselectDraftId }: Props) {
  const [drafts, setDrafts] = useState<EmailDraft[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/gtm/email/drafts")
      const data = await res.json()
      setDrafts(data.drafts || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // Auto-select a draft on mount when ?draftId=X is in the URL. Pure
  // selection, no creation. If the draft id doesn't exist, nothing
  // happens (the user lands on "no draft selected" and can pick one).
  useEffect(() => {
    if (preselectDraftId) setActiveId(preselectDraftId)
  }, [preselectDraftId])

  /**
   * Idempotent prepend - replaces an existing draft with the same id
   * rather than duplicating it. Belt-and-suspender for the server-side
   * dedupe; even if both fire, React state never holds duplicate keys.
   */
  function upsertDraft(d: EmailDraft) {
    setDrafts((prev) => [d, ...prev.filter((x) => x.id !== d.id)])
    setActiveId(d.id)
  }

  async function newBlankDraft() {
    const res = await fetch("/api/gtm/email/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
    const data = await res.json()
    if (data.draft) upsertDraft(data.draft)
  }

  async function seedFromLibrary(libraryItemId: string, touchIndex: number) {
    const res = await fetch("/api/gtm/email/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ libraryItemId, libraryTouchIndex: touchIndex }),
    })
    const data = await res.json()
    if (data.draft) upsertDraft(data.draft)
  }

  async function deleteDraft(id: string) {
    if (!confirm("Delete this draft? This cannot be undone.")) return
    try {
      const res = await fetch(`/api/gtm/email/drafts/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Delete failed (${res.status})`)
      }
      setDrafts((prev) => prev.filter((d) => d.id !== id))
      if (activeId === id) setActiveId(null)
    } catch (e) {
      alert(`Could not delete draft: ${e instanceof Error ? e.message : "Unknown error"}`)
      // Refresh from server so the local list reflects truth.
      await refresh()
    }
  }

  function handleDraftChange(updated: EmailDraft) {
    setDrafts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
  }

  const active = drafts.find((d) => d.id === activeId)

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, alignItems: "start", fontFamily: font, minHeight: 600 }}>
      <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button type="button" onClick={newBlankDraft} style={newBtn}>
          <Plus size={14} /> New Draft
        </button>

        <LibrarySeedPanel onSeed={seedFromLibrary} />

        <section style={panel}>
          <div style={panelHeader}>Drafts ({drafts.length})</div>
          {loading && <div style={empty}>Loading...</div>}
          {!loading && drafts.length === 0 && <div style={empty}>No drafts yet.</div>}
          <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: 540, overflow: "auto" }}>
            {drafts.map((d) => {
              const isActive = activeId === d.id
              return (
                <li
                  key={d.id}
                  onClick={() => setActiveId(d.id)}
                  style={{
                    ...listRow,
                    background: isActive ? "rgba(0,187,165,0.06)" : "transparent",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gtm-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {d.subject || "(no subject)"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--gtm-text-faint)", display: "flex", gap: 6, marginTop: 2 }}>
                      <span>{d.status}</span>
                      <span>·</span>
                      <span>{d.recipients.length} rcpt</span>
                      {d.solution && <><span>·</span><span>{d.solution}</span></>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteDraft(d.id) }}
                    style={iconOnly}
                    title="Delete draft"
                  >
                    <Trash2 size={12} />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </aside>

      {active ? (
        <ComposePane
          draft={active}
          onDraftChange={handleDraftChange}
          onAfterSend={refresh}
          onAfterSchedule={refresh}
        />
      ) : (
        <div style={emptyMain}>
          <p style={{ fontSize: 14, color: "var(--gtm-text-faint)", fontFamily: font, margin: 0 }}>
            Pick a draft from the left, or create a new one.
          </p>
        </div>
      )}
    </div>
  )
}

const newBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, height: 38, padding: "0 14px", fontSize: 13, fontWeight: 600, fontFamily: font, border: "none", borderRadius: 6, background: "#00BBA5", color: "#fff", cursor: "pointer" }
const panel: React.CSSProperties = { background: "#fff", border: "1px solid var(--gtm-border)", borderRadius: 8, overflow: "hidden", fontFamily: font }
const panelHeader: React.CSSProperties = { padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "var(--gtm-text-secondary)", background: "var(--gtm-bg-page)", borderBottom: "1px solid var(--gtm-border)" }
const empty: React.CSSProperties = { padding: 16, textAlign: "center", color: "var(--gtm-text-faint)", fontSize: 12 }
const listRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid var(--gtm-border)", cursor: "pointer" }
const iconOnly: React.CSSProperties = { width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "none", background: "transparent", color: "var(--gtm-text-faint)", cursor: "pointer", borderRadius: 4 }
const emptyMain: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, background: "#fff", border: "1px solid var(--gtm-border)", borderRadius: 8 }
