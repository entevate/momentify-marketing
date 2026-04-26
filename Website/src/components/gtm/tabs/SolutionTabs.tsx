"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Zap } from "lucide-react"
import ContentBuilder from "./ContentBuilder"
import ContentLibrary from "./ContentLibrary"
import { paletteFor } from "@/lib/gtm/pillar-palettes"

// Event name used by ContentBuilder and ContentLibrary to signal "library contents changed"
// so the tab-count badge in SolutionTabs refreshes without explicit prop drilling.
const LIBRARY_CHANGED_EVENT = "gtm:library-changed"
export function dispatchLibraryChanged(solution: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(LIBRARY_CHANGED_EVENT, { detail: { solution } }))
  }
}

const font = "'Inter', system-ui, sans-serif"

export type VerticalOption = { id: string; label: string }

interface SolutionTabsProps {
  solution: string
  solutionLabel: string
  verticals: VerticalOption[]
  children: React.ReactNode
}

type TabKey = "framework" | "builder" | "library"

const TABS: { key: TabKey; label: string }[] = [
  { key: "framework", label: "Framework" },
  { key: "builder", label: "Content Builder" },
  { key: "library", label: "Library" },
]

export default function SolutionTabs({
  solution,
  solutionLabel,
  verticals,
  children,
}: SolutionTabsProps) {
  const [active, setActive] = useState<TabKey>("framework")
  const [libraryCount, setLibraryCount] = useState<number | null>(null)

  // Pillar-specific accent so tab underline, active text, Zap icon, and
  // library count badge match the sidebar swatch for this solution.
  const accent = paletteFor(solution).primary

  // Fetch library count (auth-gated so it may return 401 when user hasn't unlocked yet)
  const refreshCount = useCallback(async () => {
    try {
      const res = await fetch(`/api/gtm/content?solution=${encodeURIComponent(solution)}`)
      if (!res.ok) {
        // 401 is expected pre-auth - leave count as null so we don't render "0" misleadingly
        if (res.status !== 401) setLibraryCount(null)
        return
      }
      const data = await res.json()
      setLibraryCount(Array.isArray(data.items) ? data.items.length : 0)
    } catch {
      setLibraryCount(null)
    }
  }, [solution])

  useEffect(() => { refreshCount() }, [refreshCount])

  // Listen for save/delete events from ContentBuilder + ContentLibrary to refresh count
  useEffect(() => {
    function onChange(e: Event) {
      const detail = (e as CustomEvent<{ solution?: string }>).detail
      if (!detail || detail.solution === solution) refreshCount()
    }
    window.addEventListener(LIBRARY_CHANGED_EVENT, onChange)
    return () => window.removeEventListener(LIBRARY_CHANGED_EVENT, onChange)
  }, [refreshCount, solution])

  return (
    <div style={{ fontFamily: font }}>
      {/* Tab strip */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid var(--gtm-border)",
          marginBottom: 32,
        }}
      >
        {TABS.map((tab) => {
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              style={{
                padding: "12px 20px",
                fontFamily: font,
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? accent : "var(--gtm-text-secondary)",
                background: "transparent",
                border: "none",
                borderBottom: isActive
                  ? `2px solid ${accent}`
                  : "2px solid transparent",
                cursor: "pointer",
                transition: "all 150ms ease",
                marginBottom: -1,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--gtm-text-primary)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--gtm-text-secondary)"
                }
              }}
              title={tab.key === "builder" ? "AI-generated content" : undefined}
            >
              {tab.label}
              {tab.key === "builder" && (
                <Zap
                  size={12}
                  style={{
                    color: accent,
                    fill: accent,
                  }}
                />
              )}
              {tab.key === "library" && libraryCount !== null && libraryCount > 0 && (
                <span
                  aria-label={`${libraryCount} saved items`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 20,
                    height: 18,
                    padding: "0 6px",
                    marginLeft: 2,
                    borderRadius: 100,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    color: isActive ? "#ffffff" : "var(--gtm-text-secondary)",
                    background: isActive ? accent : "var(--gtm-border)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {libraryCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {active === "framework" && <div>{children}</div>}
      {active === "builder" && (
        <ContentBuilder
          solution={solution}
          solutionLabel={solutionLabel}
          verticals={verticals}
        />
      )}
      {active === "library" && (
        <ContentLibrary solution={solution} solutionLabel={solutionLabel} />
      )}
    </div>
  )
}
