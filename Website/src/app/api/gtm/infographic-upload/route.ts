import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { put } from "@vercel/blob"
import { kv } from "@vercel/kv"
import { assetBlobPath, assetKvKey } from "@/lib/gtm/asset-helpers"

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || ""

export async function POST(request: Request) {
  try {
    const { solution, htmlContent } = await request.json()

    if (!solution || !htmlContent) {
      return NextResponse.json(
        { error: "Missing solution or htmlContent" },
        { status: 400 }
      )
    }

    // Validate HTML content
    if (!htmlContent.includes("<!DOCTYPE") && !htmlContent.includes("<html")) {
      return NextResponse.json(
        { error: "Invalid HTML content" },
        { status: 400 }
      )
    }

    const filename = `${solution}-infographic.html`

    // Persist to Vercel Blob (Vercel's serverless FS is read-only, so writes
    // to public/gtm fail in prod). Deterministic path + addRandomSuffix:false
    // lets us re-upload in place, and we cache the resulting URL in KV.
    const blobPath = assetBlobPath(solution, "infographic")
    if (blobPath) {
      try {
        const blob = await put(blobPath, htmlContent, {
          access: "public",
          addRandomSuffix: false,
          contentType: "text/html; charset=utf-8",
          token: BLOB_TOKEN || undefined,
        })
        const blobUrl = blob.url

        // Cache the blob URL so asset-check can find it on page-load.
        try {
          await kv.set(assetKvKey(solution, "infographic"), blobUrl)
        } catch {
          /* KV cache is best-effort */
        }

        return NextResponse.json({
          success: true,
          previewUrl: blobUrl,
          message: "Infographic uploaded successfully",
        })
      } catch (blobErr) {
        // Local-dev fallback: when no BLOB_READ_WRITE_TOKEN is configured,
        // fall back to the filesystem so devs without blob setup still get a preview.
        console.error("[infographic-upload] blob put failed, trying local fs fallback", blobErr)
      }
    }

    // Filesystem fallback (local dev only — Vercel prod has a read-only FS)
    const dir = path.join(process.cwd(), "public/gtm")
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const filePath = path.join(dir, filename)
    fs.writeFileSync(filePath, htmlContent, "utf-8")

    return NextResponse.json({
      success: true,
      previewUrl: `/api/gtm/infographic-preview?solution=${solution}`,
      message: "Infographic uploaded successfully",
    })
  } catch (error) {
    console.error("Error uploading infographic:", error)
    return NextResponse.json(
      { error: "Failed to upload infographic" },
      { status: 500 }
    )
  }
}
