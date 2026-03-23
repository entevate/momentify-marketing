"use client"

import React from "react"
import {
  ChevronLeft,
  ChevronRight,
  List,
  CalendarDays,
} from "lucide-react"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface CalendarHeaderProps {
  currentMonth: Date
  viewMode: "list" | "calendar"
  onMonthChange: (offset: number) => void
  onViewChange: (mode: "list" | "calendar") => void
  onTodayClick: () => void
  taskStats: { total: number; completed: number }
}

export default function CalendarHeader({
  currentMonth,
  viewMode,
  onMonthChange,
  onViewChange,
  onTodayClick,
  taskStats,
}: CalendarHeaderProps) {
  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const navBtnStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid var(--gtm-border)",
    borderRadius: 8,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "var(--gtm-text-muted)",
    transition: "all 200ms ease",
    padding: 0,
  }

  const viewBtnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    fontWeight: 600,
    border: "none",
    borderRadius: 100,
    padding: "6px 14px",
    cursor: "pointer",
    transition: "all 200ms ease",
    fontFamily: font,
  }

  return (
    <div
      style={{
        fontFamily: font,
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "var(--gtm-bg-page)",
        borderBottom: "1px solid var(--gtm-border)",
        padding: "16px 0",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {/* Left: Month nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          style={navBtnStyle}
          onClick={() => onMonthChange(-1)}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gtm-cyan)"
            e.currentTarget.style.color = "var(--gtm-text-primary)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--gtm-border)"
            e.currentTarget.style.color = "var(--gtm-text-muted)"
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <span
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "var(--gtm-text-primary)",
            minWidth: 180,
            textAlign: "center",
          }}
        >
          {monthLabel}
        </span>
        <button
          style={navBtnStyle}
          onClick={() => onMonthChange(1)}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gtm-cyan)"
            e.currentTarget.style.color = "var(--gtm-text-primary)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--gtm-border)"
            e.currentTarget.style.color = "var(--gtm-text-muted)"
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Center: View toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "var(--gtm-bg-card)",
          border: "1px solid var(--gtm-border)",
          borderRadius: 100,
          padding: 3,
        }}
      >
        <button
          style={{
            ...viewBtnBase,
            background: viewMode === "list" ? "rgba(12, 244, 223, 0.10)" : "transparent",
            color: viewMode === "list" ? "var(--gtm-cyan)" : "var(--gtm-text-muted)",
          }}
          onClick={() => onViewChange("list")}
          onMouseEnter={(e) => {
            if (viewMode !== "list") {
              e.currentTarget.style.color = "var(--gtm-text-primary)"
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== "list") {
              e.currentTarget.style.color = "var(--gtm-text-muted)"
            }
          }}
        >
          <List size={14} />
          List
        </button>
        <button
          style={{
            ...viewBtnBase,
            background: viewMode === "calendar" ? "rgba(12, 244, 223, 0.10)" : "transparent",
            color: viewMode === "calendar" ? "var(--gtm-cyan)" : "var(--gtm-text-muted)",
          }}
          onClick={() => onViewChange("calendar")}
          onMouseEnter={(e) => {
            if (viewMode !== "calendar") {
              e.currentTarget.style.color = "var(--gtm-text-primary)"
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== "calendar") {
              e.currentTarget.style.color = "var(--gtm-text-muted)"
            }
          }}
        >
          <CalendarDays size={14} />
          Calendar
        </button>
      </div>

      {/* Right: Today + stats */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          style={{
            fontFamily: font,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--gtm-text-muted)",
            background: "transparent",
            border: "1px solid var(--gtm-border)",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            transition: "all 200ms ease",
          }}
          onClick={onTodayClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gtm-cyan)"
            e.currentTarget.style.color = "var(--gtm-text-primary)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--gtm-border)"
            e.currentTarget.style.color = "var(--gtm-text-muted)"
          }}
        >
          Today
        </button>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--gtm-text-muted)",
            background: "var(--gtm-bg-card)",
            border: "1px solid var(--gtm-border)",
            borderRadius: 100,
            padding: "4px 12px",
          }}
        >
          {taskStats.completed}/{taskStats.total} completed
        </span>
      </div>
    </div>
  )
}
