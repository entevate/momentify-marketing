"use client"

/**
 * TemplatesGallery - browse-only gallery of social-post templates rendered
 * through /api/gtm/template-preview.
 *
 * Controls:
 *   - Solution selector (Momentify's five GTM pillars)
 *   - Aspect filter (All / 1:1 / 4:5 / 16:9)
 *   - Reload-all (cache-bust every iframe)
 *   - Preview per card (the enlarged TemplatePreviewModal, as in the fleet's
 *     galleries). This replaced "Copy link": template-preview now requires the
 *     GTM login, so a copied URL 401s for anyone outside the app.
 */

import React, { useCallback, useMemo, useState } from "react"
import { allTemplates } from "@/lib/gtm/templates/_registry"
import type { TemplateManifest } from "@/lib/gtm/templates/types"
import { pillarPalettes, pillarLabels, type PillarId } from "@/lib/gtm/pillar-palettes"
import { Maximize2, RefreshCw } from "lucide-react"
import TemplatePreviewModal from "@/components/gtm/TemplatePreviewModal"

const font = "var(--gtm-font-body)"

type AspectFilter = "all" | "1:1" | "4:5" | "16:9"

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
  // Initialize to 0 so server and client render the same iframe src.
  // After mount, the user can bump it via the reload button to cache-bust.
  const [reloadToken, setReloadToken] = useState(0)
  const [preview, setPreview] = useState<TemplateManifest | null>(null)

  const visibleTemplates = useMemo(
    () => allTemplates.filter((t) => aspectFilter === "all" || t.aspectRatio === aspectFilter),
    [aspectFilter]
  )

  const previewUrl = useCallback(
    (templateId: string, assetType: string): string =>
      `/api/gtm/template-preview?assetType=${encodeURIComponent(assetType)}&templateId=${encodeURIComponent(templateId)}&pillar=${pillar}&r=${reloadToken}`,
    [pillar, reloadToken]
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
              // Pillar swatch colors are data (the palette itself), not theme.
              const meta = pillarPalettes[id]
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPillar(id)}
                  style={{
                    ...chipStyle,
                    background: active ? meta.primary : "var(--gtm-bg-card)",
                    color: active ? "var(--gtm-bg-card)" : "var(--gtm-text-secondary)", // white on the pillar swatch, as .btn-primary does
                    borderColor: active ? meta.primary : "var(--gtm-border)",
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
            {(["all", "1:1", "4:5", "16:9"] as AspectFilter[]).map((a) => {
              const active = aspectFilter === a
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAspectFilter(a)}
                  style={{
                    ...chipStyle,
                    background: active ? "var(--gtm-accent-bg)" : "var(--gtm-bg-card)",
                    color: active ? "var(--gtm-accent-ink)" : "var(--gtm-text-secondary)",
                    borderColor: active ? "var(--gtm-accent)" : "var(--gtm-border)",
                  }}
                >
                  {a}
                </button>
              )
            })}
          </div>
        </div>

        <button type="button" onClick={() => setReloadToken(Date.now())} className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }}>
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
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gtm-text-primary)" }}>{t.label}</div>
                <div style={{ fontSize: 12, color: "var(--gtm-text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis" }}>
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
              <code className="mono" style={{ fontSize: 11, color: "var(--gtm-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                {t.assetType}/{t.id}
              </code>
              <button type="button" onClick={() => setPreview(t)} style={previewBtnStyle}>
                <Maximize2 size={11} />
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <TemplatePreviewModal
          manifest={preview}
          solution={pillar}
          isActive={false}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  )
}

// ─── Styles ─────────────────────────────────────────────────────────────

const controlsBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 24,
  padding: "14px 18px",
  background: "var(--gtm-bg-card)",
  border: "1px solid var(--gtm-border)",
  borderRadius: "var(--gtm-radius-card)",
  marginBottom: 20,
  flexWrap: "wrap",
}

const controlGroupStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10 }

const controlLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--gtm-text-muted)",
}

const chipRowStyle: React.CSSProperties = { display: "flex", gap: 6, flexWrap: "wrap" }

const chipStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: font,
  border: "1px solid var(--gtm-border)",
  borderRadius: 100,
  cursor: "pointer",
}

const cardStyle: React.CSSProperties = {
  padding: 14,
  background: "var(--gtm-bg-card)",
  border: "1px solid var(--gtm-border)",
  borderRadius: "var(--gtm-radius-card)",
}

const aspectPillStyle: React.CSSProperties = {
  flexShrink: 0,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.06em",
  padding: "3px 8px",
  borderRadius: 100,
  background: "var(--gtm-surface-2)",
  color: "var(--gtm-text-secondary)",
}

function iframeWrapStyle(aspect: "1:1" | "4:5" | "16:9"): React.CSSProperties {
  const aspectRatio =
    aspect === "1:1" ? "1 / 1"
    : aspect === "4:5" ? "4 / 5"
    : "16 / 9"
  return {
    width: "100%",
    aspectRatio,
    background: "var(--gtm-surface-2)",
    border: "1px solid var(--gtm-border)",
    borderRadius: "var(--gtm-radius-control)",
    overflow: "hidden",
  }
}

const iframeStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  border: "none",
  display: "block",
  background: "var(--gtm-bg-card)",
}

const previewBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "5px 10px",
  fontSize: 11,
  fontWeight: 600,
  fontFamily: font,
  background: "var(--gtm-bg-card)",
  color: "var(--gtm-text-secondary)",
  border: "1px solid var(--gtm-border)",
  borderRadius: "var(--gtm-radius-control)",
  cursor: "pointer",
}
