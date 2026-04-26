"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Trash2, Copy, Check, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { dispatchLibraryChanged } from "./SolutionTabs"
import AssetPanel from "@/components/gtm/AssetPanel"

const font = "'Inter', system-ui, sans-serif"

interface LibraryItem {
  id: string
  contentType: string
  motion: "direct" | "partner"
  solution: string
  content: string
  tags?: string[]
  createdAt: string
}

interface ContentLibraryProps {
  solution: string
  solutionLabel: string
}

// Content types that support an HTML-asset preview (matches Content Builder's one-click set)
const HTML_ASSET_TYPES = new Set(["infographic", "microsite", "carousel", "social-post", "one-pager", "pitch-deck"])

const CONTENT_TYPE_LABELS: Record<string, string> = {
  "cold-emails": "Cold Email Sequence",
  "linkedin-dm": "LinkedIn DM Sequence",
  "social-post": "Social Post",
  "carousel": "Social Carousel",
  "lead-magnet": "Lead Magnet",
  "discovery-script": "Discovery Script",
  "partner-pitch": "Partner Pitch",
  "battle-card": "Battle Card",
  "microsite": "Microsite",
  "pitch-deck": "Pitch Deck",
  "infographic": "Infographic",
  "one-pager": "One-Pager",
}

function formatRelative(iso: string): string {
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}

