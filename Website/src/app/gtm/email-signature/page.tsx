"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Copy, Check, Download, Save, Mail } from "lucide-react"
import {
  AccentPicker,
  ASSET_ORIGIN,
  COLORS,
  Card,
  Field,
  FONT_STACK,
  Input,
  PageHero,
  PresetSwitcher,
  Toggle,
  escapeHtml,
  ghostBtn,
  loadSavedConfig,
  normalizeUrl,
  primaryBtn,
  saveConfig,
} from "@/components/gtm/collateral/BuilderUI"
import { LOGO_DATA_URI } from "@/components/gtm/collateral/logoDataUri"

interface SigConfig {
  fullName: string
  title: string
  email: string
  phone: string
  website: string
  bookingUrl: string
  cta: string
  tagline: string
  accent: string
  showLogo: boolean
  showTagline: boolean
}

const BASE: SigConfig = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  website: "momentifyapp.com",
  bookingUrl: "",
  cta: "Book a ROX Audit",
  tagline: "The operating system for in-person engagement",
  accent: COLORS.teal,
  showLogo: true,
  showTagline: true,
}

const PRESETS: Record<string, { label: string; config: SigConfig }> = {
  jake: {
    label: "Jake Hamann",
    config: {
      ...BASE,
      fullName: "Jake Hamann",
      title: "Founder & CEO",
      email: "jake@momentifyapp.com",
      accent: COLORS.teal,
    },
  },
  harsh: {
    label: "Harsh",
    config: {
      ...BASE,
      fullName: "Harsh",
      title: "Co-Founder",
      email: "harsh@momentifyapp.com",
      accent: COLORS.blue,
    },
  },
  custom: {
    label: "Custom / New",
    config: { ...BASE, fullName: "Your Name", title: "Your Title", email: "you@momentifyapp.com" },
  },
}

const LS_KEY = (id: string) => `momentify_gtm_signature_${id}`

/**
 * Build a table-based, inline-styled HTML signature. This same string
 * feeds the live preview, the clipboard copy, and the .html download,
 * so preview == output by construction. Table + inline styles are
 * required for Outlook / Gmail / Apple Mail fidelity.
 */
function buildSignature(c: SigConfig): string {
  const name = escapeHtml(c.fullName || "Your Name")
  const title = escapeHtml(c.title || "Your Title")
  const email = escapeHtml(c.email || "")
  const phone = escapeHtml(c.phone || "")
  const website = escapeHtml(c.website || "")
  const cta = escapeHtml(c.cta || "")
  const tagline = escapeHtml(c.tagline || "")
  const accent = c.accent || COLORS.teal
  const bookingHref = normalizeUrl(c.bookingUrl || `https://${c.website || "momentifyapp.com"}`)
  const websiteHref = normalizeUrl(c.website || "momentifyapp.com")

  const emailLink = email ? `<a href="mailto:${email}" style="color:${COLORS.ink};text-decoration:none;">${email}</a>` : ""
  const phoneLink = phone ? `<a href="tel:${phone.replace(/[^0-9+]/g, "")}" style="color:${COLORS.muted};text-decoration:none;">${phone}</a>` : ""
  const websiteLink = website
    ? `<a href="${escapeHtml(websiteHref)}" style="color:${COLORS.muted};text-decoration:none;">${website}</a>`
    : ""

  const logoCell = c.showLogo
    ? `<td valign="top" style="padding:0 16px 0 0;border-right:2px solid ${accent};">
         <img src="${LOGO_DATA_URI}" width="120" alt="Momentify" style="display:block;border:0;outline:none;text-decoration:none;height:auto;width:120px;" />
       </td>`
    : ""

  const taglineRow = c.showTagline && tagline
    ? `<tr><td style="padding:8px 0 0 0;font:italic 12px/1.4 ${FONT_STACK};color:${COLORS.muted};">${tagline}</td></tr>`
    : ""

  const ctaRow = cta
    ? `<tr><td style="padding:10px 0 0 0;">
         <a href="${escapeHtml(bookingHref)}" style="display:inline-block;padding:8px 14px;background:${accent};color:#ffffff;font:600 12px/1 ${FONT_STACK};text-decoration:none;border-radius:6px;">${cta}</a>
       </td></tr>`
    : ""

  // Contact rows collapse cleanly when phone/website are omitted.
  const contactParts: string[] = []
  if (emailLink) contactParts.push(emailLink)
  if (phoneLink) contactParts.push(phoneLink)
  if (websiteLink) contactParts.push(websiteLink)
  const contactRow = contactParts.length
    ? `<tr><td style="padding:6px 0 0 0;font:400 13px/1.5 ${FONT_STACK};color:${COLORS.muted};">${contactParts.join(` &nbsp;<span style="color:${accent};">&middot;</span>&nbsp; `)}</td></tr>`
    : ""

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;"><tr><td style="background-color:#FFFFFE;border:1px solid #E4E9F0;border-radius:12px;padding:16px;">
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${FONT_STACK};color:${COLORS.ink};">
  <tr>
    ${logoCell}
    <td valign="top" style="padding:0 0 0 ${c.showLogo ? "16px" : "0"};">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr><td style="font:500 16px/1.2 ${FONT_STACK};color:${COLORS.ink};letter-spacing:-0.01em;">${name}</td></tr>
        <tr><td style="padding:2px 0 0 0;font:400 13px/1.4 ${FONT_STACK};color:${accent};">${title} &middot; Momentify</td></tr>
        ${contactRow}
        ${taglineRow}
        ${ctaRow}
      </table>
    </td>
  </tr>
</table>
</td></tr></table>`
}

function buildStandaloneHtml(sig: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Momentify Email Signature</title></head>
<body style="margin:0;padding:24px;background:#F8F9FB;">
${sig}
</body></html>`
}

