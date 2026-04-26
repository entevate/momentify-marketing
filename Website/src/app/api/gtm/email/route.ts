import { NextRequest, NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { send, sendBatch, type SendParams } from "@/lib/email/resend-adapter"

export async function POST(request: NextRequest) {
  // Auth check
  const isAuthed = await requireGtmAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Check if batch send or single send
    if (body.batch && Array.isArray(body.batch)) {
      // Batch send
      const result = await sendBatch(body.batch as SendParams[])
      return NextResponse.json(result)
    } else {
      // Single send
      const params: SendParams = {
        to: body.to,
        subject: body.subject,
        html: body.html,
        from: body.from,
        replyTo: body.replyTo,
      }

      const result = await send(params)
      return NextResponse.json(result)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
