/**
 * GTM Email Module — content parsing + branded HTML wrapper.
 *
 * Two responsibilities:
 *   1. parseColdEmailSequence(content) - turn the structured text from a
 *      `cold-emails` Library item (3-touch sequence with SUBJECT/BODY/CTA
 *      markers) into separate touch objects we can seed a draft from.
 *   2. applyEmailWrapper(bodyHtml, opts) - wrap the TipTap HTML output
 *      in a 600px Momentify-branded shell with logo, pillar-tinted CTA,
 *      footer, and {{unsubscribeUrl}} placeholder. All inline styles to
 *      maximize email-client rendering parity.
 */

import { paletteFor, type PillarId, type Palette } from "@/lib/gtm/pillar-palettes"

// ─── parseColdEmailSequence ────────────────────────────────────────────

export interface ParsedColdEmailTouch {
  touchIndex: number
  /** "Day 0" / "Day 4" / "Day 9" if present in the source, else null. */
  day: string | null
  subject: string
  body: string
  cta: string
}

/**
 * Tolerant parser for the cold-emails brief format produced by
 * Content Builder's `cold-emails` prompt branch (builder-prompts.ts:91-112).
 *
 * Source format (per touch):
 *
 *   ## TOUCH 1 (Day 0)            <- optional touch heading
 *   SUBJECT: ...
 *   BODY: ...
 *           ...
 *           ...
 *   CTA: ...
 *
 * Each marker (SUBJECT/BODY/CTA) starts a new field. The body field
 * captures everything between BODY: and the next marker (CTA: or the
 * next touch heading or end-of-input). Matching is case-insensitive
 * and tolerates leading whitespace + bold markdown (**SUBJECT:**).
 */
export function parseColdEmailSequence(content: string): ParsedColdEmailTouch[] {
  if (!content) return []

  // Strip Markdown bold/italic that Claude sometimes adds around markers.
  const normalized = content.replace(/\*\*?/g, "")

  // Split on the SUBJECT marker so each chunk represents one touch.
  // Lookahead keeps the marker on the right side of the boundary.
  const chunks = normalized.split(/(?=^\s*SUBJECT\s*:)/im).map((c) => c.trim()).filter(Boolean)

  const out: ParsedColdEmailTouch[] = []
  let touchIndex = 0
  for (const chunk of chunks) {
    // Skip preamble noise (e.g. an intro paragraph before the first SUBJECT).
    if (!/^\s*SUBJECT\s*:/i.test(chunk)) continue

    const subjMatch = chunk.match(/SUBJECT\s*:\s*([\s\S]+?)(?=\n\s*(?:BODY|CTA)\s*:|$)/i)
    const bodyMatch = chunk.match(/BODY\s*:\s*([\s\S]+?)(?=\n\s*CTA\s*:|$)/i)
    const ctaMatch  = chunk.match(/CTA\s*:\s*([\s\S]+?)$/i)

    // Try to recover a "Day X" hint from any heading text in the chunk.
    const dayMatch = chunk.match(/Day\s+(\d+)/i)

    out.push({
      touchIndex,
      day: dayMatch ? `Day ${dayMatch[1]}` : null,
      subject: (subjMatch?.[1] ?? "").trim(),
      body:    (bodyMatch?.[1] ?? "").trim(),
      cta:     (ctaMatch?.[1]  ?? "").trim(),
    })
    touchIndex++
  }
  return out
}

// ─── HTML helpers ──────────────────────────────────────────────────────

/** Escape <, >, &, " for safe HTML interpolation. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * Convert plain text body (from a Library cold-emails touch) into safe
 * paragraph-broken HTML for seeding the TipTap editor. Splits on blank
 * lines into <p>, single newlines become <br>, escapes HTML, autolinks
 * http(s) URLs.
 */
