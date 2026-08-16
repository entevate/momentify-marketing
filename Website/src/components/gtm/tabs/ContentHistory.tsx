"use client"

/**
 * ContentHistory - full chronological feed of every piece generated for a
 * pillar (newest-first, read-only cards), independent of Library membership.
 * Library (ContentLibrary.tsx) shows only the kept subset; History shows
 * everything so nothing generated is ever lost from view. Cards offer
 * Keep/Remove (toggles `kept` via PUT) and Duplicate (creates a fresh,
 * un-kept copy in History) rather than the destructive Delete that Library
 * exposes.
 */

import React, { useCallback, useEffect, useState } from "react"
import { Bookmark, BookmarkCheck, Copy, Loader2 } from "lucide-react"
import type { ContentItem } from "@/lib/gtm/content-types"
import { dispatchLibraryChanged } from "./SolutionTabs"

const font = "'Inter', system-ui, sans-serif"

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

interface ContentHistoryProps {
  solution: string
  solutionLabel: string
}

export default function ContentHistory({ solution, solutionLabel }: ContentHistoryProps) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/gtm/content?solution=${encodeURIComponent(solution)}`)
      if (!res.ok) throw new Error("Failed to load history")
      const data = await res.json()
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err.message || "Failed to load history")
    } finally {
      setLoading(false)
    }
  }, [solution])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    function onChange(e: Event) {
      const detail = (e as CustomEvent<{ solution?: string }>).detail
      if (!detail || detail.solution === solution) load()
    }
    window.addEventListener("gtm:library-changed", onChange)
    return () => window.removeEventListener("gtm:library-changed", onChange)
  }, [load, solution])

  async function toggleKeep(item: ContentItem) {
    setBusyId(item.id)
    try {
      const res = await fetch(`/api/gtm/content/${encodeURIComponent(item.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kept: !item.kept }),
      })
      if (!res.ok) throw new Error("Failed to update library status")
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, kept: !item.kept } : i)))
      dispatchLibraryChanged(solution)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err.message || "Failed to update library status")
    } finally {
      setBusyId(null)
    }
  }

  async function duplicate(item: ContentItem) {
    setBusyId(item.id)
    try {
      // Drop id/createdAt/kept (fresh record), and drop blobUrl/templateId —
      // those are concrete graphic-result refs keyed to the OLD id, so a copy
      // carrying them would point at a nonexistent asset (404 thumbnail).
      // assetType (the graphic KIND) is kept so a later regenerate knows what
      // to make; the duplicate starts as a clean, graphic-on-demand piece.
      const { id, createdAt, kept, blobUrl, templateId, ...rest } = item
      void id
      void createdAt
      void kept
      void blobUrl
      void templateId
      const res = await fetch(`/api/gtm/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rest, kept: false }),
      })
      if (!res.ok) throw new Error("Failed to duplicate item")
      dispatchLibraryChanged(solution)
      await load()
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err.message || "Failed to duplicate item")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div style={{ fontFamily: font }}>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: 15, fontWeight: 600, color: "var(--gtm-text-primary)" }}>
          {solutionLabel} History
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: "var(--gtm-text-secondary)" }}>
          {loading ? "Loading..." : `${items.length} ${items.length === 1 ? "piece" : "pieces"} generated`}
        </p>
      </div>

      {error && <div style={errBanner}>{error}</div>}

      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, color: "var(--gtm-text-secondary)", gap: 10, fontSize: 13 }}>
          <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
          Loading history...
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
            No content generated yet
          </p>
          <p style={{ margin: 0, fontSize: 13 }}>
            Head to Content Builder to generate your first piece.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => {
            const busy = busyId === item.id
            return (
              <div key={item.id} style={cardStyle}>
                {item.blobUrl && (
                  <div style={thumbStyle}>
                    <iframe
                      title={`${item.contentType} preview`}
                      src={`/api/gtm/asset-preview?solution=${encodeURIComponent(item.solution)}&assetType=${encodeURIComponent(item.assetType || "social-post")}&itemId=${encodeURIComponent(item.id)}`}
                      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                      sandbox="allow-scripts"
                    />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={typePill}>{CONTENT_TYPE_LABELS[item.contentType] || item.contentType}</span>
                    <span style={{ fontSize: 11, color: "var(--gtm-text-faint)" }}>
                      {formatRelative(item.createdAt)}{item.kept ? " · in Library" : ""}
                    </span>
                    {item.tags?.[0] && (
                      <span style={{ fontSize: 11, color: "var(--gtm-text-secondary)" }}>{item.tags[0]}</span>
                    )}
                  </div>
                  <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "var(--gtm-text-secondary)", lineHeight: 1.5, whiteSpace: "pre-wrap", maxHeight: 96, overflow: "hidden" }}>
                    {item.content.slice(0, 400)}{item.content.length > 400 && "..."}
                  </p>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => duplicate(item)} disabled={busy} style={{ ...actionBtnStyle, opacity: busy ? 0.6 : 1 }}>
                      <Copy size={12} />Duplicate
                    </button>
                    <button
                      onClick={() => toggleKeep(item)}
                      disabled={busy}
                      style={{
                        ...actionBtnStyle,
                        background: item.kept ? "rgba(239, 68, 68, 0.08)" : "rgba(0,187,165,0.08)",
                        color: item.kept ? "#b91c1c" : "#0AA891",
                        borderColor: item.kept ? "rgba(239, 68, 68, 0.25)" : "rgba(0,187,165,0.25)",
                        opacity: busy ? 0.6 : 1,
                      }}
                    >
                      {item.kept ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                      {item.kept ? "Remove from Library" : "Keep"}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: "var(--gtm-bg-card)",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  padding: 16,
  display: "flex",
  gap: 16,
}

const thumbStyle: React.CSSProperties = {
  flex: "none",
  width: 120,
  height: 120,
  borderRadius: 6,
  overflow: "hidden",
  border: "1px solid var(--gtm-border)",
  background: "var(--gtm-bg-page)",
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
