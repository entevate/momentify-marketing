/**
 * GTM Email Module — type definitions.
 *
 * EmailDraft, EmailSendRecord, EmailEvent are persisted in KV under the
 * `gtm:email:*` namespace. EmailContact and EmailList are NOT persisted
 * in KV — they live in Resend's Audience API (single source of truth).
 * The Resend types here mirror the SDK response shapes for client code.
 */

// ─── Resend mirrors ────────────────────────────────────────────────────

export interface ResendAudience {
  id: string
  name: string
  createdAt: string
}

export interface ResendContact {
  id: string
  email: string
  firstName?: string
  lastName?: string
  audienceId: string
  unsubscribed: boolean
  createdAt: string
}

// ─── Recipients ────────────────────────────────────────────────────────

/**
 * A single addressable recipient on a draft. We support three kinds so
 * users can mix and match — e.g. a saved Audience plus a few individual
 * contacts plus an ad-hoc raw email pasted into the recipient picker.
 */
export type EmailRecipient =
  | { kind: "contact"; audienceId: string; contactId: string }
  | { kind: "raw"; email: string; name?: string }
  | { kind: "audience"; audienceId: string }

// ─── Drafts ────────────────────────────────────────────────────────────

export type EmailStatus = "draft" | "scheduled" | "sent" | "failed"

export interface EmailDraft {
  id: string
  subject: string
  /** Canonical body source — TipTap HTML output. Sanitized server-side on save. */
  bodyHtml: string
  /**
   * When false, body wraps in the Momentify branded shell at send time.
   * When true, bodyHtml is sent as-is (caller is responsible for valid HTML).
   */
  rawHtmlMode: boolean
  recipients: EmailRecipient[]
  /** Override of RESEND_FROM_EMAIL. Must be a verified sender on the Resend account. */
  fromEmail?: string
  replyTo?: string
  /** Provenance — when seeded from a Library item. */
  libraryItemId?: string
  /** 0..2 for the 3-touch cold-emails sequence. */
  libraryTouchIndex?: number
  status: EmailStatus
  /** ISO date+time the draft is targeted to fire. Present iff status === "scheduled". */
  scheduledFor?: string
  /**
   * When status === "scheduled":
   *   true  → cron auto-fires the send when scheduledFor is reached
   *   false → manual Send Now from the calendar task only
   */
  autoSend: boolean
  /** Bidirectional link to the CalendarTask (when scheduled). */
  calendarTaskId?: string
  /** Pillar context — drives palette + ROX framing on the branded wrapper. */
  solution?: string
  motion?: string
  createdAt: string
  updatedAt: string
}

// ─── Send records ──────────────────────────────────────────────────────

/**
 * One record per resolved recipient per send attempt. The `resendMessageId`
 * is the join key for webhook events (delivered / opened / clicked / etc.).
 */
export interface EmailSendRecord {
  id: string
  draftId: string
  to: string
  subject: string
  sentAt: string
  resendMessageId?: string
  status: "sent" | "failed"
  errorMessage?: string
}

// ─── Webhook events ────────────────────────────────────────────────────

export type EmailEventType =
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "complained"
  | "delivery_delayed"

export interface EmailEvent {
  /** Deterministic id `hash(messageId + type + occurredAt)` for dedupe. */
  id: string
  resendMessageId: string
  /** Resolved at ingest by reverse-lookup `gtm:email:send:by-msgid:{messageId}`. */
  draftId?: string
  type: EmailEventType
  occurredAt: string
  /** When type === "clicked". */
  url?: string
  /** When type === "bounced". */
  bounceType?: "hard" | "soft" | "transient"
  userAgent?: string
  ip?: string
  /** When our webhook handler saw the event. */
  receivedAt: string
}

// ─── Metrics roll-ups ──────────────────────────────────────────────────

export interface EmailDraftMetrics {
  draftId: string
  sent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  complained: number
  /** delivered / sent (0..1). */
  deliveryRate: number
  /** opened / delivered (0..1). */
  openRate: number
  /** clicked / delivered (0..1). */
  clickRate: number
  /** bounced / sent (0..1). */
  bounceRate: number
}

export interface EmailAggregateMetrics extends EmailDraftMetrics {
  totalDrafts: number
  byStatus: Record<EmailStatus, number>
}

// ─── KV key helpers ────────────────────────────────────────────────────

export const EMAIL_KV = {
  draft: (id: string) => `gtm:email:draft:${id}`,
  draftIndex: "gtm:email:draft:index",
  send: (id: string) => `gtm:email:send:${id}`,
  sendIndex: "gtm:email:send:index",
  /** Reverse lookup at webhook ingest: messageId → sendId. */
  sendByMessageId: (messageId: string) => `gtm:email:send:by-msgid:${messageId}`,
  event: (id: string) => `gtm:email:event:${id}`,
  eventIndex: "gtm:email:event:index",
  /** Per-draft event set, lets metrics aggregate without scanning the global index. */
  eventsByDraft: (draftId: string) => `gtm:email:event:by-draft:${draftId}`,
} as const