export function plainTextToHtml(text: string): string {
  if (!text) return ""
  const escaped = escapeHtml(text)
  // Autolink URLs.
  const linked = escaped.replace(
    /(https?:\/\/[^\s<>"]+)/g,
    (url) => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`,
  )
  // Paragraph + line break wrapping.
  const paragraphs = linked.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  return paragraphs.map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("\n")
}

// ─── applyEmailWrapper ─────────────────────────────────────────────────

export interface ApplyEmailWrapperOpts {
  /** When true, returns bodyHtml unchanged (caller is responsible for valid HTML). */
  rawHtmlMode: boolean
  /** Pillar id — drives header bar gradient + CTA button color. */
  solution?: string
  /** Optional CTA below the body. Both fields required to render. */
  ctaText?: string
  ctaHref?: string
  /** Pre-header text (snippet shown in email client previews). */
  preheader?: string
}

/**
 * Wrap caller-supplied `bodyHtml` in a 600px Momentify-branded email shell.
 *
 * Design constraints:
 *   - Inline styles only. <style> blocks are stripped/ignored by Outlook,
 *     Yahoo, and Gmail's clip mode.
 *   - No external CSS. Google Fonts won't load in many clients; default
 *     to system stack with Inter as a soft preference.
 *   - 600px max content width — the email industry baseline.
 *   - Uses table layout for legacy clients (Outlook 2007-2019 rely on
 *     table rendering for centering).
 *   - Light-mode color palette only. Dark-mode rendering varies wildly
 *     by client; we don't attempt @media (prefers-color-scheme).
 *
 * `{{unsubscribeUrl}}` is left as a placeholder string. The v2 unsubscribe
 * flow will substitute a signed URL at send time.
 */
export function applyEmailWrapper(bodyHtml: string, opts: ApplyEmailWrapperOpts): string {
  if (opts.rawHtmlMode) return bodyHtml

  const palette = pillarPaletteSafe(opts.solution)
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#fff;line-height:1px;mso-hide:all;">${escapeHtml(opts.preheader)}</div>`
    : ""

  const ctaBlock = opts.ctaText && opts.ctaHref
    ? `
        <tr>
          <td align="left" style="padding:24px 32px 32px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="${palette.primary}" style="border-radius:8px;">
                  <a href="${escapeHtml(opts.ctaHref)}" target="_blank"
                     style="display:inline-block;padding:12px 24px;font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                    ${escapeHtml(opts.ctaText)}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    : ""

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Momentify</title>
</head>
<body style="margin:0;padding:0;background:#F4F5F8;font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#061341;-webkit-font-smoothing:antialiased;">
${preheader}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F4F5F8;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(6,19,65,0.06),0 8px 24px rgba(6,19,65,0.06);">
        <!-- Header bar -->
        <tr>
          <td style="background:${palette.heroGrad};padding:20px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td align="left" style="font-family:Inter,system-ui,sans-serif;font-size:15px;font-weight:600;color:#FFFFFF;letter-spacing:0.02em;">
                  Momentify
                </td>
                <td align="right" style="font-family:Inter,system-ui,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.78);">
                  ${palette.name}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#061341;">
            ${bodyHtml}
          </td>
        </tr>
        ${ctaBlock}
        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid #E6E8EE;padding:20px 32px;font-family:Inter,system-ui,sans-serif;font-size:12px;color:rgba(6,19,65,0.55);">
            <p style="margin:0 0 6px 0;">Momentify - turning in-person moments into measurable outcomes.</p>
            <p style="margin:0;">
              <a href="https://momentifyapp.com" target="_blank" style="color:rgba(6,19,65,0.55);text-decoration:underline;">momentifyapp.com</a>
              &nbsp;&middot;&nbsp;
              <a href="{{unsubscribeUrl}}" target="_blank" style="color:rgba(6,19,65,0.55);text-decoration:underline;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

/**
 * Lookup the pillar palette by solution id, falling back to a neutral
 * Momentify-cyan palette when no solution is set (cross-pillar emails).
 */
function pillarPaletteSafe(solution?: string): Palette {
  if (!solution) {
    return {
      name: "Momentify",
      primary: "#1A56DB",
      light: "#0CF4DF",
      dark: "#061341",
      heroGrad: "linear-gradient(135deg, #061341 0%, #1A56DB 55%, #0CF4DF 100%)",
      lightBg: "linear-gradient(145deg, #F4F5F8 0%, #ECEFF7 100%)",
      decorPattern: "none",
      decorSize: "auto",
    }
  }
  return paletteFor(solution as PillarId)
}

// ─── Server-side TipTap output sanitizer ───────────────────────────────

/**
 * Strip the small set of dangerous tags / attributes that TipTap's HTML
 * output should never contain (the editor's schema constrains output,
 * but we belt-and-suspender on the server in case someone POSTs hand-
 * crafted bodyHtml directly).
 *
 * NOT a full DOMPurify — that would add a heavy dep for a TipTap-shaped
 * input we already control. If we ever accept arbitrary HTML, swap this
 * for `isomorphic-dompurify`.
 */
export function sanitizeEmailHtml(html: string): string {
  if (!html) return ""
  return html
    // Strip <script>, <iframe>, <object>, <embed> tags (paired or self-closed).
    .replace(/<\/?\s*(script|iframe|object|embed|style|link|meta|base|form)\b[^>]*>/gi, "")
    // Strip on*= event handlers on any tag.
    .replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, "")
    // Strip javascript: URLs in href/src.
    .replace(/(href|src)\s*=\s*"javascript:[^"]*"/gi, '$1="#"')
    .replace(/(href|src)\s*=\s*'javascript:[^']*'/gi, "$1='#'")
}
