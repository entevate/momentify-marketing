"use client"

/**
 * LibrarySeedPanel — collapsible panel inside the Drafts tab that lists
 * Library `cold-emails` items and lets the user create a draft seeded
 * from a chosen 3-touch sequence position.
 */

import { useEffect, useState } from "react"
import { Sparkles, Plus } from "lucide-react"
import type { ContentItem } from "@/lib/gtm/content-types"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface Props {
  onSeed: (libraryItemId: string, touchIndex: number) => void
}

export default function LibrarySeedPanel({ onSeed }: Props) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || items.length > 0) return
    setLoading(true)
    fetch("/api/gtm/content")
      .then((r) => r.json())
      .then((d) => {
        const all = (d.items || []) as ContentItem[]
        // Only show cold-emails items - linkedin-dm and other content types
        // aren't email-shaped.
        setItems(all.filter((i) => i.contentType === "cold-emails"))
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [open, items.length])

  return (
    <div style={panel}>
      <button type="button" onClick={() => setOpen(!open)} style={header}>
        <Sparkles size={14} />
        <span style={{ fontWeight: 600, fontSize: 13 }}>Seed from Library</span>
        <span style={{ fontSize: 11, color: "var(--gtm-text-faint)" }}>
          {open ? "hide" : "show"} {items.length > 0 ? `(${items.length})` : ""}
        </span>
      </button>
      {open && (
        <div style={{ padding: 12, borderTop: "1px solid var(--gtm-border)" }}>
          {loading && <div style={empty}>Loading...</div>}
          {!loading && items.length === 0 && (
            <div style={empty}>
              No cold-emails saved yet. Generate one in Content Builder, then come back.
            </div>
          )}
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map((item) => (
              <li key={item.id} style={row}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gtm-text-primary)" }}>
                    {item.solution} · {item.motion} · {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--gtm-text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.tags.join(", ") || "(no tags)"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((touch) => (
                    <button
                      key={touch}
                      type="button"
                      onClick={() => onSeed(item.id, touch)}
                      style={touchBtn}
                      title={`Seed Touch ${touch + 1} into a new draft`}
                    >
                      <Plus size={11} /> Touch {touch + 1}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const panel: React.CSSProperties = { background: "#fff", border: "1px solid var(--gtm-border)", borderRadius: 8, overflow: "hidden", fontFamily: font }
const header: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", border: "none", background: "var(--gtm-bg-page)", cursor: "pointer", color: "var(--gtm-text-primary)", fontFamily: font }
const empty: React.CSSProperties = { padding: 16, textAlign: "center", color: "var(--gtm-text-faint)", fontSize: 12 }
const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", border: "1px solid var(--gtm-border)", borderRadius: 6 }
const touchBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 3, padding: "5px 9px", fontSize: 11, fontWeight: 600, fontFamily: font, border: "1px solid var(--gtm-border)", borderRadius: 4, background: "#fff", color: "var(--gtm-text-secondary)", cursor: "pointer" }
