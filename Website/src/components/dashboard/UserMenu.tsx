"use client";

import { ChevronDown } from "lucide-react";
import { currentUser } from "./mockData";

export default function UserMenu() {
  return (
    <button
      className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 transition-colors duration-150"
      style={{
        background: "var(--dash-surface)",
        border: "1px solid var(--dash-border)",
      }}
    >
      <div
        className="avatar-subtle flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium"
      >
        {currentUser.initials}
      </div>
      <span
        className="hidden text-sm font-medium md:block"
        style={{ color: "var(--dash-text)" }}
      >
        {currentUser.name}
      </span>
      <ChevronDown
        size={14}
        className="hidden md:block"
        style={{ color: "var(--dash-text-muted)" }}
      />
    </button>
  );
}
