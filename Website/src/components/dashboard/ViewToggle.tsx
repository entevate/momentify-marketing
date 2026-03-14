"use client";

import { LayoutGrid, List, Map } from "lucide-react";
import type { ViewMode } from "./types";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const views: { mode: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
  { mode: "grid", icon: LayoutGrid, label: "Grid view" },
  { mode: "list", icon: List, label: "List view" },
  { mode: "map", icon: Map, label: "Map view" },
];

export default function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <span
        className="mr-2 text-sm font-medium"
        style={{ color: "var(--dash-text-muted)" }}
      >
        View As:
      </span>
      <div
        className="flex gap-0.5 rounded-lg p-1"
        style={{
          background: "var(--dash-surface-2)",
          border: "1px solid var(--dash-border)",
        }}
      >
        {views.map(({ mode, icon: Icon, label }) => {
          const active = viewMode === mode;
          return (
            <button
              key={mode}
              onClick={() => onViewChange(mode)}
              className="rounded-md p-2 transition-all duration-150"
              style={{
                background: active ? "var(--dash-surface)" : "transparent",
                color: active ? "var(--dash-accent)" : "var(--dash-text-muted)",
                boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
              aria-label={label}
              title={label}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
