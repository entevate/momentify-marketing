"use client";

import { Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FormInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  tooltip?: string;
  icon?: LucideIcon;
  type?: string;
}

export default function FormInput({
  label,
  placeholder,
  value,
  onChange,
  tooltip,
  icon: Icon,
  type = "text",
}: FormInputProps) {
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
            <Info
              size={14}
              style={{ color: "var(--dash-text-subtle)" }}
            />
          </span>
        )}
      </label>
      <div className="relative">
        {Icon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--dash-text-muted)" }}
          >
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-150"
          style={{
            background: "var(--dash-input-bg)",
            border: "1px solid var(--dash-input-border)",
            color: "var(--dash-text)",
            paddingLeft: Icon ? 36 : 12,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--dash-input-focus)";
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--dash-input-focus)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--dash-input-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>
    </div>
  );
}
