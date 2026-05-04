"use client"

/**
 * ComposePane - the right-hand pane in the Drafts tab where the user
 * authors / edits a single EmailDraft. Wraps the TipTap editor, recipient
 * picker, schedule dialog, raw HTML toggle, and action buttons.
 *
 * Persistence model: every field change debounce-saves the draft via
 * PATCH /api/gtm/email/drafts/[id]. Manual buttons fire send/schedule
 * actions against the same draft.
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { Save, Send, CalendarPlus, Code2, Eye, Check, AlertCircle } from "lucide-react"
import TipTapEditor from "./TipTapEditor"
import RecipientPicker from "./RecipientPicker"
import ScheduleDialog from "./ScheduleDialog"
import type { EmailDraft, EmailRecipient } from "@/lib/gtm/email-types"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface Props {
  draft: EmailDraft
  onDraftChange: (draft: EmailDraft) => void
  onAfterSend?: () => void
  onAfterSchedule?: () => void
}

export default function ComposePane({ draft, onDraftChange, onAfterSend, onAfterSchedule }: Props) {
  // Local working copy. Mirrors prop on draft.id change so opening a
  // different draft swaps content.
  const [local, setLocal] = useState<EmailDraft>(draft)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)
  const [busy, setBusy] = useState<"send" | "schedule" | "save" | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset local state whenever the parent swaps to a different draft.
  useEffect(() => {
    setLocal(draft)
    setSavedAt(null)
    setError(null)
  }, [draft.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced PATCH on any change.
  function update(patch: Partial<EmailDraft>) {
    const merged = { ...local, ...patch, updatedAt: new Date().toISOString() }
    setLocal(merged)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => savePatch(merged, patch), 350)
  }

  async function savePatch(merged: EmailDraft, patch: Partial<EmailDraft>) {
    try {
      setBusy("save")
      const res = await fetch(`/api/gtm/email/drafts/${merged.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Save failed")
      const data = await res.json()
      onDraftChange(data.draft)
      setSavedAt(new Date().toISOString())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setBusy(null)
    }
  }

  async function handleSendNow() {
    if (busy) return
    if (!confirm(`Send "${local.subject}" to ${local.recipients.length} recipient group(s) now?`)) return
    setBusy("send")
    setError(null)
    try {
      const res = await fetch(`/api/gtm/email/drafts/${local.id}/send`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Send failed")
      alert(`Sent ${data.sentCount} of ${data.total}${data.failedCount ? ` (${data.failedCount} failed)` : ""}.`)
      onAfterSend?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed")
    } finally {
      setBusy(null)
    }
  }

  async function handleScheduleConfirm(params: { date: string; timeSlot?: "morning" | "afternoon"; autoSend: boolean }) {
    setBusy("schedule")
    setError(null)
    try {
      const res = await fetch(`/api/gtm/email/drafts/${local.id}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Schedule failed")
      onDraftChange(data.draft)
      setShowSchedule(false)
      onAfterSchedule?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Schedule failed")
    } finally {
      setBusy(null)
    }
  }

  // Build the preview HTML by applying the wrapper client-side. We can't
  // call applyEmailWrapper() directly because it's a server module that
  // imports pillar-palettes (also fine for client). Mounting in an
  // iframe via srcdoc isolates email styling from the host page.
  const previewSrc = useMemo(() => {
    if (local.rawHtmlMode) return local.bodyHtml
    return wrapForPreview(local.bodyHtml, {
      solution: local.solution,
      ctaText: local.ctaText,
      ctaHref: local.ctaHref,
      headerTag: local.headerTag,
    })
  }, [local.bodyHtml, local.rawHtmlMode, local.solution, local.ctaText, local.ctaHref, local.headerTag])

  return (
    <div style={wrap}>
      {/* Top action bar */}
      <div style={topBar}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gtm-text-faint)" }}>
            {local.status}
          </span>
          {savedAt && (
            <span style={{ fontSize: 11, color: "var(--gtm-text-faint)", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Check size={11} /> Saved
            </span>
          )}
          {error && (
            <span style={{ fontSize: 11, color: "#D43D1A", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <AlertCircle size={11} /> {error}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => update({ rawHtmlMode: !local.rawHtmlMode })}
            style={{
              ...iconBtn,
              background: local.rawHtmlMode ? "rgba(0,187,165,0.10)" : "#fff",
              color: local.rawHtmlMode ? "#0AA891" : "var(--gtm-text-secondary)",
            }}
            title={local.rawHtmlMode ? "Raw HTML mode (click for branded wrapper)" : "Branded wrapper (click for raw HTML)"}
          >
            {local.rawHtmlMode ? <Code2 size={13} /> : <Eye size={13} />}
            {local.rawHtmlMode ? "Raw HTML" : "Branded"}
          </button>
          <button type="button" onClick={() => savePatch(local, local)} style={iconBtn} disabled={busy === "save"}>
            <Save size={13} />
            {busy === "save" ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setShowSchedule(true)}
            style={{ ...iconBtn, background: "rgba(0,187,165,0.10)", color: "#0AA891", borderColor: "transparent" }}
            disabled={!!busy || local.recipients.length === 0}
          >
            <CalendarPlus size={13} /> Schedule
          </button>
          <button
            type="button"
            onClick={handleSendNow}
            style={{ ...iconBtn, background: "#00BBA5", color: "#fff", borderColor: "transparent" }}
            disabled={!!busy || local.recipients.length === 0}
          >
            <Send size={13} /> {busy === "send" ? "Sending..." : "Send Now"}
          </button>
        </div>
      </div>

      {/* Body: 2-column compose + preview */}
      <div style={twoColumn}>
        <div style={{ ...column, borderRight: "1px solid var(--gtm-border)" }}>
          <details open style={{ fontFamily: font }}>
            <summary style={{ cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gtm-text-faint)", padding: "0 0 6px 0" }}>
              Sender + reply-to
            </summary>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
              <input
                type="email"
                value={local.fromEmail || ""}
                onChange={(e) => update({ fromEmail: e.target.value || undefined })}
                placeholder="From (default: Momentify <hello@momentifyapp.com>)"
                style={subjectInput}
              />
              <input
                type="email"
                value={local.replyTo || ""}
                onChange={(e) => update({ replyTo: e.target.value || undefined })}
                placeholder="Reply-To (optional)"
                style={subjectInput}
              />
            </div>
          </details>

          <Field label="Brand context">
            <select
              value={local.solution || ""}
              onChange={(e) => update({ solution: e.target.value || undefined })}
              style={subjectInput}
            >
              <option value="">General Momentify</option>
              <option value="trade-shows">Trade Shows (Violet)</option>
              <option value="recruiting">Technical Recruiting (Teal)</option>
              <option value="field-sales">Field Sales (Amber)</option>
              <option value="facilities">Facilities (Indigo)</option>
              <option value="events-venues">Events & Venues (Crimson)</option>
            </select>
            <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "var(--gtm-text-faint)", fontFamily: font, lineHeight: 1.45 }}>
              Drives the header gradient + brand-name tag in the email shell. Pick the solution this email represents, or General Momentify for cross-pillar sends.
            </p>
          </Field>

          <Field label="Recipients">
            <RecipientPicker
              recipients={local.recipients}
              onChange={(recipients: EmailRecipient[]) => update({ recipients })}
            />
          </Field>

          <Field label="Subject">
            <input
              type="text"
              value={local.subject}
              onChange={(e) => update({ subject: e.target.value })}
              placeholder="Subject..."
              style={subjectInput}
            />
          </Field>

          <Field label="Header tag (optional)">
            <input
              type="text"
              value={local.headerTag || ""}
              onChange={(e) => update({ headerTag: e.target.value || undefined })}
              placeholder="e.g. Q4 Campaign · Field Sales · ROX Audit"
              maxLength={48}
              style={subjectInput}
            />
            <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "var(--gtm-text-faint)", fontFamily: font, lineHeight: 1.45 }}>
              Right-aligned uppercase eyebrow in the colored header bar. Leave blank to show only the logo.
            </p>
          </Field>

          <Field label={local.rawHtmlMode ? "HTML body (raw)" : "Body"}>
            {local.rawHtmlMode ? (
              <textarea
                value={local.bodyHtml}
                onChange={(e) => update({ bodyHtml: e.target.value })}
                placeholder="<html>...</html>"
                style={rawTextarea}
              />
            ) : (
              <TipTapEditor
                initialHtml={local.bodyHtml}
                onChange={(html) => update({ bodyHtml: html })}
                placeholder="Write your email..."
              />
            )}
          </Field>

          <Field label="CTA button (optional)">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input
                type="text"
                value={local.ctaText || ""}
                onChange={(e) => update({ ctaText: e.target.value || undefined })}
                placeholder="Button text (e.g. Book a Demo)"
                style={subjectInput}
              />
              <input
                type="url"
                value={local.ctaHref || ""}
                onChange={(e) => update({ ctaHref: e.target.value || undefined })}
                placeholder="https://..."
                style={subjectInput}
              />
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "var(--gtm-text-faint)", fontFamily: font, lineHeight: 1.45 }}>
              Renders below the body in the brand color. Both fields required to show.
            </p>
          </Field>

        </div>

        {/* Preview */}
        <div style={column}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gtm-text-faint)", padding: "10px 12px 6px 12px" }}>
            Preview {local.rawHtmlMode ? "(raw)" : "(branded)"}
          </div>

          {/* Envelope header — From / To / Subject — mimics how the
              email will surface in the recipient's inbox preview. The
              actual email body is rendered in the iframe below. */}
          <div style={envelope}>
            <EnvelopeRow label="From" value={local.fromEmail || `Momentify <${process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || "hello@momentifyapp.com"}>`} />
            <EnvelopeRow label="To" value={summarizeRecipients(local.recipients)} />
            {local.replyTo && <EnvelopeRow label="Reply-To" value={local.replyTo} />}
            <EnvelopeRow label="Subject" value={local.subject || <em style={{ color: "var(--gtm-text-faint)" }}>(no subject)</em>} bold />
          </div>

          <iframe
            title="Email preview"
            srcDoc={previewSrc}
            sandbox=""
            style={{
              flex: 1,
              width: "100%",
              border: "1px solid var(--gtm-border)",
              borderRadius: 6,
              background: "#F4F5F8",
            }}
          />
        </div>
      </div>

      {showSchedule && (
        <ScheduleDialog
          defaultDate={local.scheduledFor?.slice(0, 10)}
          onCancel={() => setShowSchedule(false)}
          onConfirm={handleScheduleConfirm}
          busy={busy === "schedule"}
        />
      )}
    </div>
  )
}