export default function EmailSignaturePage() {
  const [presetId, setPresetId] = useState<string>("jake")
  const [config, setConfig] = useState<SigConfig>(PRESETS.jake.config)
  const [copied, setCopied] = useState<null | "html" | "plain">(null)
  const [saved, setSaved] = useState(false)
  const [sendTo, setSendTo] = useState("")
  const [sending, setSending] = useState(false)
  const [sendMsg, setSendMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const preset = PRESETS[presetId] ?? PRESETS.custom
    setConfig(loadSavedConfig(LS_KEY(presetId), preset.config))
  }, [presetId])

  const html = useMemo(() => buildSignature(config), [config])

  // Seed the send-to field from the signature's own email; only once.
  useEffect(() => {
    setSendTo((cur) => cur || config.email || "")
  }, [config.email])

  async function emailToMe() {
    const to = sendTo.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      setSendMsg({ ok: false, text: "Enter a valid email to send to." })
      return
    }
    setSending(true)
    setSendMsg(null)
    try {
      const res = await fetch("/api/gtm/collateral/signature/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, to, label: config.fullName || "" }),
      })
      const json = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !json.ok) throw new Error(json.error ?? "The email could not be sent")
      setSendMsg({ ok: true, text: `Sent to ${to}. Open it in Mail on your phone, then Select All → Copy.` })
    } catch (e) {
      setSendMsg({ ok: false, text: e instanceof Error ? e.message : "The email could not be sent" })
    } finally {
      setSending(false)
    }
  }

  function update<K extends keyof SigConfig>(key: K, value: SigConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }))
  }

  function handleSave() {
    saveConfig(LS_KEY(presetId), config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function copyRichHtml() {
    const plain = `${config.fullName}\n${config.title} · Momentify\n${config.email}${config.phone ? ` · ${config.phone}` : ""}${config.website ? ` · ${config.website}` : ""}`
    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plain], { type: "text/plain" }),
          }),
        ])
      } else {
        throw new Error("ClipboardItem unavailable")
      }
      setCopied("html")
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Fallback: select the preview node and use execCommand("copy").
      const node = previewRef.current
      if (!node) return
      const range = document.createRange()
      range.selectNodeContents(node)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
      try {
        document.execCommand("copy")
        setCopied("html")
        setTimeout(() => setCopied(null), 2000)
      } finally {
        sel?.removeAllRanges()
      }
    }
  }

  function downloadHtml() {
    const doc = buildStandaloneHtml(html)
    const blob = new Blob([doc], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `momentify-signature-${(config.fullName || "signature").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <PageHero
        eyebrow="COLLATERAL"
        title="Email Signature Builder"
        subtitle="Fill in your details, pick an accent, and copy the rich-HTML signature straight into Gmail, Outlook, or Apple Mail. Downloads a standalone .html file too."
      />

      <div style={{ marginBottom: 16 }}>
        <PresetSwitcher
          presets={Object.entries(PRESETS).map(([id, p]) => ({ id, label: p.label }))}
          active={presetId}
          onChange={setPresetId}
        />
      </div>

      <div className="bld-cols" style={{ display: "grid", gridTemplateColumns: "minmax(0, 380px) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
        {/* Form */}
        <Card title="Details">
          <Field label="Full name">
            <Input value={config.fullName} onChange={(v) => update("fullName", v)} placeholder="Jake Hamann" />
          </Field>
          <Field label="Title">
            <Input value={config.title} onChange={(v) => update("title", v)} placeholder="Founder & CEO" />
          </Field>
          <Field label="Email">
            <Input value={config.email} onChange={(v) => update("email", v)} placeholder="you@momentifyapp.com" />
          </Field>
          <Field label="Phone (optional)">
            <Input value={config.phone} onChange={(v) => update("phone", v)} placeholder="+1 555 555 5555" />
          </Field>
          <Field label="Website">
            <Input value={config.website} onChange={(v) => update("website", v)} placeholder="momentifyapp.com" />
          </Field>
          <Field label="Booking / CTA link (optional)">
            <Input value={config.bookingUrl} onChange={(v) => update("bookingUrl", v)} placeholder="calendly.com/…" />
          </Field>
          <Field label="CTA label">
            <Input value={config.cta} onChange={(v) => update("cta", v)} placeholder="Book a ROX Audit" />
          </Field>
          <Field label="Tagline">
            <Input value={config.tagline} onChange={(v) => update("tagline", v)} placeholder="…" />
          </Field>
          <Field label="Accent">
            <AccentPicker value={config.accent} onChange={(hex) => update("accent", hex)} />
          </Field>
          <div style={{ display: "flex", gap: 16 }}>
            <Toggle checked={config.showLogo} onChange={(v) => update("showLogo", v)} label="Show logo" />
            <Toggle checked={config.showTagline} onChange={(v) => update("showTagline", v)} label="Show tagline" />
          </div>
          <button onClick={handleSave} style={ghostBtn}>
            {saved ? <Check size={13} /> : <Save size={13} />}
            {saved ? "Saved" : "Save for this preset"}
          </button>
        </Card>

        {/* Preview + Export */}
        <div style={{ position: "sticky", top: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Preview">
            <div
              ref={previewRef}
              style={{
                background: "#fff",
                border: "1px solid var(--gtm-border)",
                borderRadius: 8,
                padding: 24,
                overflowX: "auto",
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Card>

          <Card title="Export">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button onClick={copyRichHtml} style={primaryBtn}>
                {copied === "html" ? <Check size={13} /> : <Copy size={13} />}
                {copied === "html" ? "Copied" : "Copy rich HTML"}
              </button>
              <button onClick={downloadHtml} style={ghostBtn}>
                <Download size={13} />
                Download .html
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 10 }}>
              <input
                type="email" value={sendTo} onChange={(e) => setSendTo(e.target.value)} placeholder="you@momentify.com"
                style={{ flex: "1 1 200px", minWidth: 0, padding: "8px 10px", fontSize: 13, borderRadius: 6, border: "1px solid var(--gtm-border, rgba(0,0,0,0.15))", background: "transparent", color: "inherit" }}
              />
              <button onClick={emailToMe} disabled={sending} style={ghostBtn}>
                <Mail size={13} />
                {sending ? "Sending…" : "Email to me"}
              </button>
            </div>
            {sendMsg && (
              <p style={{ margin: "6px 0 0", fontSize: 12, color: sendMsg.ok ? "#1a7f37" : "#c0392b" }}>{sendMsg.text}</p>
            )}
            <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "var(--gtm-text-faint)", lineHeight: 1.5 }}>
              <strong>Gmail:</strong> Settings → General → Signature → paste. <strong>Outlook:</strong> Settings → Compose &amp; reply → paste. <strong>Apple Mail (Mac):</strong> Preferences → Signatures → paste (uncheck &quot;Always match my default message font&quot;). <strong>Apple Mail (iPhone/iPad):</strong> copy on the device (or email it to yourself and copy it there), then Settings → Mail → Signature → paste; if it pastes as plain text, shake to Undo, then shake again and Redo to restore the styling.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
