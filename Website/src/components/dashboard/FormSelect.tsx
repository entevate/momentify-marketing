"use client";

import { ChevronDown, Info } from "lucide-react";

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  tooltip?: string;
}

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  tooltip,
}: FormSelectProps) {
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
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg px-3 py-2.5 pr-10 text-sm outline-none transition-all duration-150"
          style={{
            background: "var(--dash-input-bg)",
            border: "1px solid var(--dash-input-border)",
            color: value ? "var(--dash-text)" : "var(--dash-text-muted)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--dash-input-focus)";
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--dash-input-focus)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--dash-input-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--dash-text-muted)" }}
        />
      </div>
    </div>
  );
}