// ─── helpers ───────────────────────────────────────────────────────────

/**
 * Envelope header above the preview iframe — mimics the From/To/Subject
 * tray a recipient sees in their inbox before they open the email.
 */
function EnvelopeRow({ label, value, bold = false }: { label: string; value: React.ReactNode; bold?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "6px 14px", fontSize: 12, alignItems: "baseline" }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gtm-text-faint)", width: 60, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ flex: 1, minWidth: 0, fontWeight: bold ? 600 : 400, color: "var(--gtm-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: font }}>
        {value}
      </span>
    </div>
  )
}

const envelope: React.CSSProperties = {
  background: "#fff",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  padding: "8px 0",
  marginBottom: 10,
  display: "flex",
  flexDirection: "column",
  gap: 0,
  fontFamily: font,
}

/**
 * Render a human-readable summary of an EmailRecipient[] for the To: row.
 * - Audience refs become "Audience: <id>" (we'd need to fetch names to
 *   show a friendlier label; deferred to v2)
 * - Contact refs become "1 contact"
 * - Raw emails are listed inline up to 3, then "+N more"
 * - Empty list → "(no recipients)"
 */
function summarizeRecipients(recipients: EmailDraft["recipients"]): React.ReactNode {
  if (!recipients || recipients.length === 0) {
    return <em style={{ color: "var(--gtm-text-faint)" }}>(no recipients)</em>
  }
  const parts: string[] = []
  let audienceCount = 0
  let contactCount = 0
  const rawEmails: string[] = []
  for (const r of recipients) {
    if (r.kind === "audience") audienceCount++
    else if (r.kind === "contact") contactCount++
    else if (r.kind === "raw") rawEmails.push(r.email)
  }
  if (audienceCount > 0) parts.push(`${audienceCount} audience${audienceCount > 1 ? "s" : ""}`)
  if (contactCount > 0) parts.push(`${contactCount} contact${contactCount > 1 ? "s" : ""}`)
  if (rawEmails.length > 0) {
    if (rawEmails.length <= 3) {
      parts.push(rawEmails.join(", "))
    } else {
      parts.push(`${rawEmails.slice(0, 3).join(", ")}, +${rawEmails.length - 3} more`)
    }
  }
  return parts.join(" · ")
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: font }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gtm-text-faint)" }}>
        {label}
      </span>
      {children}
    </div>
  )
}

