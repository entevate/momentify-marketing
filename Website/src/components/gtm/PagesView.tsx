"use client"

/**
 * Pages — publish standalone HTML (case studies, microsites) at public
 * /p/<slug> links with OG meta + open/view-time tracking.
 *
 * Auth: Momentify uses a signed httpOnly cookie, so authed calls are plain
 * same-origin fetch (the cookie rides along automatically) — no bearer header.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { slugify, type PageEvent, type PageWithStats } from "@/lib/gtm/pages-types"

const font = "'Inter', system-ui, -apple-system, sans-serif"
const NAVY = "#12243f"
const ACCENT = "#1A56DB"

// Same solution/pillar ids as the GTM sidebar nav (pillar-palettes.ts).
const PAGE_PILLARS = [
  { id: "general", label: "General Momentify", color: "#1A56DB" },
  { id: "trade-shows", label: "Trade Shows", color: "#6B21D4" },
  { id: "recruiting", label: "Recruiting", color: "#0AA891" },
  { id: "field-sales", label: "Field Sales", color: "#D4940A" },
  { id: "facilities", label: "Facilities", color: "#3A2073" },
  { id: "events-venues", label: "Events & Venues", color: "#D43D1A" },
]

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
}

const label: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "rgba(0,0,0,0.45)",
  marginBottom: "6px",
}

const input: React.CSSProperties = {
  width: "100%",
  padding: "9px 11px",
  fontSize: "13px",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: "6px",
  boxSizing: "border-box",
  color: NAVY,
  background: "#fff",
}

function fmtTime(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`
  const mm = Math.floor(totalSeconds / 60)
  if (mm < 60) return `${mm}m ${totalSeconds % 60}s`
  return `${Math.floor(mm / 60)}h ${mm % 60}m`
}

export default function PagesView() {
  const [pages, setPages] = useState<PageWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<PageWithStats | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<PageWithStats | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [pillarFilter, setPillarFilter] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [details, setDetails] = useState<Record<string, PageEvent[]>>({})

  const toggleDetail = async (p: PageWithStats) => {
    if (expanded === p.id) return setExpanded(null)
    setExpanded(p.id)
    if (!details[p.slug]) {
      const res = await fetch(`/api/gtm/pages?slug=${encodeURIComponent(p.slug)}`)
      if (res.ok) {
        const d = await res.json()
        setDetails((prev) => ({ ...prev, [p.slug]: d.events || [] }))
      }
    }
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/gtm/pages")
      if (res.ok) setPages((await res.json()).pages || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const publicUrl = (slug: string) => `${window.location.origin}/p/${slug}`

  const copy = (p: PageWithStats) => {
    navigator.clipboard.writeText(publicUrl(p.slug))
    setCopiedId(p.id)
    setTimeout(() => setCopiedId(null), 1600)
  }

  const remove = async (p: PageWithStats) => {
    setDeleting(null)
    setPages((prev) => prev.filter((x) => x.id !== p.id))
    await fetch(`/api/gtm/pages?id=${encodeURIComponent(p.id)}`, { method: "DELETE" }).catch(() => load())
  }

  return (
    <div style={{ fontFamily: font }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", flexWrap: "wrap", marginBottom: "20px" }}>
        <p style={{ margin: 0, fontSize: "13px", color: "rgba(0,0,0,0.6)", maxWidth: "640px", lineHeight: 1.6 }}>
          Upload a standalone HTML page (a case study, a microsite) and get a public link
          with social-preview tags and tracking — opens, unique viewers, and time spent reading.
        </p>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {pages.some((p) => p.pillars?.length) && (
            <select value={pillarFilter} onChange={(e) => setPillarFilter(e.target.value)} style={{ ...input, width: "auto", padding: "8px 10px", fontSize: "12px" }}>
              <option value="">All solutions</option>
              {PAGE_PILLARS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          )}
          {!creating && !editing && (
            <button onClick={() => setCreating(true)} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", background: ACCENT, color: "#fff", borderRadius: "6px", cursor: "pointer", border: "none" }}>
              ＋ Publish Page
            </button>
          )}
        </div>
      </div>

      {(creating || editing) && (
        <Editor
          key={editing?.id || "new"}
          initial={editing}
          onDone={() => { setCreating(false); setEditing(null); load() }}
          onCancel={() => { setCreating(false); setEditing(null) }}
        />
      )}

      {loading && pages.length === 0 ? (
        <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.45)" }}>Loading pages...</p>
      ) : pages.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: "48px 24px" }}>
          <p style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: NAVY }}>No published pages yet</p>
          <p style={{ margin: 0, fontSize: "13px", color: "rgba(0,0,0,0.5)" }}>Publish your first case study or microsite to get a trackable public link.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
          {pages.filter((p) => !pillarFilter || (p.pillars || []).includes(pillarFilter)).map((p) => (
            <div key={p.id} style={{ ...card, padding: "16px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                {/* OG thumb */}
                <div style={{ width: "150px", height: "79px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)", background: "#eef2fb", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {p.ogImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.ogImage} alt="OG preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)", textAlign: "center", padding: "4px" }}>No OG image</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: NAVY }}>{p.title}</p>
                  <a href={publicUrl(p.slug)} target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: ACCENT, textDecoration: "none", fontFamily: "monospace" }}>
                    /p/{p.slug}
                  </a>
                  {(p.pillars?.length ?? 0) > 0 && (
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "5px" }}>
                      {p.pillars!.map((pid) => {
                        const pl = PAGE_PILLARS.find((x) => x.id === pid)
                        return pl ? (
                          <span key={pid} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "9.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", padding: "2px 8px", borderRadius: "999px", background: "rgba(18,36,63,0.06)", color: NAVY, whiteSpace: "nowrap" }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: pl.color }} />{pl.label}
                          </span>
                        ) : null
                      })}
                    </div>
                  )}
                  {p.description && <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "rgba(0,0,0,0.55)", lineHeight: 1.5 }}>{p.description}</p>}
                </div>
                {/* stats */}
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  {[
                    ["Opens", p.views.toLocaleString()],
                    ["Unique", p.uniqueViewers.toLocaleString()],
                    ["Read Time", fmtTime(p.totalSeconds)],
                    ["Avg / Open", p.views ? fmtTime(Math.round(p.totalSeconds / p.views)) : "—"],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <p style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: NAVY, lineHeight: 1.1 }}>{v}</p>
                      <p style={{ margin: "2px 0 0 0", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(0,0,0,0.5)" }}>{l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "14px", flexWrap: "wrap" }}>
                <button onClick={() => copy(p)} style={{ padding: "6px 12px", fontSize: "11.5px", fontWeight: 700, background: copiedId === p.id ? "#0AA891" : NAVY, color: "#fff", borderRadius: "5px", cursor: "pointer", border: "none" }}>
                  {copiedId === p.id ? "✓ Copied" : "Copy Public Link"}
                </button>
                <button onClick={() => toggleDetail(p)} style={{ padding: "6px 12px", fontSize: "11.5px", fontWeight: 700, background: expanded === p.id ? NAVY : "rgba(18,36,63,0.08)", color: expanded === p.id ? "#fff" : NAVY, borderRadius: "5px", cursor: "pointer", border: "none" }}>
                  {expanded === p.id ? "Hide Details" : "Details"}
                </button>
                <a href={publicUrl(p.slug)} target="_blank" rel="noreferrer" style={{ padding: "6px 12px", fontSize: "11.5px", fontWeight: 600, background: "#fff", color: NAVY, border: "1px solid rgba(0,0,0,0.15)", borderRadius: "5px", textDecoration: "none" }}>
                  Open
                </a>
                <button onClick={() => setEditing(p)} style={{ padding: "6px 12px", fontSize: "11.5px", fontWeight: 600, background: "#fff", color: NAVY, border: "1px solid rgba(0,0,0,0.15)", borderRadius: "5px", cursor: "pointer" }}>
                  Edit
                </button>
                <button onClick={() => setDeleting(p)} style={{ padding: "6px 12px", fontSize: "11.5px", fontWeight: 600, background: "#fff", color: "#c62828", border: "1px solid rgba(198,40,40,0.3)", borderRadius: "5px", cursor: "pointer", marginLeft: "auto" }}>
                  Delete
                </button>
              </div>

              {expanded === p.id && (
                details[p.slug]
                  ? <PageDetail events={details[p.slug]} />
                  : <p style={{ margin: "14px 0 0 0", fontSize: "12px", color: "rgba(0,0,0,0.45)" }}>Loading details...</p>
              )}
            </div>
          ))}
        </div>
      )}

      {deleting && (
        <ConfirmModal
          title={`Unpublish "${deleting.title}"?`}
          message={`The public link /p/${deleting.slug} will stop working for everyone you've sent it to, and its ${deleting.views.toLocaleString()} tracked opens are deleted. This cannot be undone.`}
          onConfirm={() => remove(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

/* ------------------------------- Confirm modal ------------------------------ */

function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, background: "rgba(18,36,63,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, fontFamily: font }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "10px", padding: "24px", maxWidth: "440px", width: "90%", boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}>
        <p style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 700, color: NAVY }}>{title}</p>
        <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "rgba(0,0,0,0.65)", lineHeight: 1.55 }}>{message}</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "9px 16px", fontSize: "13px", fontWeight: 600, background: "#fff", color: NAVY, border: "1px solid rgba(0,0,0,0.2)", borderRadius: "6px", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ padding: "9px 16px", fontSize: "13px", fontWeight: 700, background: "#c62828", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Unpublish
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- Detail panel ------------------------------- */

