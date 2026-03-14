"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div
        className="mb-4 rounded-2xl p-4"
        style={{ background: "var(--dash-surface-2)" }}
      >
        <BarChart3 size={40} style={{ color: "var(--dash-text-subtle)" }} />
      </div>
      <h1
        className="mb-2 text-xl font-medium"
        style={{ color: "var(--dash-text)" }}
      >
        Analytics
      </h1>
      <p
        className="text-sm"
        style={{ color: "var(--dash-text-muted)" }}
      >
        Event performance analytics and reporting coming soon.
      </p>
    </div>
  );
}
