"use client";

import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div
        className="mb-4 rounded-2xl p-4"
        style={{ background: "var(--dash-surface-2)" }}
      >
        <Settings size={40} style={{ color: "var(--dash-text-subtle)" }} />
      </div>
      <h1
        className="mb-2 text-xl font-medium"
        style={{ color: "var(--dash-text)" }}
      >
        Settings
      </h1>
      <p
        className="text-sm"
        style={{ color: "var(--dash-text-muted)" }}
      >
        Workspace and account settings coming soon.
      </p>
    </div>
  );
}
