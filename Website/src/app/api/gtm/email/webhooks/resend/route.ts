import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import { eventId, getSendByMessageId, recordEvent } from "@/lib/gtm/email-store"
import type { EmailEvent, EmailEventType } from "@/lib/gtm/email-types"

/**
 * POST /api/gtm/email/webhooks/resend
 *
 * Receives Resend's webhook callbacks (email.delivered, email.opened,
 * email.clicked, email.bounced, email.complained, email.delivery_delayed)
 * and persists them as EmailEvent records joined to the originating
 * EmailDraft via the message-id reverse lookup.
 *
 * Auth model: NOT cookie-gated. Verifies the Svix signature header that
 * Resend (powered by Svix) sends on every webhook delivery.
 *
 * IMPORTANT: this route bypasses requireGtmAuth on purpose. The Svix
 * signature is the trust boundary.
 */
export async function POST(request: Request) {
  const rawBody = await request.text()
  const secret = process.env.RESEND_WEBHOOK_SECRET || ""

  if (!secret) {
    console.error("[resend-webhook] RESEND_WEBHOOK_SECRET not configured")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  const svixId = request.headers.get("svix-id") || ""
  const svixTimestamp = request.headers.get("svix-timestamp") || ""
  const svixSignature = request.headers.get("svix-signature") || ""

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 })
  }

  if (!verifySvixSignature(svixId, svixTimestamp, rawBody, svixSignature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let payload: ResendWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Resend event type strings: "email.delivered", "email.opened", etc.
  // Strip the "email." prefix to match our EmailEventType.
  const rawType = payload.type || ""
  const type = rawType.replace(/^email\./, "") as EmailEventType
  if (!isKnownEventType(type)) {
    // Unknown event types are acked (200) so Resend doesn't retry.
    return NextResponse.json({ ok: true, skipped: rawType })
  }

  const data = payload.data || {}
  const messageId = data.email_id || data.id || ""
  if (!messageId) {
    return NextResponse.json({ error: "Missing email id" }, { status: 400 })
  }

  // Resolve message id → send id → draft id (best effort).
  const send = await getSendByMessageId(messageId)
  const draftId = send?.draftId

  const occurredAt = data.created_at || payload.created_at || new Date().toISOString()
  const event: EmailEvent = {
    id: eventId(messageId, type, occurredAt),
    resendMessageId: messageId,
    draftId,
    type,
    occurredAt,
    url: data.click?.link || data.url,
    bounceType: data.bounce?.type,
    userAgent: data.click?.user_agent || data.open?.user_agent,
    ip: data.click?.ip_address || data.open?.ip_address,
    receivedAt: new Date().toISOString(),
  }
  await recordEvent(event)

  return NextResponse.json({ ok: true })
}

// ─── Helpers ───────────────────────────────────────────────────────────

interface ResendWebhookPayload {
  type?: string
  created_at?: string
  data?: {
    email_id?: string
    id?: string
    created_at?: string
    click?: { link?: string; user_agent?: string; ip_address?: string }
    open?: { user_agent?: string; ip_address?: string }
    bounce?: { type?: "hard" | "soft" | "transient" }
    url?: string
  }
}

function isKnownEventType(t: string): t is EmailEventType {
  return (
    t === "delivered" ||
    t === "opened" ||
    t === "clicked" ||
    t === "bounced" ||
    t === "complained" ||
    t === "delivery_delayed"
  )
}

/**
 * Verify a Svix signature header.
 *
 * Format: `svix-signature: v1,<base64sig> v1,<base64sig>` (one or more
 * space-separated `v1,<sig>` pairs - Svix ships >1 during secret rotation).
 *
 * Signed payload: `${svix_id}.${svix_timestamp}.${rawBody}` HMAC-SHA256
 * with the webhook secret (the part after `whsec_` is base64-decoded for
 * the HMAC key).
 */
function verifySvixSignature(
  svixId: string,
  svixTimestamp: string,
  body: string,
  signatureHeader: string,
  secret: string,
): boolean {
  // Drop the `whsec_` prefix Resend ships and base64-decode the actual key.
  const keyBase64 = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret
  let key: Buffer
  try {
    key = Buffer.from(keyBase64, "base64")
  } catch {
    return false
  }
  const signedPayload = `${svixId}.${svixTimestamp}.${body}`
  const expected = createHmac("sha256", key).update(signedPayload).digest("base64")
  // Header may have multiple "v1,<sig>" tokens; any match is acceptable.
  const tokens = signatureHeader.split(" ").map((t) => t.trim()).filter(Boolean)
  for (const token of tokens) {
    const [version, sig] = token.split(",")
    if (version !== "v1" || !sig) continue
    try {
      const a = Buffer.from(sig, "base64")
      const b = Buffer.from(expected, "base64")
      if (a.length === b.length && timingSafeEqual(a, b)) return true
    } catch {
      // ignore malformed tokens, try next
    }
  }
  return false
}
