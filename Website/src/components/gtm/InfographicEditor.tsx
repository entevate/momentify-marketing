"use client"

import { useState } from "react"
import { X, RotateCw } from "lucide-react"

interface InfographicEditorProps {
  solution: string
  output: string // Original generated brief
  onClose: () => void
  onRegenerate: (updatedContent: string) => void
  isLoading: boolean
}

export default function InfographicEditor({
  solution,
  output,
  onClose,
  onRegenerate,
  isLoading,
}: InfographicEditorProps) {
  const [headline, setHeadline] = useState("")
  const [subhead, setSubhead] = useState("")
  const [eyebrow, setEyebrow] = useState("")

  const handleRegenerate = () => {
    // Construct modified brief with user edits
    const modifiedContent = `${output}\n\n--- EDITS ---\nHeadline: ${headline}\nSubhead: ${subhead}\nEyebrow: ${eyebrow}`
    onRegenerate(modifiedContent)
    onClose()
  }

  const font = "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif"

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--gtm-bg-page)",
          borderRadius: 12,
          padding: 32,
          maxWidth: 500,
          width: "90%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: font, color: "var(--gtm-text-primary)", margin: 0 }}>
            Edit Infographic Content
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--gtm-text-muted)",
              padding: 0,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 8, color: "var(--gtm-text-muted)", fontFamily: font }}>
              Eyebrow Text (Optional)
            </label>
            <input
              type="text"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="e.g., MOMENTIFY INSIGHTS"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid var(--gtm-border)",
                background: "var(--gtm-bg-card)",
                fontFamily: font,
                fontSize: 14,
                color: "var(--gtm-text-primary)",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 8, color: "var(--gtm-text-muted)", fontFamily: font }}>
              Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Main headline text"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid var(--gtm-border)",
                background: "var(--gtm-bg-card)",
                fontFamily: font,
                fontSize: 14,
                color: "var(--gtm-text-primary)",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 8, color: "var(--gtm-text-muted)", fontFamily: font }}>
              Subhead
            </label>
            <textarea
              value={subhead}
              onChange={(e) => setSubhead(e.target.value)}
              placeholder="Supporting text description"
              rows={3}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid var(--gtm-border)",
                background: "var(--gtm-bg-card)",
                fontFamily: font,
                fontSize: 14,
                color: "var(--gtm-text-primary)",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid var(--gtm-border)",
              background: "transparent",
              fontFamily: font,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--gtm-text-primary)",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              background: "var(--gtm-accent)",
              fontFamily: font,
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
              transition: "all 150ms ease",
            }}
          >
            {isLoading ? (
              <>
                <RotateCw size={14} /> Regenerating...
              </>
            ) : (
              "Regenerate"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
