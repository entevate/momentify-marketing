"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Copy,
  Check,
  Trash2,
  Eye,
  X,
  ExternalLink,
  Link2,
  FileText,
  Share2,
  MessageSquare,
  BookOpen,
  Phone,
  Handshake,
  Shield,
  Globe,
  FileBarChart,
} from "lucide-react"
import type { ContentItem, MicrositeRecord } from "@/lib/gtm/content-types"

const font = "'Inter', system-ui, -apple-system, sans-serif"

const solutionTabs = [
  { key: "all", label: "All" },
  { key: "trade-shows", label: "Trade Shows" },
  { key: "recruiting", label: "Recruiting" },
  { key: "field-sales", label: "Field Sales" },
  { key: "facilities", label: "Facilities" },
  { key: "events-venues", label: "Events & Venues" },
]

const contentTypeMap: Record<string, { label: string; icon: typeof FileText }> = {
  "cold-emails": { label: "Cold Emails", icon: FileText },
  "social-post": { label: "Social Post", icon: Share2 },
  "linkedin-dm": { label: "LinkedIn DM", icon: MessageSquare },
  "lead-magnet": { label: "Lead Magnet", icon: BookOpen },
  "discovery-script": { label: "Discovery Script", icon: Phone },
  "partner-pitch": { label: "Partner Pitch", icon: Handshake },
  "battle-card": { label: "Battle Card", icon: Shield },
  "microsite": { label: "Microsite", icon: Globe },
  "one-pager": { label: "One Pager", icon: FileBarChart },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function ContentDashboard() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [sites, setSites] = useState<MicrositeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSolution, setActiveSolution] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [copied, setCopied] = useState<string | null>(null)
  const [viewItem, setViewItem] = useState<ContentItem | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/gtm/content").then((r) => r.json()).catch(() => ({ items: [] })),
      fetch("/api/gtm/microsites").then((r) => r.json()).catch(() => ({ sites: [] })),
    ]).then(([contentData, siteData]) => {
      setItems(contentData.items || [])
      setSites(siteData.sites || [])
      setLoading(false)
    })
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    try {
      await fetch(`/api/gtm/content/${id}`, { method: "DELETE" })
    } catch { /* fall through */ }
  }, [])

  const handleUnpublish = useCallback(async (slug: string) => {
    setSites((prev) => prev.filter((s) => s.slug !== slug))
    try {
      await fetch(`/api/gtm/microsites/${slug}`, { method: "DELETE" })
    } catch { /* fall through */ }
  }, [])

  const handleCopyLink = useCallback((slug: string) => {
    const url = `${window.location.origin}/m/${slug}`
    navigator.clipboard.writeText(url)
    setCopied(slug)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const handleCopyContent = useCallback((id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  // Build a map of contentId -> MicrositeRecord for matching
  const siteByContentId = new Map<string, MicrositeRecord>()
  for (const site of sites) {
    if (site.contentId) siteByContentId.set(site.contentId, site)
  }

  // Filter items
  const filtered = items.filter((item) => {
    if (activeSolution !== "all" && item.solution !== activeSolution) return false
    if (typeFilter !== "all" && item.contentType !== typeFilter) return false
    return true
  })

  const uniqueTypes = Array.from(new Set(items.map((i) => i.contentType)))

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--gtm-text-muted)", fontFamily: font }}>
          Loading content...
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 48px" }}>
      {/* Page Header */}
      <div style={{ padding: "48px 0 0" }}>
        <p style={{
          fontSize: 11, fontWeight: 600, color: "var(--gtm-cyan)",
          letterSpacing: "0.14em", fontFamily: font, marginBottom: 10, textTransform: "uppercase",
        }}>
          CONTENT HUB
        </p>
        <h1 style={{
          fontSize: 36, fontWeight: 300, color: "var(--gtm-text-primary)",
          fontFamily: font, margin: 0, transition: "color 200ms ease",
        }}>
          Content Dashboard
        </h1>
        <p style={{
          fontSize: 16, fontWeight: 400, color: "var(--gtm-text-muted)",
          fontFamily: font, marginTop: 8, transition: "color 200ms ease",
        }}>
          All generated content across solutions. Publish, copy, and manage from one place.
        </p>
      </div>

      {/* Solution Tabs */}
      <div style={{ display: "flex", gap: 4, marginTop: 32, marginBottom: 16, flexWrap: "wrap" }}>
        {solutionTabs.map((tab) => {
          const active = activeSolution === tab.key
          const count = tab.key === "all"
            ? items.length
            : items.filter((i) => i.solution === tab.key).length
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSolution(tab.key)}
              style={{
                padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                fontFamily: font, cursor: "pointer",
                border: active ? "1px solid var(--gtm-accent)" : "1px solid var(--gtm-border)",
                background: active ? "var(--gtm-accent-bg)" : "transparent",
                color: active ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
                transition: "all 150ms ease",
              }}
            >
              {tab.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Content Type Filter */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          onClick={() => setTypeFilter("all")}
          style={{
            padding: "5px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600,
            fontFamily: font, cursor: "pointer",
            border: typeFilter === "all" ? "1px solid var(--gtm-accent)" : "1px solid var(--gtm-border)",
            background: typeFilter === "all" ? "var(--gtm-accent-bg)" : "transparent",
            color: typeFilter === "all" ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
            transition: "all 150ms ease",
          }}
        >
          All Types
        </button>
        {uniqueTypes.map((type) => {
          const ct = contentTypeMap[type]
          const active = typeFilter === type
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              style={{
                padding: "5px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                fontFamily: font, cursor: "pointer",
                border: active ? "1px solid var(--gtm-accent)" : "1px solid var(--gtm-border)",
                background: active ? "var(--gtm-accent-bg)" : "transparent",
                color: active ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
                transition: "all 150ms ease",
              }}
            >
              {ct?.label || type}
            </button>
          )
        })}
      </div>

      {/* Content Grid */}
      {filtered.length === 0 ? (
        <div style={{
          border: "2px dashed var(--gtm-border)", borderRadius: 12,
          padding: 48, textAlign: "center", marginTop: 32,
        }}>
          <p style={{ fontSize: 14, color: "var(--gtm-text-muted)", fontFamily: font, margin: 0 }}>
            No content found for this filter.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}>
          {filtered.map((item) => {
            const ct = contentTypeMap[item.contentType]
            const Icon = ct?.icon || FileText
            const micrositeRecord = siteByContentId.get(item.id)

            return (
              <div
                key={item.id}
                style={{
                  background: "var(--gtm-bg-card)", border: "1px solid var(--gtm-border)",
                  borderRadius: 10, padding: 20, display: "flex", flexDirection: "column",
                  transition: "all 200ms ease",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon size={14} style={{ color: "var(--gtm-accent)", flexShrink: 0 }} />
                    <span style={{
                      fontSize: 13, fontWeight: 700, color: "var(--gtm-text-primary)",
                      fontFamily: font, transition: "color 200ms ease",
                    }}>
                      {ct?.label || item.contentType}
                    </span>
                    {micrositeRecord && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3,
                        background: "rgba(0,187,165,0.15)", color: "#00BBA5", fontFamily: font,
                      }}>
                        LIVE
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: "var(--gtm-text-faint)", fontFamily: font }}>
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* Preview */}
                <p style={{
                  fontSize: 13, color: "var(--gtm-text-muted)", fontFamily: font,
                  lineHeight: 1.6, margin: 0, flex: 1, transition: "color 200ms ease",
                }}>
                  {item.content.slice(0, 120)}{item.content.length > 120 ? "..." : ""}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
                  {item.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 3,
                        background: "var(--gtm-accent-bg)", color: "var(--gtm-accent-text)", fontFamily: font,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Published microsite URL */}
                {micrositeRecord && (
                  <div style={{
                    marginTop: 10, padding: "8px 12px", borderRadius: 6,
                    background: "rgba(0,187,165,0.06)", border: "1px solid rgba(0,187,165,0.2)",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <Link2 size={12} style={{ color: "#00BBA5", flexShrink: 0 }} />
                    <span style={{
                      fontSize: 12, color: "#00BBA5", fontFamily: font, fontWeight: 500,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
                    }}>
                      /m/{micrositeRecord.slug}
                    </span>
                    <button
                      onClick={() => handleCopyLink(micrositeRecord.slug)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: copied === micrositeRecord.slug ? "#00BBA5" : "var(--gtm-text-faint)",
                        padding: 2, display: "flex",
                      }}
                    >
                      {copied === micrositeRecord.slug ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                    <a
                      href={`/m/${micrositeRecord.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--gtm-text-faint)", display: "flex", padding: 2 }}
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div style={{
                  display: "flex", gap: 6, marginTop: 12,
                  borderTop: "1px solid var(--gtm-border)", paddingTop: 12,
                }}>
                  <button
                    onClick={() => setViewItem(item)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "4px 10px", borderRadius: 4, border: "1px solid var(--gtm-border)",
                      background: "transparent", fontSize: 11, fontWeight: 600,
                      fontFamily: font, color: "var(--gtm-text-muted)", cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    <Eye size={12} /> View
                  </button>
                  <button
                    onClick={() => handleCopyContent(item.id, item.content)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "4px 10px", borderRadius: 4, border: "1px solid var(--gtm-border)",
                      background: "transparent", fontSize: 11, fontWeight: 600,
                      fontFamily: font, cursor: "pointer", transition: "all 150ms ease",
                      color: copied === item.id ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
                    }}
                  >
                    {copied === item.id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                  {micrositeRecord && (
                    <button
                      onClick={() => handleUnpublish(micrositeRecord.slug)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", borderRadius: 4, border: "1px solid var(--gtm-border)",
                        background: "transparent", fontSize: 11, fontWeight: 600,
                        fontFamily: font, color: "#E5484D", cursor: "pointer",
                        transition: "all 150ms ease",
                      }}
                    >
                      <X size={12} /> Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "4px 10px", borderRadius: 4, border: "1px solid var(--gtm-border)",
                      background: "transparent", fontSize: 11, fontWeight: 600,
                      fontFamily: font, color: "var(--gtm-text-muted)", cursor: "pointer",
                      transition: "all 150ms ease", marginLeft: "auto",
                    }}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setViewItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--gtm-bg-card)", borderRadius: 12, padding: 32,
              maxWidth: 700, width: "90%", maxHeight: "80vh", overflowY: "auto",
              border: "1px solid var(--gtm-border)", position: "relative",
            }}
          >
            <button
              onClick={() => setViewItem(null)}
              style={{
                position: "absolute", top: 16, right: 16, background: "transparent",
                border: "none", cursor: "pointer", color: "var(--gtm-text-faint)", padding: 4,
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{
                fontSize: 16, fontWeight: 700, color: "var(--gtm-text-primary)", fontFamily: font,
              }}>
                {contentTypeMap[viewItem.contentType]?.label || viewItem.contentType}
              </span>
              {viewItem.platform && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
                  background: "var(--gtm-accent-bg)", color: "var(--gtm-accent-text)", fontFamily: font,
                }}>
                  {viewItem.platform}
                </span>
              )}
            </div>

            <pre style={{
              whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: font,
              fontSize: 14, lineHeight: 1.75, color: "var(--gtm-text-primary)",
              margin: 0, background: "var(--gtm-bg-page)", padding: 20,
              borderRadius: 8, border: "1px solid var(--gtm-border)",
            }}>
              {viewItem.content}
            </pre>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={() => handleCopyContent(viewItem.id, viewItem.content)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                  borderRadius: 6, border: "1px solid var(--gtm-border)",
                  background: "var(--gtm-bg-card)", fontSize: 13, fontWeight: 600,
                  fontFamily: font, cursor: "pointer", transition: "all 200ms ease",
                  color: copied === viewItem.id ? "var(--gtm-accent)" : "var(--gtm-text-primary)",
                }}
              >
                {copied === viewItem.id ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy All</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
