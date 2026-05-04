import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { requireGtmAuth } from "@/lib/gtm/content-types"

const BLOB_TOKEN = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || ""

// Cap upload size to keep email payloads reasonable. Most email clients
// will skip embedded images >10MB anyway, and Resend has its own limits.
const MAX_BYTES = 10 * 1024 * 1024

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"] as const

/**
 * POST /api/gtm/email/upload-image
 *
 * multipart/form-data with single field `file`.
 *
 * Stores the uploaded image to Vercel Blob under
 * `gtm/email/images/<timestamp>-<random>.<ext>` and returns the public
 * URL the TipTap editor inserts as an <img src>. Public access so email
 * clients can fetch the image without auth.
 */
export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData().catch(() => null)
  if (!formData) {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 })
  }
  const file = formData.get("file")
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field" }, { status: 400 })
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `File too large (max ${MAX_BYTES / 1024 / 1024}MB)` }, { status: 413 })
  }
  // Type may be empty string when the user uploads from a context that
  // doesn't set MIME (rare). Sniff the extension as a fallback.
  const fileType = file.type || sniffMime(file.name)
  if (!ALLOWED_TYPES.includes(fileType as (typeof ALLOWED_TYPES)[number])) {
    return NextResponse.json({ error: `Unsupported type: ${fileType || "unknown"}. Use PNG, JPG, GIF, or WebP.` }, { status: 415 })
  }

  const ext = mimeToExt(fileType)
  // Random-suffixed path - lets the user re-upload similar files without collision.
  const slug = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  const blobPath = `gtm/email/images/${slug}.${ext}`

  try {
    const blob = await put(blobPath, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: fileType,
      token: BLOB_TOKEN || undefined,
    })
    return NextResponse.json({ url: blob.url, contentType: fileType, size: file.size })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed"
    console.error("[email/upload-image] blob put failed", e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

function sniffMime(filename: string): string {
  const lower = filename.toLowerCase()
  if (lower.endsWith(".png")) return "image/png"
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg"
  if (lower.endsWith(".gif")) return "image/gif"
  if (lower.endsWith(".webp")) return "image/webp"
  return ""
}

function mimeToExt(mime: string): string {
  switch (mime) {
    case "image/png": return "png"
    case "image/jpeg":
    case "image/jpg": return "jpg"
    case "image/gif": return "gif"
    case "image/webp": return "webp"
    default: return "bin"
  }
}
