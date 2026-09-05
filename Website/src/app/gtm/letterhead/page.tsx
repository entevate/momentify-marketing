"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Copy, Check, Download, Save, FileText } from "lucide-react"
import {
  AccentPicker,
  ASSET_ORIGIN,
  BuilderLayout,
  COLORS,
  Card,
  Field,
  FONT_STACK,
  Input,
  PageHero,
  PresetSwitcher,
  Textarea,
  escapeHtml,
  ghostBtn,
  loadSavedConfig,
  primaryBtn,
  saveConfig,
} from "@/components/gtm/collateral/BuilderUI"
import { LOGO_DATA_URI } from "@/components/gtm/collateral/logoDataUri"

interface LetterConfig {
  fullName: string
  title: string
  email: string
  phone: string
  website: string
  address: string
  disclaimer: string
  accent: string
  bodyTitle: string
  body: string
}

const BASE: LetterConfig = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  website: "momentifyapp.com",
  address: "",
  disclaimer:
    "Confidential — this letter and any attachments are intended solely for the addressee. If received in error, please delete without disclosing the contents.",
  accent: COLORS.teal,
  bodyTitle: "Subject line goes here",
  body:
    "Dear [Recipient],\n\nWrite the body of your letter here. The layout will render as a proper letterhead when you export to Word, Google Docs, or print to PDF.\n\nRegards,\nYour Name",
}

