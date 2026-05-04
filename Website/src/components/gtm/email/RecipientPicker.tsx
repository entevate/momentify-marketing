"use client"

/**
 * Recipient picker for the email ComposePane.
 *
 * Supports three recipient kinds (matches EmailRecipient):
 *   - audience: pick an entire Resend audience
 *   - contact:  pick a specific contact within an audience
 *   - raw:      type any email address
 *
 * Audiences and contacts are loaded lazily from the auth-gated proxy
 * routes so we never expose RESEND_API_KEY client-side.
 */

import { useEffect, useState } from "react"
import { Plus, X } from "lucide-react"
import type { EmailRecipient, ResendAudience, ResendContact } from "@/lib/gtm/email-types"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface Props {
  recipients: EmailRecipient[]
  onChange: (recipients: EmailRecipient[]) => void
}

export default function RecipientPicker({ recipients, onChange }: Props) {
  const [audiences, setAudiences] = useState<ResendAudience[]>([])
  const [audiencesLoaded, setAudiencesLoaded] = useState(false)
  const [contactsByAudience, setContactsByAudience] = useState<Record<string, ResendContact[]>>({})
  const [rawInput, setRawInput] = useState("")
  const [pickAudienceId, setPickAudienceId] = useState<string>("")

  useEffect(() => {
    fetch("/api/gtm/email/audiences")
      .then((r) => r.json())
      .then((d) => setAudiences(d.audiences || []))
      .catch(() => setAudiences([]))
      .finally(() => setAudiencesLoaded(true))
  }, [])

  // When the user picks an audience to drill into, lazy-load its contacts.
  useEffect(() => {
    if (!pickAudienceId || contactsByAudience[pickAudienceId]) return
    fetch(`/api/gtm/email/audiences/${pickAudienceId}/contacts`)
      .then((r) => r.json())
      .then((d) => setContactsByAudience((prev) => ({ ...prev, [pickAudienceId]: d.contacts || [] })))
      .catch(() => setContactsByAudience((prev) => ({ ...prev, [pickAudienceId]: [] })))
  }, [pickAudienceId, contactsByAudience])

  function add(r: EmailRecipient) {
    // Dedupe within the recipients list so the same audience/contact/email
    // doesn't appear twice.
    const key = recipientKey(r)
    if (recipients.some((x) => recipientKey(x) === key)) return
    onChange([...recipients, r])
  }

  function remove(idx: number) {
    onChange(recipients.filter((_, i) => i !== idx))
  }

  function addRaw() {
    const email = rawInput.trim().toLowerCase()
    if (!/.+@.+\..+/.test(email)) return
    add({ kind: "raw", email })
    setRawInput("")
  }

  return (
    <div style={{ fontFamily: font, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Selected recipients (chips) */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {recipients.length === 0 && (
          <span style={{ fontSize: 12, color: "var(--gtm-text-faint)" }}>No recipients yet.</span>
        )}
        {recipients.map((r, i) => (
          <span key={recipientKey(r)} style={chip}>
            {recipientLabel(r, audiences, contactsByAudience)}
            <button type="button" onClick={() => remove(i)} style={chipX} aria-label="Remove">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      {/* Pick an audience (entire) or a specific contact within one */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <select
          value={pickAudienceId}
          onChange={(e) => setPickAudienceId(e.target.value)}
          style={selectStyle}
          disabled={!audiencesLoaded}
        >
          <option value="">{audiencesLoaded ? "Pick audience..." : "Loading audiences..."}</option>
          {audiences.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        {pickAudienceId && (
          <button
            type="button"
            onClick={() => add({ kind: "audience", audienceId: pickAudienceId })}
            style={addBtn}
          >
            <Plus size={12} /> Add entire audience
          </button>
        )}
      </div>

      {/* Specific contacts within the selected audience */}
      {pickAudienceId && contactsByAudience[pickAudienceId] && contactsByAudience[pickAudienceId].length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {contactsByAudience[pickAudienceId].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => add({ kind: "contact", audienceId: pickAudienceId, contactId: c.id })}
              style={contactChip}
              title={c.email}
            >
              <Plus size={10} /> {c.email}
            </button>
          ))}
        </div>
      )}

      {/* Raw email */}
      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="email"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addRaw()
            }
          }}
          placeholder="Or type a raw email and press Enter..."
          style={input}
        />
        <button type="button" onClick={addRaw} style={addBtn}>
          <Plus size={12} /> Add
        </button>
      </div>
    </div>
  )
}

// ─── helpers ───────────────────────────────────────────────────────────

function recipientKey(r: EmailRecipient): string {
  if (r.kind === "raw") return `raw:${r.email.toLowerCase()}`
  if (r.kind === "audience") return `audience:${r.audienceId}`
  return `contact:${r.audienceId}:${r.contactId}`
}

function recipientLabel(
  r: EmailRecipient,
  audiences: ResendAudience[],
  contactsByAudience: Record<string, ResendContact[]>,
): string {
  if (r.kind === "raw") return r.email
  const aud = audiences.find((a) => a.id === r.audienceId)
  if (r.kind === "audience") return `Audience: ${aud?.name || r.audienceId}`
  const c = (contactsByAudience[r.audienceId] || []).find((x) => x.id === r.contactId)
  return c ? c.email : `Contact ${r.contactId}`
}

// ─── styles ────────────────────────────────────────────────────────────

const chip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "5px 10px 5px 12px",
  background: "rgba(0,187,165,0.10)",
  color: "#0AA891",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
}

const chipX: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 16,
  height: 16,
  borderRadius: "50%",
  border: "none",
  background: "rgba(0,187,165,0.18)",
  color: "#0AA891",
  cursor: "pointer",
  padding: 0,
}

const contactChip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 9px",
  fontSize: 11,
  fontWeight: 500,
  border: "1px solid var(--gtm-border)",
  borderRadius: 999,
  background: "#fff",
  color: "var(--gtm-text-secondary)",
  cursor: "pointer",
}

const selectStyle: React.CSSProperties = {
  height: 34,
  padding: "0 10px",
  fontSize: 13,
  fontFamily: "inherit",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  background: "#fff",
  color: "var(--gtm-text-primary)",
  minWidth: 200,
}

const input: React.CSSProperties = {
  flex: 1,
  height: 34,
  padding: "0 12px",
  fontSize: 13,
  fontFamily: "inherit",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  background: "#fff",
  color: "var(--gtm-text-primary)",
}

const addBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  height: 34,
  padding: "0 12px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "inherit",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  background: "#fff",
  color: "var(--gtm-text-secondary)",
  cursor: "pointer",
}