export default function ContentLibrary({ solution, solutionLabel }: ContentLibraryProps) {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/gtm/content?solution=${encodeURIComponent(solution)}`)
      if (!res.ok) throw new Error("Failed to load library")
      const data = await res.json()
      const loadedItems: LibraryItem[] = Array.isArray(data.items) ? data.items : []
      setItems(loadedItems)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err.message || "Failed to load library")
    } finally {
      setLoading(false)
    }
  }, [solution])

  useEffect(() => { fetchItems() }, [fetchItems])

  // Listen for library-changed events so the item list stays fresh
  // when edits happen from other surfaces (e.g., TaskDetailModal).
  useEffect(() => {
    function onChange(e: Event) {
      const detail = (e as CustomEvent<{ solution?: string }>).detail
      if (!detail || detail.solution === solution) fetchItems()
    }
    window.addEventListener("gtm:library-changed", onChange)
    return () => window.removeEventListener("gtm:library-changed", onChange)
  }, [fetchItems, solution])

  async function handleDelete(id: string) {
    if (!confirm("Delete this content? This cannot be undone.")) return
    try {
      const res = await fetch(`/api/gtm/content/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      setItems((prev) => prev.filter((i) => i.id !== id))
      if (expandedId === id) setExpandedId(null)
      dispatchLibraryChanged(solution)
    } catch {
      setError("Failed to delete item.")
    }
  }

  async function handleCopy(id: string, content: string) {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // ignore
    }
  }

  const contentTypes = Array.from(new Set(items.map((i) => i.contentType)))
  const filteredItems = filter === "all" ? items : items.filter((i) => i.contentType === filter)

  return (
    <div style={{ fontFamily: font }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h3 style={{ margin: "0 0 4px 0", fontSize: 15, fontWeight: 600, color: "var(--gtm-text-primary)" }}>
            {solutionLabel} Library
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--gtm-text-secondary)" }}>
            {loading ? "Loading..." : `${items.length} saved ${items.length === 1 ? "asset" : "assets"}`}
          </p>
        </div>

        {contentTypes.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} count={items.length} />
            {contentTypes.map((ct) => (
              <FilterChip
                key={ct}
                label={CONTENT_TYPE_LABELS[ct] || ct}
                active={filter === ct}
                onClick={() => setFilter(ct)}
                count={items.filter((i) => i.contentType === ct).length}
              />
            ))}
          </div>
        )}
      </div>

      {error && <div style={errBanner}>{error}</div>}

      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, color: "var(--gtm-text-secondary)", gap: 10, fontSize: 13 }}>
          <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
          Loading library...
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div
          style={{
            background: "var(--gtm-bg-card)",
            border: "1px dashed var(--gtm-border)",
            borderRadius: 6,
            padding: 60,
            textAlign: "center",
            color: "var(--gtm-text-secondary)",
            fontSize: 14,
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: 600, color: "var(--gtm-text-primary)" }}>
            No saved content yet
          </p>
          <p style={{ margin: 0, fontSize: 13 }}>
            Head to Content Builder to create your first asset.
          </p>
        </div>
      )}

      {!loading && filteredItems.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredItems.map((item) => {
            const expanded = expandedId === item.id
            const preview = item.content.slice(0, 160).replace(/\n+/g, " ")
            const isHtmlAsset = HTML_ASSET_TYPES.has(item.contentType)
            return (
              <div key={item.id} style={cardStyle}>
                <div
                  onClick={() => setExpandedId(expanded ? null : item.id)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, cursor: "pointer" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={typePill}>{CONTENT_TYPE_LABELS[item.contentType] || item.contentType}</span>
                      <span style={{ fontSize: 11, color: "var(--gtm-text-faint)" }}>
                        {item.motion === "direct" ? "Direct" : "Partner"} · {formatRelative(item.createdAt)}
                      </span>
                      {item.tags?.[0] && (
                        <span style={{ fontSize: 11, color: "var(--gtm-text-secondary)" }}>{item.tags[0]}</span>
                      )}
                    </div>
                    {!expanded && (
                      <p style={{ margin: 0, fontSize: 13, color: "var(--gtm-text-secondary)", lineHeight: 1.5 }}>
                        {preview}{item.content.length > 160 && "..."}
                      </p>
                    )}
                  </div>
                  <div style={{ color: "var(--gtm-text-faint)", flexShrink: 0 }}>
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {expanded && (
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                    <pre
                      style={{
                        margin: 0, padding: 14, background: "var(--gtm-bg-page)", borderRadius: 6,
                        fontSize: 13, lineHeight: 1.6, color: "var(--gtm-text-primary)",
                        whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: font,
                        maxHeight: 400, overflow: "auto",
                      }}
                    >
                      {item.content}
                    </pre>

                    {isHtmlAsset && (
                      <AssetPanel
                        solution={item.solution}
                        assetType={item.contentType}
                        itemId={item.id}
                        briefText={item.content}
                      />
                    )}

                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button onClick={() => handleCopy(item.id, item.content)} style={actionBtnStyle}>
                        {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                        {copiedId === item.id ? "Copied" : "Copy Brief"}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          ...actionBtnStyle,
                          background: "rgba(239, 68, 68, 0.08)",
                          color: "#b91c1c",
                          borderColor: "rgba(239, 68, 68, 0.25)",
                        }}
                      >
                        <Trash2 size={12} />Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick, count }: { label: string; active: boolean; onClick: () => void; count: number }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 10px",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: font,
        border: `1px solid ${active ? "#00BBA5" : "var(--gtm-border)"}`,
        background: active ? "rgba(0, 187, 165, 0.08)" : "#fff",
        color: active ? "#00BBA5" : "var(--gtm-text-secondary)",
        borderRadius: 100,
        cursor: "pointer",
      }}
    >
      {label} <span style={{ opacity: 0.6, marginLeft: 4 }}>{count}</span>
    </button>
  )
}

const cardStyle: React.CSSProperties = {
  background: "var(--gtm-bg-card)",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  padding: 16,
}

const typePill: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#00BBA5",
  background: "rgba(0, 187, 165, 0.08)",
  padding: "3px 8px",
  borderRadius: 100,
}

const actionBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "5px 12px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: font,
  border: "1px solid var(--gtm-border)",
  background: "#fff",
  color: "var(--gtm-text-secondary)",
  borderRadius: 6,
  cursor: "pointer",
}

const errBanner: React.CSSProperties = {
  background: "rgba(239, 68, 68, 0.08)",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  borderRadius: 6,
  padding: 12,
  fontSize: 13,
  color: "#b91c1c",
  marginBottom: 16,
}
