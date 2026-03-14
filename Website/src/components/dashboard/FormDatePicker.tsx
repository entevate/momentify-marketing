"use client";

import { Calendar, Info } from "lucide-react";

interface FormDatePickerProps {
  label: string;
  startDate: string;
  endDate: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  tooltip?: string;
}

export default function FormDatePicker({
  label,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  tooltip,
}: FormDatePickerProps) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--dash-text)" }}
        >
          {label}
        </span>
        {tooltip && (
          <span title={tooltip}>
            <Info size={14} style={{ color: "var(--dash-text-subtle)" }} />
          </span>
        )}
      </label>
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2"
        style={{
          background: "var(--dash-input-bg)",
          border: "1px solid var(--dash-input-border)",
        }}
      >
        <Calendar size={16} style={{ color: "var(--dash-text-muted)", flexShrink: 0 }} />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--dash-text)" }}
        />
        <span
          className="text-xs"
          style={{ color: "var(--dash-text-subtle)" }}
        >
          to
        </span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--dash-text)" }}
        />
      </div>
    </div>
  );
}
