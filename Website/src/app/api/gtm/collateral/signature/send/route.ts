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

  const doc = wrapForEmail(html)

  let res: Response
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject: "Your Momentify signature — open in Mail, Select All, Copy, then paste into Settings → Mail → Signature", html: doc }),
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

/**
 * The email body is ONLY the signature, so a phone "Select All → Copy" grabs
 * exactly the signature and nothing else (install steps live in the subject).
 * color-scheme:light stops Mail from dark-mode-inverting the light signature.
 */
function wrapForEmail(signature: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head><body style="margin:0;padding:16px;background:#ffffff;-webkit-text-size-adjust:100%;">${signature}</body></html>`
}
