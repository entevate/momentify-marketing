"use client"

/**
 * AudiencesTab — manage Resend audiences and contacts.
 *
 * Resend is the source of truth (we never persist contacts in our KV).
 * All calls go through the auth-gated /api/gtm/email/audiences/* proxy.
 */

import { useEffect, useRef, useState } from "react"
import { Plus, Trash2, Users, ChevronRight, Upload } from "lucide-react"
import type { ResendAudience, ResendContact } from "@/lib/gtm/email-types"

const font = "'Inter', system-ui, -apple-system, sans-serif"

export default function AudiencesTab() {
  const [audiences, setAudiences] = useState<ResendAudience[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [contacts, setContacts] = useState<ResendContact[]>([])
  const [loadingAudiences, setLoadingAudiences] = useState(true)
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [newAudienceName, setNewAudienceName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newFirstName, setNewFirstName] = useState("")
  const [newLastName, setNewLastName] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function refreshAudiences() {
    setLoadingAudiences(true)
    try {
      const res = await fetch("/api/gtm/email/audiences")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load audiences")
      setAudiences(data.audiences || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed")
    } finally {
      setLoadingAudiences(false)
    }
  }

  async function refreshContacts(id: string) {
    setLoadingContacts(true)
    setContacts([])
    try {
      const res = await fetch(`/api/gtm/email/audiences/${id}/contacts`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load contacts")
      setContacts(data.contacts || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed")
    } finally {
      setLoadingContacts(false)
    }
  }

  useEffect(() => { refreshAudiences() }, [])
  useEffect(() => { if (activeId) refreshContacts(activeId) }, [activeId])

  async function createAudience() {
    if (!newAudienceName.trim()) return
    try {
      const res = await fetch("/api/gtm/email/audiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAudienceName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Create failed")
      setNewAudienceName("")
      await refreshAudiences()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed")
    }
  }

  async function deleteAudience(id: string) {
    if (!confirm("Delete this audience? Contacts within it will also be deleted in Resend.")) return
    try {
      const res = await fetch(`/api/gtm/email/audiences/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed")
      if (activeId === id) setActiveId(null)
      await refreshAudiences()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed")
    }
  }

  async function addContact() {
    if (!activeId || !newEmail.trim()) return
    try {
      const res = await fetch(`/api/gtm/email/audiences/${activeId}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim(),
          firstName: newFirstName.trim() || undefined,
          lastName: newLastName.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Add failed")
      setNewEmail(""); setNewFirstName(""); setNewLastName("")
      await refreshContacts(activeId)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Add failed")
    }
  }

  // ─── CSV import ────────────────────────────────────────────────────
  const importInputRef = useRef<HTMLInputElement | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ added: number; skipped: number; failed: { email: string; error: string }[]; total: number } | null>(null)

  async function handleImportFile(file: File) {
    if (!activeId) return
    setImporting(true)
    setImportResult(null)
    setError(null)
    try {
      const text = await file.text()
      const parsed = parseCsvContacts(text)
      if (parsed.length === 0) {
        throw new Error("CSV had no recognizable contacts. Required column: email (firstName, lastName optional).")
      }
      const res = await fetch(`/api/gtm/email/audiences/${activeId}/contacts/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacts: parsed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Import failed")
      setImportResult(data)
      await refreshContacts(activeId)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed")
    } finally {
      setImporting(false)
      if (importInputRef.current) importInputRef.current.value = "" // allow re-uploading the same file
    }
  }

  async function removeContact(cid: string) {
    if (!activeId) return
    try {
      const res = await fetch(`/api/gtm/email/audiences/${activeId}/contacts/${cid}`, { method: "DELETE" })
      if (!res.ok) throw new Error((await res.json()).error || "Remove failed")
      await refreshContacts(activeId)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remove failed")
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, fontFamily: font, alignItems: "start" }}>
      {/* Audiences list */}
      <section style={panel}>
        <div style={panelHeader}>
          <Users size={14} /> Audiences ({audiences.length})
        </div>
        <div style={{ display: "flex", gap: 6, padding: 12, borderBottom: "1px solid var(--gtm-border)" }}>
          <input
            value={newAudienceName}
            onChange={(e) => setNewAudienceName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") createAudience() }}
            placeholder="New audience name..."
            style={input}
          />
          <button type="button" onClick={createAudience} style={addBtn}><Plus size={12} /></button>
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: 480, overflow: "auto" }}>
          {loadingAudiences && <li style={empty}>Loading...</li>}
          {!loadingAudiences && audiences.length === 0 && <li style={empty}>No audiences yet.</li>}
          {audiences.map((a) => {
            const active = activeId === a.id
            return (
              <li
                key={a.id}
                onClick={() => setActiveId(a.id)}
                style={{
                  ...listItem,
                  background: active ? "rgba(0,187,165,0.06)" : "transparent",
                  color: active ? "#0AA891" : "var(--gtm-text-primary)",
                }}
              >
                <span style={{ flex: 1, fontWeight: active ? 600 : 500 }}>{a.name}</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); deleteAudience(a.id) }} style={iconOnly} title="Delete audience">
                  <Trash2 size={12} />
                </button>
                <ChevronRight size={12} style={{ color: "var(--gtm-text-faint)" }} />
              </li>
            )
          })}
        </ul>
      </section>

      {/* Contacts within selected audience */}
      <section style={panel}>
        <div style={panelHeader}>
          {activeId
            ? <>Contacts in {audiences.find((a) => a.id === activeId)?.name || "audience"} ({contacts.length})</>
            : <>Pick an audience to see contacts</>}
        </div>
        {activeId && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px auto auto", gap: 6, padding: 12, borderBottom: "1px solid var(--gtm-border)" }}>
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@..." style={input} type="email" />
              <input value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} placeholder="First name" style={input} />
              <input value={newLastName} onChange={(e) => setNewLastName(e.target.value)} placeholder="Last name" style={input} />
              <button type="button" onClick={addContact} style={addBtn}><Plus size={12} /> Add</button>
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                disabled={importing}
                style={{ ...addBtn, background: "var(--gtm-bg-card, #fff)", color: "var(--gtm-text-primary)", border: "1px solid var(--gtm-border)", opacity: importing ? 0.6 : 1 }}
                title="Import contacts from a CSV file (columns: email, firstName, lastName)"
              >
                <Upload size={12} /> {importing ? "Importing..." : "Import CSV"}
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImportFile(file)
                }}
              />
            </div>
            {importResult && (
              <div style={{ padding: "8px 14px", fontSize: 12, color: "var(--gtm-text-secondary)", background: "var(--gtm-bg-page)", borderBottom: "1px solid var(--gtm-border)" }}>
                Imported {importResult.added} of {importResult.total}
                {importResult.skipped > 0 && ` · ${importResult.skipped} skipped (duplicates)`}
                {importResult.failed.length > 0 && (
                  <>
                    {" "}· <strong style={{ color: "#D43D1A" }}>{importResult.failed.length} failed</strong>
                    <details style={{ marginTop: 4 }}>
                      <summary style={{ cursor: "pointer", fontSize: 11, color: "var(--gtm-text-faint)" }}>Show failures</summary>
                      <ul style={{ margin: "4px 0 0 16px", padding: 0, fontSize: 11 }}>
                        {importResult.failed.slice(0, 20).map((f, i) => (
                          <li key={i}>{f.email}: {f.error}</li>
                        ))}
                        {importResult.failed.length > 20 && <li>...and {importResult.failed.length - 20} more</li>}
                      </ul>
                    </details>
                  </>
                )}
              </div>
            )}
            {loadingContacts && <div style={empty}>Loading...</div>}
            {!loadingContacts && contacts.length === 0 && <div style={empty}>No contacts in this audience yet.</div>}
            {contacts.length > 0 && (
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Email</th>
                    <th style={th}>Name</th>
                    <th style={th}>Status</th>
                    <th style={th} />
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id}>
                      <td style={td}>{c.email}</td>
                      <td style={td}>{[c.firstName, c.lastName].filter(Boolean).join(" ") || "-"}</td>
                      <td style={td}>
                        {c.unsubscribed
                          ? <span style={{ color: "#D43D1A", fontWeight: 600 }}>Unsubscribed</span>
                          : <span style={{ color: "#0AA891" }}>Active</span>}
                      </td>
                      <td style={td}>
                        <button type="button" onClick={() => removeContact(c.id)} style={iconOnly} title="Remove">
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </section>

      {error && <div style={errBanner}>{error}</div>}
    </div>
  )
}

// styles
const panel: React.CSSProperties = { background: "#fff", border: "1px solid var(--gtm-border)", borderRadius: 8, overflow: "hidden" }
const panelHeader: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "var(--gtm-text-secondary)", background: "var(--gtm-bg-page)", borderBottom: "1px solid var(--gtm-border)" }
const empty: React.CSSProperties = { padding: 24, textAlign: "center", color: "var(--gtm-text-faint)", fontSize: 13, fontFamily: font }
const listItem: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", cursor: "pointer", fontSize: 13, borderBottom: "1px solid var(--gtm-border)" }
const input: React.CSSProperties = { height: 30, padding: "0 10px", fontSize: 12, fontFamily: font, border: "1px solid var(--gtm-border)", borderRadius: 6, background: "#fff" }
const addBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 4, height: 30, padding: "0 10px", fontSize: 12, fontWeight: 600, fontFamily: font, border: "none", borderRadius: 6, background: "#00BBA5", color: "#fff", cursor: "pointer" }
const iconOnly: React.CSSProperties = { width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "none", background: "transparent", color: "var(--gtm-text-faint)", cursor: "pointer", borderRadius: 4 }
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontFamily: font }
const th: React.CSSProperties = { textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "var(--gtm-text-faint)", letterSpacing: "0.04em", textTransform: "uppercase", background: "var(--gtm-bg-page)", borderBottom: "1px solid var(--gtm-border)" }
const td: React.CSSProperties = { padding: "10px 14px", fontSize: 13, color: "var(--gtm-text-primary)", borderBottom: "1px solid var(--gtm-border)" }
const errBanner: React.CSSProperties = { gridColumn: "1 / -1", padding: 12, background: "rgba(212,61,26,0.06)", color: "#D43D1A", fontSize: 12, borderRadius: 6, fontFamily: font }

// ─── CSV parsing ───────────────────────────────────────────────────────

/**
 * Parse a CSV string into a contacts array. Detects column headers in
 * the first row using flexible name matching (email / firstName / first_name
 * / "First Name", etc.). If no headers are detected, falls back to
 * positional: column 0 = email, 1 = firstName, 2 = lastName.
 *
 * Supports double-quoted fields (handles commas inside names like
 * "Smith, Jr."). Skips blank lines and empty-email rows.
 *
 * Intentionally dependency-free — full CSV libraries (papaparse, etc.)
 * are 30-50KB gzipped and overkill for what's effectively a 3-column
 * import format.
 */
function parseCsvContacts(text: string): Array<{ email: string; firstName?: string; lastName?: string }> {
  const lines = text.replace(/\r\n?/g, "\n").split("\n").filter((l) => l.trim().length > 0)
  if (lines.length === 0) return []

  const firstRow = parseCsvRow(lines[0])
  const looksLikeHeader = firstRow.some((c) => /email|first|last|name/i.test(c))

  let emailIdx = 0
  let firstIdx = 1
  let lastIdx = 2
  let dataStart = 0

  if (looksLikeHeader) {
    dataStart = 1
    emailIdx = firstRow.findIndex((c) => /^email$|^email_address$|^e[-_ ]?mail$/i.test(c.trim()))
    firstIdx = firstRow.findIndex((c) => /^first[-_ ]?name$|^first$|^fname$|^given[-_ ]?name$/i.test(c.trim()))
    lastIdx = firstRow.findIndex((c) => /^last[-_ ]?name$|^last$|^lname$|^surname$|^family[-_ ]?name$/i.test(c.trim()))
    if (emailIdx === -1) emailIdx = 0 // fallback to col 0 if no obvious email header
  }

  const out: Array<{ email: string; firstName?: string; lastName?: string }> = []
  for (let i = dataStart; i < lines.length; i++) {
    const cols = parseCsvRow(lines[i])
    const email = (cols[emailIdx] || "").trim()
    if (!email) continue
    out.push({
      email,
      firstName: firstIdx >= 0 ? (cols[firstIdx] || "").trim() || undefined : undefined,
      lastName:  lastIdx  >= 0 ? (cols[lastIdx]  || "").trim() || undefined : undefined,
    })
  }
  return out
}

/**
 * Parse a single CSV line into fields. Handles double-quoted values
 * with embedded commas + escaped double quotes ("""). Not RFC 4180
 * complete (no multi-line quoted fields), but covers Excel/Sheets
 * exports + Hubspot/Mailchimp dumps which is all we need.
 */
function parseCsvRow(line: string): string[] {
  const out: string[] = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        cur += ch
      }
    } else {
      if (ch === ",") {
        out.push(cur)
        cur = ""
      } else if (ch === '"' && cur === "") {
        inQuotes = true
      } else {
        cur += ch
      }
    }
  }
  out.push(cur)
  return out
}
