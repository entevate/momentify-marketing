"use client"

/**
 * SlotEditor - one row per template slot: an on/off switch plus its text
 * input. Fully controlled (no internal values/hidden state) so the caller
 * (AssetPanel, for both social-post and carousel cards) owns the draft and
 * decides when to send it to the server via "Update preview".
 *
 * A hidden slot renders empty and is hidden server-side (see fill-template /
 * fill-carousel) - toggling it back on here restores the preserved value
 * without re-typing it.
 */

import React, { useState } from "react"
import type { SlotSpec } from "@/lib/gtm/templates/types"
import { CTA_ICONS, DEFAULT_CTA_ICON } from "@/lib/gtm/templates/render"

export interface SlotEditorProps {
  slots: SlotSpec[]
  values: Record<string, string>
  hidden: string[]
  onChange: (values: Record<string, string>, hidden: string[]) => void
  disabled?: boolean
}

export default function SlotEditor({ slots, values, hidden, onChange, disabled }: SlotEditorProps) {
  function toggle(key: string) {
    const next = hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key]
    onChange(values, next)
  }
  function setValue(key: string, value: string) {
    onChange({ ...values, [key]: value }, hidden)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {slots.map((s) => {
        const isHidden = hidden.includes(s.key)
        return (
          <div key={s.key} style={{ display: "flex", alignItems: "flex-start", gap: 10, opacity: isHidden ? 0.55 : 1 }}>
            <div style={{ paddingTop: 2, flex: "none" }}>
              <SlotSwitch checked={!isHidden} disabled={disabled} onToggle={() => toggle(s.key)} label={`Toggle ${s.label}`} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {s.kind === "icon" ? (
                <>
                  <span className="field-label">{s.label}</span>
                  <select
                    className="input"
                    value={values[s.key] || DEFAULT_CTA_ICON}
                    disabled={disabled || isHidden}
                    onChange={(e) => setValue(s.key, e.target.value)}
                  >
                    {Object.entries(CTA_ICONS).map(([id, icon]) => (
                      <option key={id} value={id}>{icon.label}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <span className="field-label">
                    {s.label} <span style={{ fontWeight: 400, color: "var(--gtm-text-faint)" }}>· max {s.maxChars}</span>
                  </span>
                  <input
                    className="input"
                    value={values[s.key] ?? ""}
                    maxLength={s.maxChars}
                    disabled={disabled || isHidden}
                    onChange={(e) => setValue(s.key, e.target.value)}
                  />
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** 34x20 pill switch. Tokens only; focus ring is a small onFocus/onBlur state
 *  since inline styles can't express :focus-visible. */
function SlotSwitch({ checked, disabled, onToggle, label }: { checked: boolean; disabled?: boolean; onToggle: () => void; label: string }) {
  const [focused, setFocused] = useState(false)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        position: "relative",
        width: 34,
        height: 20,
        padding: 0,
        border: "none",
        borderRadius: 9999,
        background: checked ? "var(--gtm-accent)" : "var(--gtm-border-strong)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        transition: "background 150ms ease",
        outline: focused ? "2px solid var(--gtm-accent-ink)" : "none",
        outlineOffset: 2,
        flex: "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 16 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "var(--gtm-bg-card)",
          transition: "left 150ms ease",
        }}
      />
    </button>
  )
}
