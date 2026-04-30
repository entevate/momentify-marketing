import { NextResponse } from "next/server"
import JSZip from "jszip"
import { kv } from "@/lib/gtm/kv-store"
import { assetKvKey, isValidAssetParam } from "@/lib/gtm/asset-helpers"
import { resolveAssetUrl, deterministicAssetUrl } from "@/lib/gtm/blob-url"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { renderManyHtmlToPng } from "@/lib/gtm/render-png"

// PNG rendering needs Node + a longer budget than the default 10s.
export const runtime = "nodejs"
export const maxDuration = 120

/**
 * GET /api/gtm/carousel-download?solution=<pillar>&itemId=<id>&format=<png|html|both>
 *
 * Returns a .zip of the carousel assets. Default format=both:
 *   - card-1.png through card-6.png   (rasterized 1080x1080)
 *   - card-1.html through card-6.html (source rendered HTML)
 *   - carousel.html (swipeable shell with all 6 cards)
 *
 * format=png  -> only the 6 PNGs
 * format=html -> only the 7 HTMLs (legacy behavior)
 *
 * Card + shell URLs come from KV (populated by /api/gtm/fill-carousel).
 * Each HTML is fetched fresh from blob storage; PNGs are produced via
 * headless Chromium (one tab at a time to bound memory).
 */
export async function GET(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const solution = url.searchParams.get("solution") || ""
  const itemId = url.searchParams.get("itemId") || ""
  const format = (url.searchParams.get("format") || "both").toLowerCase()

  if (!solution || !itemId) {
    return NextResponse.json({ error: "Missing solution or itemId" }, { status: 400 })
  }
  if (!isValidAssetParam(solution) || !isValidAssetParam(itemId)) {
    return NextResponse.json({ error: "Invalid solution or itemId format" }, { status: 400 })
  }
  if (format !== "both" && format !== "png" && format !== "html") {
    return NextResponse.json({ error: "format must be both | png | html" }, { status: 400 })
  }

  // Resolve the shell URL via KV-then-deterministic. The card URLs are
  // serialized as a JSON array under `<key>:cards`; if that's missing we
  // fall back to deriving each card's deterministic public blob URL
  // from the same itemId pattern fill-carousel uses (`<itemId>_c1`..`_c6`).
  const baseKey = assetKvKey(solution, "carousel", itemId)
  const shellUrl = await resolveAssetUrl(solution, "carousel", itemId)
  if (!shellUrl) {
    return NextResponse.json(
      { error: "Carousel not found. Generate it first." },
      { status: 404 }
    )
  }

  let cardUrls: string[] = []
  try {
    const cardsRaw = await kv.get<string>(`${baseKey}:cards`)
    if (cardsRaw) {
      const parsed = JSON.parse(cardsRaw)
      if (Array.isArray(parsed) && parsed.every((u) => typeof u === "string")) {
        cardUrls = parsed
      }
    }
  } catch {
    /* fall through to deterministic recovery */
  }
  if (cardUrls.length !== 6) {
    // KV miss - derive the 6 card URLs deterministically.
    const derived: string[] = []
    for (let i = 1; i <= 6; i++) {
      const cardItemId = `${itemId}_c${i}`
      const u = deterministicAssetUrl(solution, "carousel", cardItemId)
      if (!u) {
        return NextResponse.json(
          { error: "Cannot derive card URLs (no blob token). Regenerate the carousel." },
          { status: 500 }
        )
      }
      derived.push(u)
    }
    cardUrls = derived
    // Best-effort backfill so future requests skip the derivation.
    kv.set(`${baseKey}:cards`, JSON.stringify(cardUrls)).catch(() => { /* ignore */ })
  }

  // Fetch every card + the shell in parallel. If a card URL is a
  // same-origin /gtm/... fallback path, prefix with the request origin
  // so server-side fetch resolves it.
  const origin = url.origin
  const resolveUrl = (u: string) => (u.startsWith("http") ? u : `${origin}${u}`)

  let shellHtml: string
  let cardHtmls: string[]
  try {
    const responses = await Promise.all([
      fetch(resolveUrl(shellUrl)),
      ...cardUrls.map((u) => fetch(resolveUrl(u))),
    ])
    for (const r of responses) {
      if (!r.ok) throw new Error(`fetch ${r.url} → ${r.status}`)
    }
    const texts = await Promise.all(responses.map((r) => r.text()))
    shellHtml = texts[0]
    cardHtmls = texts.slice(1)
  } catch (e) {
    console.error("[carousel-download] fetch failed", e)
    return NextResponse.json({ error: "Could not fetch all carousel assets" }, { status: 502 })
  }

  // Assemble the zip. PNGs are rendered when requested; HTMLs are
  // included for the html / both formats.
  const zip = new JSZip()

  if (format === "html" || format === "both") {
    cardHtmls.forEach((html, i) => {
      zip.file(`card-${i + 1}.html`, html)
    })
    zip.file("carousel.html", shellHtml)
  }

  if (format === "png" || format === "both") {
    let pngs: Buffer[]
    try {
      pngs = await renderManyHtmlToPng(cardHtmls)
    } catch (e) {
      console.error("[carousel-download] png render failed", e)
      const msg = e instanceof Error ? e.message : "PNG render failed"
      return NextResponse.json({ error: msg }, { status: 500 })
    }
    pngs.forEach((buf, i) => {
      zip.file(`card-${i + 1}.png`, buf)
    })
  }

  const zipBlob = await zip.generateAsync({ type: "uint8array" })

  return new NextResponse(zipBlob as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="momentify-${solution}-carousel-${itemId}.zip"`,
      "Content-Length": String(zipBlob.byteLength),
    },
  })
}
