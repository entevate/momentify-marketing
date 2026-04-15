"use client"

import { useState, useEffect, useCallback } from "react"
import { Copy, Check, Trash2, Eye, X, Bookmark } from "lucide-react"
import { contentTypes } from "./ContentBuilder"
import type { ContentItem } from "@/lib/gtm/content-types"

const font = "'Inter', system-ui, -apple-system, sans-serif"

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDays = Math.floor(diffHr / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function ContentLibrary({
  solution,
}: {
  solution: string
  solutionLabel: string
}) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [viewItem, setViewItem] = useState<ContentItem | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/gtm/content?solution=${encodeURIComponent(solution)}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || [])
        setLoading(false)
      })
      .catch(() => {
        setItems([])
        setLoading(false)
      })
  }, [solution])

  const handleDelete = useCallback(
    async (id: string) => {
      const updated = items.filter((i) => i.id !== id)
      setItems(updated)
      try {
        await fetch(`/api/gtm/content/${id}`, { method: "DELETE" })
      } catch {
        // Fall through
      }
    },
    [items]
  )

  const handleCopy = useCallback((id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const uniqueTypes = Array.from(new Set(items.map((i) => i.contentType)))
  const filtered =
    filter === "all" ? items : items.filter((i) => i.contentType === filter)

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <p
          style={{
            fontSize: 14,
            color: "var(--gtm-text-muted)",
            fontFamily: font,
          }}
        >
          Loading library...
        </p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <div
          style={{
            border: "2px dashed var(--gtm-border)",
            borderRadius: 12,
            padding: 48,
            textAlign: "center",
            maxWidth: 400,
            transition: "border-color 200ms ease",
          }}
        >
          <Bookmark
            size={32}
            style={{ color: "var(--gtm-text-faint)", marginBottom: 16 }}
          />
          <p
            style={{
              fontSize: 14,
              color: "var(--gtm-text-muted)",
              fontFamily: font,
              margin: 0,
            }}
          >
            No saved content yet.
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--gtm-text-faint)",
              fontFamily: font,
              marginTop: 6,
            }}
          >
            Generate content in the Content Builder tab and save it here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: font,
            cursor: "pointer",
            border:
              filter === "all"
                ? "1px solid var(--gtm-accent)"
                : "1px solid var(--gtm-border)",
            background:
              filter === "all" ? "var(--gtm-accent-bg)" : "transparent",
            color:
              filter === "all"
                ? "var(--gtm-accent)"
                : "var(--gtm-text-muted)",
            transition: "all 150ms ease",
          }}
        >
          All ({items.length})
        </button>
        {uniqueTypes.map((type) => {
          const ct = contentTypes.find((c) => c.key === type)
          const count = items.filter((i) => i.contentType === type).length
          const selected = filter === type
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: font,
                cursor: "pointer",
                border: selected
                  ? "1px solid var(--gtm-accent)"
                  : "1px solid var(--gtm-border)",
                background: selected ? "var(--gtm-accent-bg)" : "transparent",
                color: selected
                  ? "var(--gtm-accent)"
                  : "var(--gtm-text-muted)",
                transition: "all 150ms ease",
              }}
            >
              {ct?.label || type} ({count})
            </button>
          )
        })}
      </div>

      {/* Card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {filtered.map((item) => {
          const ct = contentTypes.find((c) => c.key === item.contentType)
          const Icon = ct?.icon
          return (
            <div
              key={item.id}
              style={{
                background: "var(--gtm-bg-card)",
                border: "1px solid var(--gtm-border)",
                borderRadius: 10,
                padding: 20,
                transition: "all 200ms ease",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {Icon && (
                    <Icon
                      size={14}
                      style={{ color: "var(--gtm-accent)", flexShrink: 0 }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--gtm-text-primary)",
                      fontFamily: font,
                      transition: "color 200ms ease",
                    }}
                  >
                    {ct?.label || item.contentType}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--gtm-text-faint)",
                    fontFamily: font,
                  }}
                >
                  {formatDate(item.createdAt)}
                </span>
              </div>

              {/* Preview */}
              <p
                style={{
                  fontSize: 13,
                  color: "var(--gtm-text-muted)",
                  fontFamily: font,
                  lineHeight: 1.6,
                  margin: 0,
                  flex: 1,
                  transition: "color 200ms ease",
                }}
              >
                {item.content.slice(0, 120)}
                {item.content.length > 120 ? "..." : ""}
              </p>

              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {item.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 6px",
                      borderRadius: 3,
                      background: "var(--gtm-accent-bg)",
                      color: "var(--gtm-accent-text)",
                      fontFamily: font,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 12,
                  borderTop: "1px solid var(--gtm-border)",
                  paddingTop: 12,
                }}
              >
                <button
                  onClick={() => setViewItem(item)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    borderRadius: 4,
                    border: "1px solid var(--gtm-border)",
                    background: "transparent",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: font,
                    color: "var(--gtm-text-muted)",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  <Eye size={12} /> View
                </button>
                <button
                  onClick={() => handleCopy(item.id, item.content)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    borderRadius: 4,
                    border: "1px solid var(--gtm-border)",
                    background: "transparent",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: font,
                    color:
                      copied === item.id
                        ? "var(--gtm-accent)"
                        : "var(--gtm-text-muted)",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  {copied === item.id ? (
                    <>
                      <Check size={12} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    borderRadius: 4,
                    border: "1px solid var(--gtm-border)",
                    background: "transparent",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: font,
                    color: "var(--gtm-text-muted)",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                    marginLeft: "auto",
                  }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* View Modal */}
      {viewItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setViewItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--gtm-bg-card)",
              borderRadius: 12,
              padding: 32,
              maxWidth: 700,
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              border: "1px solid var(--gtm-border)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setViewItem(null)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--gtm-text-faint)",
                padding: 4,
              }}
            >
              <X size={18} />
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--gtm-text-primary)",
                  fontFamily: font,
                }}
              >
                {contentTypes.find((c) => c.key === viewItem.contentType)
                  ?.label || viewItem.contentType}
              </span>
              {viewItem.platform && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: "var(--gtm-accent-bg)",
                    color: "var(--gtm-accent-text)",
                    fontFamily: font,
                  }}
                >
                  {viewItem.platform}
                </span>
              )}
            </div>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: font,
                fontSize: 14,
                lineHeight: 1.75,
                color: "var(--gtm-text-primary)",
                margin: 0,
                background: "var(--gtm-bg-page)",
                padding: 20,
                borderRadius: 8,
                border: "1px solid var(--gtm-border)",
              }}
            >
              {viewItem.content}
            </pre>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={() => {
                  handleCopy(viewItem.id, viewItem.content)
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "1px solid var(--gtm-border)",
                  background: "var(--gtm-bg-card)",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: font,
                  color:
                    copied === viewItem.id
                      ? "var(--gtm-accent)"
                      : "var(--gtm-text-primary)",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                }}
              >
                {copied === viewItem.id ? (
                  <>
                    <Check size={14} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