/**
 * Lightweight wrapper for the live preview iframe. Doesn't include the
 * full applyEmailWrapper output (no logo SVG / footer links) - just
 * mimics the shell visually so the user gets a sense of how the body
 * will look in a Momentify-branded email. The actual send-time wrap
 * happens server-side via applyEmailWrapper in email-parser.ts.
 */
interface PreviewOpts {
  solution?: string
  ctaText?: string
  ctaHref?: string
  headerTag?: string
}

function wrapForPreview(bodyHtml: string, opts: PreviewOpts): string {
  const palette = previewPalette(opts.solution)
  const headerTagCell = opts.headerTag
    ? `<td align="right" valign="middle" style="font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.82);">${escapeHtmlClient(opts.headerTag)}</td>`
    : ""
  const ctaBlock = opts.ctaText && opts.ctaHref
    ? `<tr><td align="left" style="padding:0 28px 28px 28px;">
         <table role="presentation" cellpadding="0" cellspacing="0" border="0">
           <tr><td bgcolor="${palette.primary}" style="border-radius:8px;">
             <a href="${escapeHtmlClient(opts.ctaHref)}" target="_blank"
                style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
               ${escapeHtmlClient(opts.ctaText)}
             </a>
           </td></tr>
         </table>
       </td></tr>`
    : ""
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F5F8;font-family:Inter,system-ui,sans-serif;color:#061341;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:24px 16px;">
      <table role="presentation" width="600" style="max-width:600px;width:100%;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(6,19,65,0.06),0 8px 24px rgba(6,19,65,0.06);">
        <tr><td style="background:${palette.heroGrad};padding:24px 28px;">
          <table role="presentation" width="100%"><tr>
            <td align="left" valign="middle">
              <img src="/Momentify-Logo_White.svg" alt="Momentify" width="140" style="display:block;width:140px;height:auto;border:0;"/>
            </td>
            ${headerTagCell}
          </tr></table>
        </td></tr>
        <tr><td style="padding:28px;font-size:15px;line-height:1.6;">${bodyHtml}</td></tr>
        ${ctaBlock}
        <tr><td style="border-top:1px solid #E6E8EE;padding:18px 28px;font-size:12px;color:rgba(6,19,65,0.55);">
          <a href="https://momentifyapp.com" style="color:rgba(6,19,65,0.55);">momentifyapp.com</a> &middot; Unsubscribe
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function escapeHtmlClient(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
}

/**
 * Client-side palette mirror of pillarPaletteSafe() in email-parser.ts.
 * Kept in sync with the canonical palette values from pillar-palettes.ts
 * so the preview iframe matches what server-side applyEmailWrapper sends.
 *
 * "general" / undefined returns the neutral Momentify cyan-navy gradient.
 * Returns `primary` so the CTA button picks up the same brand color
 * the header gradient was built around.
 */
function previewPalette(solution?: string): { name: string; heroGrad: string; primary: string } {
  switch (solution) {
    case "trade-shows":
      return { name: "Violet", primary: "#6B21D4", heroGrad: "linear-gradient(135deg, #2D0770 0%, #4A0FA8 55%, #9B5FE8 100%)" }
    case "recruiting":
      return { name: "Teal", primary: "#0AA891", heroGrad: "linear-gradient(135deg, #040E28 0%, #1A8A76 55%, #5FD9C2 100%)" }
    case "field-sales":
      return { name: "Amber", primary: "#D4940A", heroGrad: "linear-gradient(135deg, #1A0A00 0%, #A86B00 55%, #F2B33D 100%)" }
    case "facilities":
      return { name: "Indigo", primary: "#3A2073", heroGrad: "linear-gradient(135deg, #0D0820 0%, #3A2073 55%, #5B4499 100%)" }
    case "events-venues":
      return { name: "Crimson", primary: "#8F200A", heroGrad: "linear-gradient(135deg, #1A0400 0%, #8F200A 55%, #F25E3D 100%)" }
    default:
      return { name: "Momentify", primary: "#1A56DB", heroGrad: "linear-gradient(135deg, #061341 0%, #1A56DB 55%, #0CF4DF 100%)" }
  }
}

// ─── styles ────────────────────────────────────────────────────────────

const wrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
  background: "#fff",
  borderRadius: 8,
  border: "1px solid var(--gtm-border)",
  overflow: "hidden",
  fontFamily: font,
}

const topBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 16px",
  borderBottom: "1px solid var(--gtm-border)",
  background: "var(--gtm-bg-page)",
}

const twoColumn: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  flex: 1,
  minHeight: 0,
}

const column: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  padding: 16,
  overflow: "auto",
}

const iconBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  height: 30,
  padding: "0 10px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: font,
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  background: "#fff",
  color: "var(--gtm-text-secondary)",
  cursor: "pointer",
}

const subjectInput: React.CSSProperties = {
  width: "100%",
  height: 36,
  padding: "0 12px",
  fontSize: 14,
  fontFamily: font,
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  background: "#fff",
  color: "var(--gtm-text-primary)",
}

const rawTextarea: React.CSSProperties = {
  width: "100%",
  minHeight: 280,
  padding: 12,
  fontSize: 12,
  fontFamily: "ui-monospace, SF Mono, Menlo, monospace",
  border: "1px solid var(--gtm-border)",
  borderRadius: 8,
  background: "#fff",
  color: "var(--gtm-text-primary)",
  resize: "vertical",
}
