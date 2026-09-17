"use client"

import { useRef, useState, useCallback, useEffect, useMemo } from "react"
import html2canvas from "html2canvas"
import CanvasEditor from "@/components/social-toolkit/CanvasEditor"
import {
  type BackgroundDef,
  type AspectRatio,
  ASPECT_DIMENSIONS,
  getBrand,
} from "@/components/social-toolkit/backgroundData"
import { Download, ArrowLeft, RotateCw } from "lucide-react"

const font = "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif"

const SOLUTION_BRAND_MAP: Record<string, string> = {
  "trade-shows": "trade-shows",
  recruiting: "recruiting",
  "field-sales": "field-sales",
  facilities: "facilities",
  "events-venues": "venues",
}

const PLATFORM_ASPECT_MAP: Record<string, AspectRatio> = {
  linkedin: "1.91:1",
  twitter: "16:9",
  instagram: "4:5",
}

const PLATFORM_SCALES: Record<string, { fontScale: number; marginScale: number; logoScale: number }> = {
  linkedin: { fontScale: 0.696, marginScale: 1.0, logoScale: 100 },
  twitter: { fontScale: 0.66, marginScale: 1.0, logoScale: 100 },
  instagram: { fontScale: 1.09, marginScale: 1.5, logoScale: 127 },
}

// Base sizes (Statement layout)
const BASE_HEADLINE = 120
const BASE_SUBHEAD = 48
const BASE_MARGIN = 60

async function generateGraphicCopy(content: string): Promise<{ headline: string; subhead: string }> {
  try {
    const res = await fetch("/api/gtm/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        solution: "momentify",
        vertical: "channel-partners",
        motion: "direct",
        contentType: "graphic-headline",
        additionalContext: content.slice(0, 1000),
      }),
    })
    const data = await res.json()
    if (data.content) {
      const lines = data.content.trim().split("\n").filter((l: string) => l.trim())
      const headlineMatch = lines.find((l: string) => l.startsWith("HEADLINE:"))
      const subheadMatch = lines.find((l: string) => l.startsWith("SUBHEAD:"))
      return {
        headline: headlineMatch ? headlineMatch.replace("HEADLINE:", "").trim() : lines[0] || "Measure what matters.",
        subhead: subheadMatch ? subheadMatch.replace("SUBHEAD:", "").trim() : lines[1]?.replace("SUBHEAD:", "").trim() || "",
      }
    }
  } catch { /* fall through */ }
  return { headline: "Measure what matters.", subhead: "" }
}

interface GraphicGeneratorProps {
  solution: string
  content: string
  platform: "linkedin" | "twitter" | "instagram"
  selectedBackground: BackgroundDef
  onGraphicCapture?: (base64: string) => void
  onBack?: () => void
}

export default function GraphicGenerator({
  solution,
  content,
  platform,
  selectedBackground,
  onGraphicCapture,
  onBack,
}: GraphicGeneratorProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const brandId = SOLUTION_BRAND_MAP[solution] || "momentify"
  const aspectRatio = PLATFORM_ASPECT_MAP[platform] || "1:1"
  const dims = ASPECT_DIMENSIONS[aspectRatio]
  const scales = PLATFORM_SCALES[platform] || PLATFORM_SCALES.linkedin
  const [headline, setHeadline] = useState("Generating headline...")
  const [subhead, setSubhead] = useState("")
  const [copyReady, setCopyReady] = useState(false)

  // Generate graphic-specific headline via AI
  useEffect(() => {
    setCopyReady(false)
    setHeadline("Generating headline...")
    setSubhead("")
    generateGraphicCopy(content).then(({ headline: h, subhead: s }) => {
      setHeadline(h)
      setSubhead(s)
      setCopyReady(true)
    })
  }, [content])

  // Capture thumbnail for library save
  useEffect(() => {
    if (!onGraphicCapture || !canvasRef.current) return
    const timer = setTimeout(async () => {
      const el = canvasRef.current
      if (!el) return
      try {
        await document.fonts.ready
        const prevTransform = el.style.transform
        const prevOrigin = el.style.transformOrigin
        el.style.transform = "none"
        el.style.transformOrigin = ""
        const htmlEl = document.documentElement
        const prevZoom = htmlEl.style.zoom
        htmlEl.style.zoom = "1"

        const canvas = await html2canvas(el, {
          scale: 0.25,
          useCORS: true,
          backgroundColor: null,
          width: dims.w,
          height: dims.h,
        })

        el.style.transform = prevTransform
        el.style.transformOrigin = prevOrigin
        htmlEl.style.zoom = prevZoom

        onGraphicCapture(canvas.toDataURL("image/jpeg", 0.6))
      } catch {
        /* capture failed silently */
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [onGraphicCapture, dims, selectedBackground])

  const handleDownload = useCallback(async () => {
    const el = canvasRef.current
    if (!el) return
    setDownloading(true)
    try {
      await document.fonts.ready
      const prevTransform = el.style.transform
      const prevOrigin = el.style.transformOrigin
      el.style.transform = "none"
      el.style.transformOrigin = ""
      const htmlEl = document.documentElement
      const prevZoom = htmlEl.style.zoom
      htmlEl.style.zoom = "1"

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        width: dims.w,
        height: dims.h,
      })

      el.style.transform = prevTransform
      el.style.transformOrigin = prevOrigin
      htmlEl.style.zoom = prevZoom

      const link = document.createElement("a")
      const slug = headline
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 40)
      link.download = `momentify-${slug}-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (err) {
      console.error("Download failed:", err)
    } finally {
      setDownloading(false)
    }
  }, [dims, headline])

  const btnStyle = {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 6,
    padding: "8px 16px",
    borderRadius: 6,
    border: "1px solid var(--gtm-border)",
    background: "var(--gtm-bg-card)",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: font,
    color: "var(--gtm-text-primary)",
    cursor: "pointer" as const,
    transition: "all 200ms ease",
  }

  return (
    <div>
      <div
        style={{
          borderRadius: 10,
          border: "1px solid var(--gtm-border)",
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <CanvasEditor
          ref={canvasRef}
          aspectRatio={aspectRatio}
          background={selectedBackground}
          brandId={brandId}
          headline={headline}
          subhead={subhead}
          bodyCopy=""
          textPosition="center"
          showLogo={true}
          logoVariant="auto"
          logoScale={scales.logoScale}
          showUrl={false}
          urlScale={100}
          headlineFontSize={Math.round(BASE_HEADLINE * scales.fontScale)}
          headlineFontWeight={600}
          subheadFontSize={Math.round(BASE_SUBHEAD * scales.fontScale)}
          subheadFontWeight={300}
          bodyFontSize={Math.round(18 * scales.fontScale)}
          bodyFontWeight={300}
          headlineAlign="left"
          subheadAlign="left"
          bodyAlign="left"
          layoutMargin={Math.round(BASE_MARGIN * scales.marginScale)}
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {onBack && (
          <button onClick={onBack} style={btnStyle}>
            <ArrowLeft size={14} /> Choose Different Template
          </button>
        )}
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            ...btnStyle,
            background: "var(--gtm-accent-bg)",
            border: "1px solid var(--gtm-accent)",
            color: "var(--gtm-accent)",
            opacity: downloading ? 0.6 : 1,
          }}
        >
          <Download size={14} /> {downloading ? "Downloading..." : "Download PNG"}
        </button>
      </div>
    </div>
  )
}