const PRESETS: Record<string, { label: string; config: LetterConfig }> = {
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

const LS_KEY = (id: string) => `momentify_gtm_letterhead_${id}`

/**
 * Build a US-Letter-shaped letterhead HTML string. Same function feeds
 * the live preview, the rich-clipboard copy (for Google Docs paste),
 * the Word .doc download, and the standalone .html download.
 *
 * Layout:
 *   - Header band with logo (left) + contact block (right)
 *   - Accent divider bar
 *   - Optional subject / body-title heading
 *   - Body copy (preserves paragraph breaks from the textarea)
 *   - Footer with sender identity + optional confidentiality disclaimer
 */
function buildLetterhead(c: LetterConfig): string {
  const name = escapeHtml(c.fullName || "Your Name")
  const title = escapeHtml(c.title || "Your Title")
  const email = escapeHtml(c.email || "")
  const phone = escapeHtml(c.phone || "")
  const website = escapeHtml(c.website || "momentifyapp.com")
  const address = escapeHtml(c.address || "")
  const disclaimer = escapeHtml(c.disclaimer || "")
  const accent = c.accent || COLORS.teal
  const bodyTitle = escapeHtml(c.bodyTitle || "")
  // Convert paragraph breaks (blank line) to <p>; single newlines become <br>.
  const bodyHtml = (c.body || "")
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin:0 0 12pt 0;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("")

  const contactLines: string[] = []
  if (email) contactLines.push(email)
  if (phone) contactLines.push(phone)
  if (website) contactLines.push(website)
  if (address) contactLines.push(address)

  return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:${FONT_STACK};color:${COLORS.ink};max-width:6.5in;margin:0 auto;">
  <tr>
    <td style="padding:0 0 18pt 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td valign="middle" style="padding:0;">
            <img src="${LOGO_DATA_URI}" width="140" alt="Momentify" style="display:block;border:0;height:auto;width:140px;" />
          </td>
          <td valign="middle" align="right" style="padding:0;font:400 10pt/1.5 ${FONT_STACK};color:${COLORS.muted};">
            ${contactLines.map((l) => `<div>${l}</div>`).join("")}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 0 18pt 0;border-top:2pt solid ${accent};font-size:0;line-height:0;">&nbsp;</td>
  </tr>
  ${bodyTitle ? `<tr><td style="padding:0 0 12pt 0;font:500 14pt/1.3 ${FONT_STACK};color:${COLORS.ink};letter-spacing:-0.01em;">${bodyTitle}</td></tr>` : ""}
  <tr>
    <td style="padding:0 0 24pt 0;font:400 11pt/1.6 ${FONT_STACK};color:${COLORS.ink};">
      ${bodyHtml}
    </td>
  </tr>
  <tr>
    <td style="padding:16pt 0 0 0;border-top:1pt solid ${COLORS.border};">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td valign="top" style="padding:0;font:500 10pt/1.4 ${FONT_STACK};color:${COLORS.ink};">
            ${name}<br>
            <span style="font-weight:400;color:${accent};">${title} &middot; Momentify</span>
          </td>
          ${disclaimer ? `<td valign="top" align="right" style="padding:0 0 0 24pt;font:400 8pt/1.4 ${FONT_STACK};color:${COLORS.muted};max-width:3in;">${disclaimer}</td>` : ""}
        </tr>
      </table>
    </td>
  </tr>
</table>`
}

// Word-compatible full document. Word-namespaced HTML + @page block +
// application/msword mime type = a .doc that Word opens as a laid-out
// letter. Google Docs can also import this format.
function buildWordDoc(inner: string): string {
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Momentify Letter</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
  @page { size: 8.5in 11in; margin: 1in; }
  body { font-family: ${FONT_STACK}; color: ${COLORS.ink}; }
</style>
</head><body>${inner}</body></html>`
}

function buildStandaloneHtml(inner: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Momentify Letter</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  html, body { margin:0; padding:0; background:#F8F9FB; }
  body { font-family: ${FONT_STACK}; color: ${COLORS.ink}; padding: 1in; }
  @page { size: 8.5in 11in; margin: 1in; }
  @media print { body { background: #fff; padding: 0; } }
</style>
</head><body>${inner}</body></html>`
}

export default function LetterheadPage() {
  const [presetId, setPresetId] = useState<string>("jake")
  const [config, setConfig] = useState<LetterConfig>(PRESETS.jake.config)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const preset = PRESETS[presetId] ?? PRESETS.custom
    setConfig(loadSavedConfig(LS_KEY(presetId), preset.config))
  }, [presetId])

  const html = useMemo(() => buildLetterhead(config), [config])

  function update<K extends keyof LetterConfig>(key: K, value: LetterConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }))
  }

  function handleSave() {
    saveConfig(LS_KEY(presetId), config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const safeName = (config.fullName || "letter").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)

  async function copyForGoogleDocs() {
    const plain = `${config.bodyTitle}\n\n${config.body}\n\n${config.fullName} · ${config.title} · Momentify`
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
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const node = previewRef.current
      if (!node) return
      const range = document.createRange()
      range.selectNodeContents(node)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
      try {
        document.execCommand("copy")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } finally {
        sel?.removeAllRanges()
      }
    }
  }

  function downloadWord() {
    const doc = buildWordDoc(html)
    // BOM prefix helps some Word versions decode UTF-8.
    const blob = new Blob(["﻿" + doc], { type: "application/msword" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `momentify-letter-${safeName}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function downloadHtml() {
    const doc = buildStandaloneHtml(html)
    const blob = new Blob([doc], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `momentify-letter-${safeName}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div style={{ padding: 32, maxWidth: 1280, margin: "0 auto" }}>
      <PageHero
        eyebrow="COLLATERAL"
        title="Letterhead / Document Builder"
        subtitle="Compose a branded letter and export as Word .doc, copy formatted content into Google Docs, or download a standalone .html you can print to PDF."
      />

      <div style={{ marginBottom: 16 }}>
        <PresetSwitcher
          presets={Object.entries(PRESETS).map(([id, p]) => ({ id, label: p.label }))}
          active={presetId}
          onChange={setPresetId}
        />
      </div>

      <BuilderLayout
        form={
          <>
        <Card title="Header + identity">
          <Field label="Full name">
            <Input value={config.fullName} onChange={(v) => update("fullName", v)} />
          </Field>
          <Field label="Title">
            <Input value={config.title} onChange={(v) => update("title", v)} />
          </Field>
          <Field label="Email">
            <Input value={config.email} onChange={(v) => update("email", v)} />
          </Field>
          <Field label="Phone">
            <Input value={config.phone} onChange={(v) => update("phone", v)} />
          </Field>
          <Field label="Website">
            <Input value={config.website} onChange={(v) => update("website", v)} />
          </Field>
          <Field label="Mailing address (optional)">
            <Input value={config.address} onChange={(v) => update("address", v)} placeholder="123 Main St, City, ST" />
          </Field>
          <Field label="Divider accent">
            <AccentPicker value={config.accent} onChange={(hex) => update("accent", hex)} />
          </Field>
          <Field label="Confidentiality disclaimer (optional)">
            <Textarea value={config.disclaimer} onChange={(v) => update("disclaimer", v)} rows={3} />
          </Field>
          <button onClick={handleSave} style={ghostBtn}>
            {saved ? <Check size={13} /> : <Save size={13} />}
            {saved ? "Saved" : "Save for this preset"}
          </button>
        </Card>

          <Card title="Body">
            <Field label="Subject / heading (optional)">
              <Input value={config.bodyTitle} onChange={(v) => update("bodyTitle", v)} />
            </Field>
            <Field label="Body copy" hint="Blank lines separate paragraphs.">
              <Textarea value={config.body} onChange={(v) => update("body", v)} rows={10} />
            </Field>
          </Card>
          </>
        }
        preview={
          <>
          <Card title="Preview">
            <div
              ref={previewRef}
              style={{
                background: "#fff",
                border: "1px solid var(--gtm-border)",
                borderRadius: 8,
                padding: 32,
                overflowX: "auto",
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Card>

          <Card title="Export">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button onClick={downloadWord} style={primaryBtn}>
                <FileText size={13} />
                Word .doc
              </button>
              <button onClick={copyForGoogleDocs} style={ghostBtn}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy for Google Docs"}
              </button>
              <button onClick={downloadHtml} style={ghostBtn}>
                <Download size={13} />
                Download .html
              </button>
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "var(--gtm-text-faint)", lineHeight: 1.5 }}>
              <strong>Google Docs:</strong> paste into a blank doc — formatting, logo, and colors carry over. <strong>Word .doc:</strong> opens directly in Word or Pages. <strong>.html:</strong> open in a browser, then File → Print → Save as PDF for a print-perfect version.
            </p>
          </Card>
          </>
        }
      />
    </div>
  )
}