const DEVICE_ICONS: Record<string, string> = { mobile: "📱", tablet: "📲", desktop: "💻", other: "❓" }

function PageDetail({ events }: { events: PageEvent[] }) {
  const views = events.filter((e) => e.event === "view")

  if (views.length === 0) {
    return <p style={{ margin: "14px 0 0 0", fontSize: "12.5px", color: "rgba(0,0,0,0.45)" }}>No opens yet. Details appear the first time someone opens the link.</p>
  }

  const days = 14
  const byDay = new Map<string, number>()
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    byDay.set(d.toISOString().slice(0, 10), 0)
  }
  for (const e of views) {
    const day = e.at.slice(0, 10)
    if (byDay.has(day)) byDay.set(day, (byDay.get(day) || 0) + 1)
  }
  const bars = [...byDay.entries()].reverse()
  const max = Math.max(1, ...bars.map(([, v]) => v))

  const breakdown = (pick: (e: PageEvent) => string) => {
    const mm = new Map<string, number>()
    for (const e of views) mm.set(pick(e), (mm.get(pick(e)) || 0) + 1)
    return [...mm.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  }
  const devices = breakdown((e) => e.device)
  const locations = breakdown((e) => (e.city ? `${e.city}${e.region ? `, ${e.region}` : ""}` : e.country || "—"))
  const referrers = breakdown((e) => e.referrer || "direct / none")

  const colHead: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(0,0,0,0.45)", marginBottom: "8px" }

  return (
    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <span style={colHead}>Opens — last {days} days</span>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "54px", marginBottom: "4px" }}>
        {bars.map(([day, v]) => (
          <div key={day} title={`${day}: ${v} open${v === 1 ? "" : "s"}`} style={{ flex: 1, height: `${Math.max(4, (v / max) * 100)}%`, background: v ? ACCENT : "rgba(0,0,0,0.08)", borderRadius: "2px 2px 0 0" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "rgba(0,0,0,0.4)", marginBottom: "16px" }}>
        <span>{bars[0][0].slice(5)}</span>
        <span>{bars[bars.length - 1][0].slice(5)}</span>
      </div>
      <div style={{ display: "flex", gap: "36px", flexWrap: "wrap" }}>
        <div>
          <span style={colHead}>Devices</span>
          {devices.map(([d, v]) => (
            <p key={d} style={{ margin: "0 0 4px 0", fontSize: "12px", color: NAVY }}>
              {DEVICE_ICONS[d] || ""} <span style={{ textTransform: "capitalize" }}>{d}</span>
              <span style={{ color: "rgba(0,0,0,0.45)" }}> — {v} ({Math.round((v / views.length) * 100)}%)</span>
            </p>
          ))}
        </div>
        <div>
          <span style={colHead}>Locations</span>
          {locations.map(([c, v]) => (
            <p key={c} style={{ margin: "0 0 4px 0", fontSize: "12px", color: NAVY }}>
              {c}<span style={{ color: "rgba(0,0,0,0.45)" }}> — {v}</span>
            </p>
          ))}
        </div>
        <div>
          <span style={colHead}>Came From</span>
          {referrers.map(([r, v]) => (
            <p key={r} style={{ margin: "0 0 4px 0", fontSize: "12px", color: NAVY }}>
              {r}<span style={{ color: "rgba(0,0,0,0.45)" }}> — {v}</span>
            </p>
          ))}
        </div>
        <div>
          <span style={colHead}>Recent Opens</span>
          {views.slice(0, 6).map((e, i) => (
            <p key={i} style={{ margin: "0 0 4px 0", fontSize: "12px", color: "rgba(0,0,0,0.6)" }}>
              {new Date(e.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              {" · "}{DEVICE_ICONS[e.device] || e.device}
              {e.city ? ` · ${e.city}` : e.country ? ` · ${e.country}` : ""}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- Editor ---------------------------------- */

function Editor({ initial, onDone, onCancel }: { initial: PageWithStats | null; onDone: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState(initial?.title || "")
  const [slug, setSlug] = useState(initial?.slug || "")
  const [description, setDescription] = useState(initial?.description || "")
  const [ogImage, setOgImage] = useState(initial?.ogImage || "")
  const [pillars, setPillars] = useState<string[]>(initial?.pillars || [])
  const [htmlFile, setHtmlFile] = useState<{ name: string; content: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const onFile = async (f: File | undefined) => {
    if (!f) return
    if (!/\.html?$/i.test(f.name)) return setError("Pick a .html file")
    const content = await f.text()
    setHtmlFile({ name: f.name, content })
    if (!title) setTitle(f.name.replace(/\.html?$/i, ""))
    setError("")
  }

  const save = async () => {
    setError("")
    if (!title.trim()) return setError("Give the page a title.")
    if (!initial && !htmlFile) return setError("Upload the HTML file.")
    setSaving(true)
    try {
      const res = await fetch("/api/gtm/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initial?.id,
          slug: slug || undefined,
          title,
          description,
          ogImage: ogImage || undefined,
          pillars,
          html: htmlFile?.content,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ ...card, marginBottom: "24px", borderTop: `3px solid ${ACCENT}` }}>
      <p style={{ margin: "0 0 18px 0", fontSize: "15px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em", color: NAVY }}>
        {initial ? `Edit Page — ${initial.title}` : "Publish Page"}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "14px" }}>
        <div>
          <label style={label}>Title</label>
          <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Case study title" />
        </div>
        <div>
          <label style={label}>Public URL slug {initial && "(locked — links are out in the wild)"}</label>
          <input
            style={{ ...input, background: initial ? "#f5f5f5" : "#fff" }}
            value={initial ? initial.slug : slug || slugify(title)}
            onChange={(e) => setSlug(slugify(e.target.value))}
            disabled={!!initial}
            placeholder="case-study-slug"
          />
        </div>
      </div>
      <div style={{ marginBottom: "14px" }}>
        <label style={label}>Description (used in link previews)</label>
        <textarea style={{ ...input, minHeight: "56px", resize: "vertical" }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="One or two sentences shown in social previews..." />
      </div>
      <div style={{ marginBottom: "14px" }}>
        <label style={label}>Solutions</label>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {PAGE_PILLARS.map((p) => {
            const on = pillars.includes(p.id)
            return (
              <button
                key={p.id}
                onClick={() => setPillars(on ? pillars.filter((x) => x !== p.id) : [...pillars, p.id])}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px",
                  fontSize: "11.5px", fontWeight: on ? 700 : 500, borderRadius: "999px", cursor: "pointer",
                  background: on ? NAVY : "#fff", color: on ? "#fff" : NAVY,
                  border: on ? `1px solid ${NAVY}` : "1px solid rgba(0,0,0,0.18)",
                }}
              >
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                {p.label}
                {on && <span style={{ fontSize: "10px" }}>✓</span>}
              </button>
            )
          })}
        </div>
        <p style={{ margin: "6px 0 0 0", fontSize: "11px", color: "rgba(0,0,0,0.45)" }}>Tag one or more solutions to sort and filter the library.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "16px" }}>
        <div>
          <label style={label}>HTML file {initial && "(leave empty to keep current)"}</label>
          <input ref={fileRef} type="file" accept=".html,.htm" onChange={(e) => onFile(e.target.files?.[0])} style={{ fontSize: "12.5px" }} />
          {htmlFile && <p style={{ margin: "6px 0 0 0", fontSize: "11.5px", color: "#00753a" }}>✓ {htmlFile.name} ({Math.round(htmlFile.content.length / 1024)}KB)</p>}
        </div>
        <div>
          <label style={label}>OG image URL (optional — 1200×630 for best previews)</label>
          <input style={input} value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://…/preview.jpg" />
          {ogImage && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "8px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ogImage} alt="OG" style={{ width: "76px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1px solid rgba(0,0,0,0.12)" }} />
              <button onClick={() => setOgImage("")} style={{ padding: "8px 10px", fontSize: "12px", background: "none", border: "none", color: "#c62828", cursor: "pointer" }}>
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
      {error && <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#c62828" }}>{error}</p>}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={save} disabled={saving} style={{ padding: "10px 22px", fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", background: "#0AA891", color: "#fff", borderRadius: "6px", cursor: saving ? "wait" : "pointer", border: "none" }}>
          {saving ? "Publishing..." : initial ? "Save Changes" : "Publish"}
        </button>
        <button onClick={onCancel} style={{ padding: "10px 18px", fontSize: "13px", fontWeight: 600, background: "#fff", color: NAVY, border: "1px solid rgba(0,0,0,0.2)", borderRadius: "6px", cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  )
}
