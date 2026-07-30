"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, Save, Check, Loader2, FileImage, FileText } from "lucide-react"
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
  escapeHtml,
  ghostBtn,
  loadSavedConfig,
  primaryBtn,
  saveConfig,
} from "@/components/gtm/collateral/BuilderUI"
import { LOGO_DATA_URI, LOGO_ICON_DATA_URI } from "@/components/gtm/collateral/logoDataUri"

// Business card physical size — US standard, no bleed.
const CARD_W_IN = 3.5
const CARD_H_IN = 2

interface CardConfig {
  fullName: string
  title: string
  email: string
  phone: string
  website: string
  accent: string
  showQr: boolean
}

const BASE: CardConfig = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  website: "momentifyapp.com",
  accent: COLORS.teal,
  showQr: false,
}

const PRESETS: Record<string, { label: string; config: CardConfig }> = {
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

const LS_KEY = (id: string) => `momentify_gtm_bizcard_${id}`

/**
 * Build a complete HTML document with two full-bleed 3.5x2 pages
 * separated by `page-break-after: always`. Chromium's PDF renderer
 * turns each page block into a separate PDF page — front then back —
 * so a single POST to /render-collateral produces the two-sided PDF.
 *
 * For the JPG path we render only one side at a time (front OR back),
 * so the same builder is called with { side: 'front' | 'back' } and
 * skips the other page.
 */
function buildCardHtml(c: CardConfig, side: "both" | "front" | "back"): string {
  const name = escapeHtml(c.fullName || "Your Name")
  const title = escapeHtml(c.title || "Your Title")
  const email = escapeHtml(c.email || "")
  const phone = escapeHtml(c.phone || "")
  const website = escapeHtml(c.website || "momentifyapp.com")
  const accent = c.accent || COLORS.teal

  // Front — white background, dark navy ink, accent divider bar under name.
  const frontPage = `
<div class="card front">
  <div class="ink">
    <div class="name">${name}</div>
    <div class="accent-bar"></div>
    <div class="title">${title}</div>
    <div class="contact">
      ${email ? `<div>${email}</div>` : ""}
      ${phone ? `<div>${phone}</div>` : ""}
      <div class="site">${website}</div>
    </div>
  </div>
  <img class="corner-logo" src="${LOGO_ICON_DATA_URI}" alt="Momentify" />
</div>`

  // Back — full-bleed Momentify depth gradient with centered wordmark.
  const backPage = `
<div class="card back">
  <img class="wordmark" src="${LOGO_DATA_URI}" alt="Momentify" />
  <div class="tagline">The operating system for in-person engagement</div>
</div>`

  const pages =
    side === "both" ? `${frontPage}<div class="pb"></div>${backPage}` :
    side === "front" ? frontPage :
    backPage

  // A dark filter tints the navy PNG logo to white for the back. If your
  // logo file changes to a natively-white asset, drop the filter.
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; padding: 0; background: #fff; }
  body { font-family: ${FONT_STACK}; color: ${COLORS.ink}; }
  .card {
    box-sizing: border-box;
    width: ${CARD_W_IN}in;
    height: ${CARD_H_IN}in;
    padding: 0.22in;
    position: relative;
    overflow: hidden;
    page-break-inside: avoid;
  }
  .pb { page-break-after: always; height: 0; }
  .front { background: #FFFFFF; }
  .front .ink { display: flex; flex-direction: column; justify-content: center; height: 100%; }
  .front .name {
    font-size: 15pt; font-weight: 500; letter-spacing: -0.01em;
    color: ${COLORS.ink}; line-height: 1.1;
  }
  .front .accent-bar {
    width: 32pt; height: 2pt; background: ${accent};
    margin: 6pt 0 8pt 0; border-radius: 1pt;
  }
  .front .title {
    font-size: 8.5pt; font-weight: 400; color: ${accent};
    letter-spacing: 0.02em;
  }
  .front .contact {
    margin-top: 12pt; font-size: 7.5pt; font-weight: 400;
    color: ${COLORS.muted}; line-height: 1.5;
  }
  .front .contact .site { color: ${COLORS.ink}; font-weight: 500; }
  .front .corner-logo {
    position: absolute; bottom: 0.16in; right: 0.18in;
    height: 0.34in; width: 0.34in; opacity: 0.95;
  }
  .back {
    background: linear-gradient(135deg, #7C316D 0%, #0B0B3C 45%, #1A2E73 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .back .wordmark {
    height: 0.42in; width: auto;
    /* Invert the dark-navy PNG to white so it reads on the gradient. */
    filter: brightness(0) invert(1);
  }
  .back .tagline {
    margin-top: 10pt; font-size: 7pt; font-weight: 300;
    color: #0CF4DF; letter-spacing: 0.08em; text-transform: uppercase;
  }
</style></head>
<body>${pages}</body></html>`
}

async function downloadFromRender(opts: {
  format: "pdf" | "jpg"
  html: string
  filename: string
  dpi?: number
  widthIn?: number
  heightIn?: number
}) {
  const res = await fetch("/api/gtm/render-collateral", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      format: opts.format,
      widthIn: opts.widthIn ?? CARD_W_IN,
      heightIn: opts.heightIn ?? CARD_H_IN,
      dpi: opts.dpi ?? 300,
      html: opts.html,
      filename: opts.filename,
    }),
  })
  if (!res.ok) {
    let msg = `render failed (${res.status})`
    try { const j = await res.json(); if (j?.error) msg = j.error } catch {}
    throw new Error(msg)
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${opts.filename}.${opts.format}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function BusinessCardPage() {
  const [presetId, setPresetId] = useState<string>("jake")
  const [config, setConfig] = useState<CardConfig>(PRESETS.jake.config)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState<null | "pdf" | "jpg-front" | "jpg-back">(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const preset = PRESETS[presetId] ?? PRESETS.custom
    setConfig(loadSavedConfig(LS_KEY(presetId), preset.config))
  }, [presetId])

  const previewFront = useMemo(() => buildCardHtml(config, "front"), [config])
  const previewBack = useMemo(() => buildCardHtml(config, "back"), [config])

  function update<K extends keyof CardConfig>(key: K, value: CardConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }))
  }

  function handleSave() {
    saveConfig(LS_KEY(presetId), config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const safeName = (config.fullName || "card").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)

  async function exportPdf() {
    setErr(null); setBusy("pdf")
    try {
      await downloadFromRender({
        format: "pdf",
        html: buildCardHtml(config, "both"),
        filename: `momentify-card-${safeName}`,
      })
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed") }
    finally { setBusy(null) }
  }

  async function exportJpg(which: "front" | "back") {
    setErr(null); setBusy(`jpg-${which}`)
    try {
      await downloadFromRender({
        format: "jpg",
        html: buildCardHtml(config, which),
        filename: `momentify-card-${safeName}-${which}`,
      })
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed") }
    finally { setBusy(null) }
  }

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <PageHero
        eyebrow="COLLATERAL"
        title="Business Card Builder"
        subtitle="Print-ready 3.5×2 inch cards at 300 DPI. Front is your details on white; back is the Momentify depth gradient with the wordmark. Downloads a two-page PDF for the printer plus per-side high-res JPGs."
      />

      <div style={{ marginBottom: 16 }}>
        <PresetSwitcher
          presets={Object.entries(PRESETS).map(([id, p]) => ({ id, label: p.label }))}
          active={presetId}
          onChange={setPresetId}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 380px) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
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
          <Field label="Phone">
            <Input value={config.phone} onChange={(v) => update("phone", v)} placeholder="+1 555 555 5555" />
          </Field>
          <Field label="Website">
            <Input value={config.website} onChange={(v) => update("website", v)} placeholder="momentifyapp.com" />
          </Field>
          <Field label="Accent (front)">
            <AccentPicker value={config.accent} onChange={(hex) => update("accent", hex)} />
          </Field>
          <button onClick={handleSave} style={ghostBtn}>
            {saved ? <Check size={13} /> : <Save size={13} />}
            {saved ? "Saved" : "Save for this preset"}
          </button>
        </Card>

        <div style={{ position: "sticky", top: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Preview (front / back)">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <CardScaledPreview html={previewFront} label="Front" />
              <CardScaledPreview html={previewBack} label="Back" />
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "var(--gtm-text-faint)", lineHeight: 1.5 }}>
              Preview is scaled 2× from the true 3.5×2 in trim. No bleed — add 0.125 in bleed at your printer if they require it.
            </p>
          </Card>

          <Card title="Export">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button onClick={exportPdf} disabled={!!busy} style={primaryBtn}>
                {busy === "pdf" ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
                {busy === "pdf" ? "Rendering…" : "Two-sided PDF"}
              </button>
              <button onClick={() => exportJpg("front")} disabled={!!busy} style={ghostBtn}>
                {busy === "jpg-front" ? <Loader2 size={13} className="animate-spin" /> : <FileImage size={13} />}
                Front JPG (300 DPI)
              </button>
              <button onClick={() => exportJpg("back")} disabled={!!busy} style={ghostBtn}>
                {busy === "jpg-back" ? <Loader2 size={13} className="animate-spin" /> : <FileImage size={13} />}
                Back JPG (300 DPI)
              </button>
            </div>
            {err && (
              <p style={{ margin: 0, fontSize: 12, color: "#E5484D" }}>{err}</p>
            )}
            <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "var(--gtm-text-faint)", lineHeight: 1.5 }}>
              First render after a deploy can take ~5–10s while chromium downloads on the serverless host. Subsequent renders are fast.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

/**
 * Renders the raw card HTML in an iframe scaled 2× so a 3.5×2 in card
 * (~336×192 px at 96 DPI) shows at ~672×384 px in the preview panel.
 * srcDoc keeps the preview fully sandboxed and prevents its styles from
 * bleeding into the app chrome.
 */
function CardScaledPreview({ html, label }: { html: string; label: string }) {
  const scale = 2
  const cssW = CARD_W_IN * 96
  const cssH = CARD_H_IN * 96
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gtm-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
      <div
        style={{
          width: cssW * scale,
          height: cssH * scale,
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--gtm-border)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          background: "#fff",
        }}
      >
        <iframe
          title={label}
          srcDoc={html}
          sandbox=""
          style={{
            width: cssW,
            height: cssH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: "none",
            display: "block",
          }}
        />
      </div>
    </div>
  )
}
