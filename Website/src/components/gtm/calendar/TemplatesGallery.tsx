"use client"

/**
 * TemplatesGallery - browse-only gallery of social-post templates rendered
 * through /api/gtm/template-preview.
 *
 * Controls:
 *   - Solution selector (Momentify's five GTM pillars)
 *   - Aspect filter (All / 1:1 / 3:4 / 16:9)
 *   - Reload-all (cache-bust every iframe)
 *   - Copy-link per card
 */

import React, { useCallback, useMemo, useState } from "react"
import { allTemplates } from "@/lib/gtm/templates/_registry"
import { pillarPalettes, pillarLabels, type PillarId } from "@/lib/gtm/pillar-palettes"
import { Check, Link as LinkIcon, RefreshCw } from "lucide-react"

const font = "'Inter', system-ui, -apple-system, sans-serif"

type AspectFilter = "all" | "1:1" | "3:4" | "16:9"

export interface TemplatesGalleryProps {
  /** Initial pillar for the selector (default "trade-shows"). */
  defaultPillar?: PillarId
  /** Max inner width of the gallery (default 1400). Lets Calendar scope it. */
  maxWidth?: number
}

export default function TemplatesGallery({
  defaultPillar = "trade-shows",
  maxWidth = 1400,
}: TemplatesGalleryProps) {
  const [pillar, setPillar] = useState<PillarId>(defaultPillar)
  const [aspectFilter, setAspectFilter] = useState<AspectFilter>("all")
  const [reloadToken, setReloadToken] = useState(Date.now())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const visibleTemplates = useMemo(
    () => allTemplates.filter((t) => aspectFilter === "all" || t.aspectRatio === aspectFilter),
    [aspectFilter]
  )

  const previewUrl = useCallback(
    (templateId: string, assetType: string): string =>
      `/api/gtm/template-preview?assetType=${encodeURIComponent(assetType)}&templateId=${encodeURIComponent(templateId)}&pillar=${pillar}&r=${reloadToken}`,
    [pillar, reloadToken]
  )

  const handleCopyLink = useCallback(
    async (templateId: string, assetType: string) => {
      const abs = `${window.location.origin}/api/gtm/template-preview?assetType=${encodeURIComponent(assetType)}&templateId=${encodeURIComponent(templateId)}&pillar=${pillar}`
      try {
        await navigator.clipboard.writeText(abs)
        setCopiedId(templateId)
        setTimeout(() => setCopiedId((c) => (c === templateId ? null : c)), 1500)
      } catch {
        /* ignore clipboard failures */
      }
    },
    [pillar]
  )

  return (
    <div style={{ maxWidth, margin: "0 auto", fontFamily: font }}>
      {/* Controls */}
      <div style={controlsBarStyle}>
        <div style={controlGroupStyle}>
          <span style={controlLabelStyle}>Solution</span>
          <div style={chipRowStyle}>
            {(Object.keys(pillarPalettes) as PillarId[]).map((id) => {
              const active = pillar === id
              const meta = pillarPalettes[id]
              return (
                <button
                  key={id}
                  onClick={() => setPillar(id)}
                  style={{
                    ...chipStyle,
                    background: active ? meta.primary : "#fff",
                    color: active ? "#fff" : "#6b6b6b",
                    borderColor: active ? meta.primary : "#dde6f0",
                  }}
                >
                  {pillarLabels[id]}
                </button>
              )
            })}
          </div>
        </div>

        <div style={controlGroupStyle}>
          <span style={controlLabelStyle}>Aspect</span>
          <div style={chipRowStyle}>
            {(["all", "1:1", "3:4", "16:9"] as AspectFilter[]).map((a) => {
              const active = aspectFilter === a
              return (
                <button
                  key={a}
                  onClick={() => setAspectFilter(a)}
                  style={{
                    ...chipStyle,
                    background: active ? "rgba(43,191,168,0.08)" : "#fff",
                    color: active ? "#00BBA5" : "#6b6b6b",
                    borderColor: active ? "#00BBA5" : "#dde6f0",
                  }}
                >
                  {a}
                </button>
              )
            })}
          </div>
        </div>

        <button onClick={() => setReloadToken(Date.now())} style={reloadBtnStyle}>
          <RefreshCw size={13} />
          Reload all
        </button>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {visibleTemplates.map((t) => (
          <div key={t.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#181818" }}>{t.label}</div>
                <div style={{ fontSize: 12, color: "#6b6b6b", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {t.description}
                </div>
              </div>
              <div style={aspectPillStyle}>{t.aspectRatio}</div>
            </div>

            <div style={iframeWrapStyle(t.aspectRatio)}>
              <iframe
                key={`${t.id}-${pillar}-${reloadToken}`}
                src={previewUrl(t.id, t.assetType)}
                title={`${t.label} preview`}
                style={iframeStyle}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 10 }}>
              <code style={{ fontSize: 11, color: "#a8a8a8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                {t.assetType}/{t.id}
              </code>
              <button onClick={() => handleCopyLink(t.id, t.assetType)} style={copyBtnStyle}>
                {copiedId === t.id ? (
                  <>
                    <Check size={11} />
                    Copied
                  </>
                ) : (
                  <>
                    <LinkIcon size={11} />
                    Copy link
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Styles ─────────────────────────────────────────────────────────────

const controlsBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 24,
  padding: "14px 18px",
  background: "#fff",
  border: "1px solid #dde6f0",
  borderRadius: 6,
  marginBottom: 20,
  flexWrap: "wrap",
}

const controlGroupStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10 }

const controlLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#a8a8a8",
}

const chipRowStyle: React.CSSProperties = { display: "flex", gap: 6 }

const chipStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: font,
  border: "1px solid #dde6f0",
  borderRadius: 100,
  cursor: "pointer",
}

const reloadBtnStyle: React.CSSProperties = {
  marginLeft: "auto",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 14px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: font,
  background: "#00BBA5",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
}

const cardStyle: React.CSSProperties = {
  padding: 14,
  background: "#fff",
  border: "1px solid #dde6f0",
  borderRadius: 6,
}

const aspectPillStyle: React.CSSProperties = {
  flexShrink: 0,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.06em",
  padding: "3px 8px",
  borderRadius: 100,
  background: "#f6f8fb",
  color: "#6b6b6b",
}

function iframeWrapStyle(aspect: "1:1" | "3:4" | "16:9"): React.CSSProperties {
  const aspectRatio =
    aspect === "1:1" ? "1 / 1"
    : aspect === "3:4" ? "3 / 4"
    : "16 / 9"
  return {
    width: "100%",
    aspectRatio,
    background: "#f6f8fb",
    border: "1px solid #dde6f0",
    borderRadius: 6,
    overflow: "hidden",
  }
}

const iframeStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  border: "none",
  display: "block",
  background: "#fff",
}

const copyBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "5px 10px",
  fontSize: 11,
  fontWeight: 600,
  fontFamily: font,
  background: "#fff",
  color: "#6b6b6b",
  border: "1px solid #dde6f0",
  borderRadius: 6,
  cursor: "pointer",
}
