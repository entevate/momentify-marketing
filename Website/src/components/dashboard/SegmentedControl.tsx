"use client";

import { AlignJustify, Database, QrCode, Ban } from "lucide-react";
import type { RegistrationMode } from "./types";
import type { LucideIcon } from "lucide-react";

interface Segment {
  value: RegistrationMode;
  label: string;
  icon: LucideIcon;
}

const segments: Segment[] = [
  { value: "form", label: "Form", icon: AlignJustify },
  { value: "database", label: "Database", icon: Database },
  { value: "qr-code", label: "QR Code", icon: QrCode },
  { value: "none", label: "None", icon: Ban },
];

interface SegmentedControlProps {
  value: RegistrationMode;
  onChange: (value: RegistrationMode) => void;
}

export default function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  return (
    <div>
      <label
        className="mb-1.5 block text-sm font-medium"
        style={{ color: "var(--dash-text)" }}
      >
        Registration Mode
      </label>
      <div className="grid grid-cols-4 gap-2">
        {segments.map((seg) => {
          const Icon = seg.icon;
          const active = value === seg.value;
          return (
            <button
              key={seg.value}
              type="button"
              onClick={() => onChange(seg.value)}
              className="flex flex-col items-center gap-1.5 rounded-lg py-3 text-xs font-medium transition-all duration-150"
              style={{
                background: active ? "var(--dash-surface)" : "var(--dash-input-bg)",
                border: active
                  ? "2px solid var(--dash-accent)"
                  : "1px solid var(--dash-input-border)",
                color: active ? "var(--dash-accent)" : "var(--dash-text-muted)",
              }}
            >
              <Icon size={20} />
              {seg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
