import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { put } from "@vercel/blob"
import { kv } from "@vercel/kv"
import {
  assetBlobPath,
  assetFilename,
  assetKvKey,
  isValidAssetParam,
} from "@/lib/gtm/asset-helpers"

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || ""

/**
 * POST /api/gtm/asset-upload
 * Body: { solution, assetType, htmlContent, itemId? }
 * Saves HTML to Vercel Blob at gtm/assets/{solution}-{assetType}[-{itemId}].html.
 * When itemId is present, the asset is scoped to that Library item.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { solution, assetType, htmlContent, itemId } = body ?? {}

    if (!solution || !assetType || !htmlContent) {
      return NextResponse.json(
        { error: "Missing solution, assetType, or htmlContent" },
        { status: 400 }
      )
    }
    if (!isValidAssetParam(solution) || !isValidAssetParam(assetType)) {
      return NextResponse.json({ error: "Invalid solution or assetType format" }, { status: 400 })
    }
    if (itemId && !isValidAssetParam(itemId)) {
      return NextResponse.json({ error: "Invalid itemId format" }, { status: 400 })
    }

    if (typeof htmlContent !== "string" || htmlContent.length < 50) {
      return NextResponse.json({ error: "htmlContent must be a non-empty HTML string" }, { status: 400 })
    }
    if (!htmlContent.includes("<!doctype") && !htmlContent.includes("<!DOCTYPE") && !htmlContent.includes("<html")) {
      return NextResponse.json({ error: "Invalid HTML: missing DOCTYPE or html tag" }, { status: 400 })
    }

    const blobPath = assetBlobPath(solution, assetType, itemId)
    if (!blobPath) {
      return NextResponse.json({ error: "Could not resolve asset path" }, { status: 400 })
    }
    const filename = assetFilename(solution, assetType, itemId)

    let url: string
    try {
      const blob = await put(blobPath, htmlContent, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "text/html; charset=utf-8",
        token: BLOB_TOKEN || undefined,
      })
      url = blob.url
    } catch (blobErr) {
      console.error("[asset-upload] blob put failed, trying local fs fallback", blobErr)
      try {
        const dir = path.join(process.cwd(), "public/gtm")
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, filename), htmlContent, "utf-8")
        url = `/gtm/${filename}`
      } catch (fsErr) {
        console.error("[asset-upload] local fs fallback failed", fsErr)
        return NextResponse.json({ error: "Could not save asset (blob + fs both failed)" }, { status: 500 })
      }
    }

    // Cache the raw blob URL so the /asset-preview proxy can fetch it.
    try {
      await kv.set(assetKvKey(solution, assetType, itemId), url)
    } catch {
      /* KV cache is best-effort */
    }

    // Return the proxy URL so the iframe can render inline (Vercel Blob
    // forces .html downloads + strict CSP when hit directly).
    const proxyUrl = url.startsWith("http")
      ? `/api/gtm/asset-preview?solution=${encodeURIComponent(solution)}&assetType=${encodeURIComponent(assetType)}${itemId ? `&itemId=${encodeURIComponent(itemId)}` : ""}`
      : url

    return NextResponse.json({ success: true, url: proxyUrl, filename })
  } catch (error) {
    console.error("[asset-upload] error", error)
    return NextResponse.json({ error: "Failed to save asset" }, { status: 500 })
  }
}
