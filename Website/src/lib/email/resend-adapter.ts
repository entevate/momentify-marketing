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

const getFromAddress = (): string => {
  return process.env.RESEND_FROM_EMAIL || "noreply@momentify.io"
}

export async function send(params: SendParams): Promise<SendResult> {
  const result = await getClient().emails.send({
    to: params.to,
    from: params.from || getFromAddress(),
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
