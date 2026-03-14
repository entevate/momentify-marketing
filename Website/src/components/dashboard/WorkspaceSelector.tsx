"use client";

import { ChevronDown } from "lucide-react";
import { workspaceName } from "./mockData";

export default function WorkspaceSelector() {
  return (
    <button
      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors duration-150"
      style={{
        background: "var(--dash-sidebar-surface)",
        border: "1px solid var(--dash-sidebar-border)",
      }}
    >
      <div>
        <div
          className="text-[10px] font-medium uppercase tracking-wider"
          style={{ color: "var(--dash-sidebar-text)" }}
        >
          Workspace
        </div>
        <div
          className="text-sm font-semibold"
          style={{ color: "var(--dash-sidebar-text-active)" }}
        >
          {workspaceName}
        </div>
      </div>
      <ChevronDown size={16} style={{ color: "var(--dash-sidebar-text)" }} />
    </button>
  );
}
