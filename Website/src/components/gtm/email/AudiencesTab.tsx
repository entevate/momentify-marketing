"use client"

/**
 * AudiencesTab — manage Resend audiences and contacts.
 *
 * Resend is the source of truth (we never persist contacts in our KV).
 * All calls go through the auth-gated /api/gtm/email/audiences/* proxy.
 */

import { useEffect, useState } from "react"
import { Plus, Trash2, Users, ChevronRight } from "lucide-react"
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px auto", gap: 6, padding: 12, borderBottom: "1px solid var(--gtm-border)" }}>
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@..." style={input} type="email" />
              <input value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} placeholder="First name" style={input} />
              <input value={newLastName} onChange={(e) => setNewLastName(e.target.value)} placeholder="Last name" style={input} />
              <button type="button" onClick={addContact} style={addBtn}><Plus size={12} /> Add</button>
            </div>
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
