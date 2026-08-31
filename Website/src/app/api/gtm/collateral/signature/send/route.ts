import { requireGtmAuth } from "@/lib/gtm/content-types"

export const runtime = "nodejs"

/**
 * Email the finished signature to a recipient so it can be installed on a phone.
 *
 * iOS Mail signatures set through Settings → Mail → Signature only keep their
 * formatting when the content is COPIED FROM AN EMAIL (a pasted browser
 * selection is flattened). So the reliable install path is: receive this mail,
 * open it in Mail, Select All → Copy the signature, paste into Settings. The
 * body carries those three steps above a boxed copy of the signature.
 *
 * Sends through the Resend HTTP API (no npm dep); needs RESEND_API_KEY +
 * RESEND_FROM_EMAIL. Cookie-gated like the rest of Momentify's GTM API.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SendBody {
  html?: string
  to?: string
  label?: string
}

export async function POST(req: Request) {
  if (!(await requireGtmAuth())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: "Email sending is not configured: RESEND_API_KEY is missing" }, { status: 503 })
  }
  const from = process.env.RESEND_FROM_EMAIL
  if (!from) {
    return Response.json({ error: "Email sending is not configured: RESEND_FROM_EMAIL is missing" }, { status: 503 })
  }

  let body: SendBody
  try {
    body = (await req.json()) as SendBody
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const to = (body.to ?? "").trim()
  const html = body.html ?? ""
  if (!EMAIL_RE.test(to)) return Response.json({ error: "A valid recipient email is required" }, { status: 400 })
  if (html.trim().length < 40) return Response.json({ error: "There is no signature to send yet" }, { status: 400 })

  const doc = wrapForEmail(html, body.label)

  let res: Response
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject: "Your Momentify email signature", html: doc }),
    })
  } catch (err) {
    return Response.json({ error: `Could not reach the email service: ${err instanceof Error ? err.message : "error"}` }, { status: 502 })
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    return Response.json({ error: `The email service rejected the send (${res.status}): ${detail.slice(0, 200)}` }, { status: 502 })
  }

  return Response.json({ ok: true, to })
}

/** Frame the signature with the three-step iOS install instructions. */
function wrapForEmail(signature: string, label?: string): string {
  const who = label ? ` ${escapeHtml(label)}` : ""
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:24px;background:#F4F5F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0C1220;">
  <div style="max-width:600px;margin:0 auto;">
    <p style="font-size:15px;line-height:1.5;margin:0 0 6px;font-weight:700;">Install${who} email signature on your iPhone</p>
    <ol style="font-size:13px;line-height:1.65;color:#5A6577;margin:0 0 20px;padding-left:20px;">
      <li>Open this email in the <b>Mail</b> app (not a preview).</li>
      <li>Press and hold the signature below, choose <b>Select&nbsp;All</b>, then <b>Copy</b>.</li>
      <li>Go to <b>Settings → Mail → Signature</b> and paste. Formatting is kept because you copied it from Mail.</li>
    </ol>
    <div style="background:#FFFFFF;border:1px solid #E4E9F0;border-radius:10px;padding:20px;">
      ${signature}
    </div>
    <p style="font-size:11px;line-height:1.5;color:#94A0AD;margin:16px 0 0;">Sent from the Momentify signature builder.</p>
  </div>
</body></html>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
