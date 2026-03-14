"use client";

import Badge from "./Badge";
import type { EventTab } from "./types";

interface Tab {
  id: EventTab;
  label: string;
  count?: number;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: EventTab;
  onTabChange: (tab: EventTab) => void;
}

export default function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div
      className="flex gap-1 overflow-x-auto rounded-lg p-1 scrollbar-hide"
      style={{ background: "var(--dash-surface-2)" }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{
              background: active ? "var(--dash-surface)" : "transparent",
              color: active ? "var(--dash-text)" : "var(--dash-text-muted)",
              boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <Badge count={tab.count} variant={active ? "accent" : "default"} />
            )}
          </button>
        );
      })}
    </div>
  );
}
