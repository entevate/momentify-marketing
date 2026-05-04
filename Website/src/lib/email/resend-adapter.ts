/**
 * Resend Email Adapter
 *
 * Required environment variables:
 * - RESEND_API_KEY (required): API key for Resend service
 * - RESEND_FROM_EMAIL (optional): Default sender email, defaults to noreply@momentify.io
 */

import { Resend } from "resend"

let _resend: Resend | null = null
function getClient(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export interface SendParams {
  to: string
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export interface SendResult {
  id: string
}

export interface BatchFailure {
  to: string
  error: string
}

export interface SendBatchResult {
  ids: string[]
  failures: BatchFailure[]
}

/**
 * Build the RFC 5322 `From:` value combining a display name + email
 * address. Output format: `"Momentify <hello@momentifyapp.com>"` so
 * recipients see the friendly name in their inbox instead of the bare
 * email.
 *
 * Env vars:
 *   RESEND_FROM_NAME   - display name (default "Momentify")
 *   RESEND_FROM_EMAIL  - sender address (default "hello@momentifyapp.com")
 *
 * If a caller passes a literal `from` field (e.g. ComposePane sender
 * override), we use it as-is. They're responsible for valid format.
 *
 * Backwards-compat: if RESEND_FROM_EMAIL already contains `<>` (RFC 5322
 * full form), we pass it through untouched.
 */
const getFromAddress = (): string => {
  const email = process.env.RESEND_FROM_EMAIL || "hello@momentifyapp.com"
  // If env var already includes `Name <addr>` form, trust it.
  if (/<[^>]+>/.test(email)) return email
  const name = process.env.RESEND_FROM_NAME || "Momentify"
  // Quote name only if it contains special chars (Resend / RFC 5322
  // accepts unquoted simple names).
  const quotedName = /[",;:<>@]/.test(name) ? `"${name.replace(/"/g, '\\"')}"` : name
  return `${quotedName} <${email}>`
}

/**
 * Resend accepts `from` in two formats:
 *   1. bare email: "addr@domain.tld"
 *   2. display:    "Name <addr@domain.tld>"
 * Anything else (no @, just a name, malformed RFC) gets rejected with
 * "Invalid `from` field". Pre-validate so a bad per-draft override
 * doesn't tank the send - fall back to the configured default.
 */
function safeFromAddress(maybeFrom: string | undefined): string {
  const candidate = (maybeFrom || "").trim()
  if (!candidate) return getFromAddress()
  // Display form: must have <email@domain> at the end
  if (/<[^@<>]+@[^@<>]+\.[^@<>]+>\s*$/.test(candidate)) return candidate
  // Bare email form: just email@domain.tld with no spaces
  if (/^[^\s<>]+@[^\s<>]+\.[^\s<>]+$/.test(candidate)) return candidate
  return getFromAddress()
}

export async function send(params: SendParams): Promise<SendResult> {
  const result = await getClient().emails.send({
    to: params.to,
    from: safeFromAddress(params.from),
    subject: params.subject,
    html: params.html,
    replyTo: params.replyTo,
  })

  if (result.error) {
    throw new Error(`Failed to send email to ${params.to}: ${result.error.message}`)
  }

  return {
    id: result.data?.id || "",
  }
}

export async function sendBatch(emails: SendParams[]): Promise<SendBatchResult> {
  const ids: string[] = []
  const failures: BatchFailure[] = []

  for (const email of emails) {
    try {
      const result = await send(email)
      ids.push(result.id)
    } catch (error) {
      failures.push({
        to: email.to,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return {
    ids,
    failures,
  }
}
