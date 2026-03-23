"use client"

import React from "react"
import { taskCategories, solutionMeta } from "@/lib/gtm/calendar-categories"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface FilterBarProps {
  selectedSolutions: string[]
  selectedCategories: string[]
  onSolutionToggle: (solutionId: string) => void
  onCategoryToggle: (categoryId: string) => void
  onClearAll: () => void
}

function Pill({
  label,
  color,
  isActive,
  onClick,
}: {
  label: string
  color: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: font,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 100,
        padding: "4px 12px",
        cursor: "pointer",
        transition: "all 200ms ease",
        border: isActive ? `1px solid ${color}` : "1px solid var(--gtm-border)",
        background: isActive ? `${color}1F` : "transparent",
        color: isActive ? color : "var(--gtm-text-muted)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderColor = color
          e.currentTarget.style.color = color
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderColor = "var(--gtm-border)"
          e.currentTarget.style.color = "var(--gtm-text-muted)"
        }
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      {label}
    </button>
  )
}

export default function FilterBar({
  selectedSolutions,
  selectedCategories,
  onSolutionToggle,
  onCategoryToggle,
  onClearAll,
}: FilterBarProps) {
  const hasFilters = selectedSolutions.length > 0 || selectedCategories.length > 0

  return (
    <div
      style={{
        fontFamily: font,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 20,
      }}
    >
      {/* Row 1: Solutions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--gtm-text-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginRight: 4,
          }}
        >
          Solutions:
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(solutionMeta).map(([id, meta]) => (
            <Pill
              key={id}
              label={meta.label}
              color={meta.color}
              isActive={selectedSolutions.includes(id)}
              onClick={() => onSolutionToggle(id)}
            />
          ))}
        </div>
      </div>

      {/* Row 2: Categories */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--gtm-text-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginRight: 4,
          }}
        >
          Activities:
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(taskCategories).map(([id, meta]) => (
            <Pill
              key={id}
              label={meta.label}
              color={meta.color}
              isActive={selectedCategories.includes(id)}
              onClick={() => onCategoryToggle(id)}
            />
          ))}
        </div>

        {/* Clear all */}
        {hasFilters && (
          <button
            onClick={onClearAll}
            style={{
              fontFamily: font,
              fontSize: 11,
              fontWeight: 600,
              color: "var(--gtm-text-muted)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              textDecoration: "underline",
              transition: "all 200ms ease",
              marginLeft: "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--gtm-text-primary)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--gtm-text-muted)"
            }}
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
