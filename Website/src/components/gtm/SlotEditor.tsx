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
 *
 * Rich-text slots: prose kinds (headline/support/quote/bullet/attribution/
 * stat_label) are multi-line textareas whose value is plain text with light
 * markers - a newline is a line break, `**bold**`, `*italic*`, `__underline__`.
 * A small B/I/U toolbar wraps (or unwraps) the current selection. The cap is
 * soft: we show plainLength(value) vs maxChars and flag an overrun, but never
 * block typing - the server truncates by VISIBLE characters, so a hard
 * maxLength here would count markers and cut copy short. Single-line slots
 * carry no markers and keep their hard maxLength.
 */

import React, { useRef, useState } from "react"
import type { SlotKind, SlotSpec } from "@/lib/gtm/templates/types"
// cta-icons is fs-free; render.ts imports fs/promises and would break the client bundle.
import { CTA_ICONS, DEFAULT_CTA_ICON } from "@/lib/gtm/templates/cta-icons"

/**
 * Visible character count: markers don't count, newlines don't count.
 *
 * Local twin of `plainLength` in `src/lib/gtm/rich-text.ts` (server-owned).
 * Swap this for the import once that module lands - the semantics must stay
 * identical or the editor's count will disagree with the server's truncation.
 */
function plainLength(raw: string): number {
  if (!raw) return 0
  return raw
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/\*/g, "")
    .replace(/\r?\n/g, "").length
}

/** Slot kinds that hold prose: multi-line, marker-aware. */
const MULTILINE_KINDS: readonly SlotKind[] = [
  "headline",
  "support",
  "quote",
  "bullet",
  "attribution",
  "stat_label",
]

function isMultiline(kind: SlotKind): boolean {
  return MULTILINE_KINDS.includes(kind)
}

type Marker = "**" | "*" | "__"

const TOOLBAR: ReadonlyArray<{ marker: Marker; glyph: string; name: string; style: React.CSSProperties }> = [
  { marker: "**", glyph: "B", name: "Bold", style: { fontWeight: 700 } },
  { marker: "*", glyph: "I", name: "Italic", style: { fontStyle: "italic" } },
  { marker: "__", glyph: "U", name: "Underline", style: { textDecoration: "underline" } },
]

/** `*` must not claim a `**` pair - otherwise italic would eat a bold marker. */
function isBoldRun(value: string, at: number): boolean {
  return value.slice(at, at + 2) === "**"
}

function wrappedInside(selected: string, m: Marker): boolean {
  if (selected.length < m.length * 2) return false
  if (!selected.startsWith(m) || !selected.endsWith(m)) return false
  if (m === "*" && (selected.startsWith("**") || selected.endsWith("**"))) return false
  return true
}

function wrappedOutside(value: string, start: number, end: number, m: Marker): boolean {
  if (start < m.length) return false
  if (value.slice(start - m.length, start) !== m) return false
  if (value.slice(end, end + m.length) !== m) return false
  if (m === "*" && (isBoldRun(value, start - 2) || isBoldRun(value, end))) return false
  return true
}

export interface MarkerEdit {
  value: string
  start: number
  end: number
}

/**
 * Toggle `m` around the selection. Four outcomes, checked in order:
 *  1. the selection itself is `**like this**` -> strip the markers,
 *  2. the markers sit just outside the selection -> strip them there,
 *  3. nothing is selected -> insert the empty pair, caret between them,
 *  4. otherwise -> wrap the selection.
 * Leading/trailing whitespace is pushed out of the selection first, so a
 * double-clicked word that grabbed a trailing space still yields `**word** `
 * rather than `**word **` (which no marker parser would read as bold).
 */
export function computeMarkerEdit(value: string, selStart: number, selEnd: number, m: Marker): MarkerEdit {
  let start = Math.max(0, Math.min(selStart, value.length))
  let end = Math.max(start, Math.min(selEnd, value.length))
  while (start < end && /\s/.test(value[start])) start++
  while (end > start && /\s/.test(value[end - 1])) end--
  if (start === end) {
    // Collapsed, or an all-whitespace selection: act at the original caret.
    start = Math.max(0, Math.min(selStart, value.length))
    end = start
  }

  const selected = value.slice(start, end)

  if (start !== end && wrappedInside(selected, m)) {
    const inner = selected.slice(m.length, selected.length - m.length)
    return { value: value.slice(0, start) + inner + value.slice(end), start, end: start + inner.length }
  }

  if (wrappedOutside(value, start, end, m)) {
    return {
      value: value.slice(0, start - m.length) + selected + value.slice(end + m.length),
      start: start - m.length,
      end: end - m.length,
    }
  }

  if (start === end) {
    const caret = start + m.length
    return { value: value.slice(0, start) + m + m + value.slice(start), start: caret, end: caret }
  }

  return {
    value: value.slice(0, start) + m + selected + m + value.slice(end),
    start: start + m.length,
    end: end + m.length,
  }
}

export interface SlotEditorProps {
  slots: SlotSpec[]
  values: Record<string, string>
  hidden: string[]
  onChange: (values: Record<string, string>, hidden: string[]) => void
  disabled?: boolean
}

export default function SlotEditor({ slots, values, hidden, onChange, disabled }: SlotEditorProps) {
  const areas = useRef<Record<string, HTMLTextAreaElement | null>>({})
  const anyMultiline = slots.some((s) => isMultiline(s.kind))

  function toggle(key: string) {
    const next = hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key]
    onChange(values, next)
  }
  function setValue(key: string, value: string) {
    onChange({ ...values, [key]: value }, hidden)
  }

  /** Apply a marker to the live textarea, then put the caret back where it belongs. */
  function applyMarker(key: string, m: Marker) {
    const el = areas.current[key]
    if (!el || el.disabled) return
    const edit = computeMarkerEdit(el.value, el.selectionStart ?? 0, el.selectionEnd ?? 0, m)
    setValue(key, edit.value)
    // React owns the value; wait for the commit before re-selecting.
    requestAnimationFrame(() => {
      const target = areas.current[key]
      if (!target) return
      target.focus()
      target.setSelectionRange(edit.start, edit.end)
    })
  }

  function onAreaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>, key: string) {
    if (!(e.metaKey || e.ctrlKey) || e.altKey) return
    const hit = { b: "**", i: "*", u: "__" }[e.key.toLowerCase()] as Marker | undefined
    if (!hit) return
    e.preventDefault()
    applyMarker(key, hit)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {slots.map((s) => {
        const isHidden = hidden.includes(s.key)
        const value = values[s.key] ?? ""
        const multiline = isMultiline(s.kind)
        const used = multiline ? plainLength(value) : 0
        const over = multiline && used > s.maxChars
        const countId = `slot-count-${s.key}`
        const rows = Math.min(6, Math.max(1, value.split("\n").length))
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
              ) : multiline ? (
                <>
                  <span className="field-label">
                    {s.label}{" "}
                    <span
                      id={countId}
                      style={{ fontWeight: 400, color: over ? "var(--gtm-danger-text)" : "var(--gtm-text-faint)" }}
                    >
                      · {used}/{s.maxChars}
                    </span>
                  </span>
                  <div
                    role="toolbar"
                    aria-label={`Formatting for ${s.label}`}
                    style={{ display: "flex", gap: 2, marginBottom: 4 }}
                  >
                    {TOOLBAR.map((t) => (
                      <button
                        key={t.marker}
                        type="button"
                        className="btn btn-tertiary btn-sm"
                        aria-label={t.name}
                        title={`${t.name} — wraps the selection in ${t.marker}`}
                        disabled={disabled || isHidden}
                        // Keep the caret in the textarea: a focus change would
                        // still preserve the selection, but the field visibly
                        // losing focus on every click reads as a bug.
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyMarker(s.key, t.marker)}
                        style={{ ...t.style, minWidth: 30, padding: "0 8px" }}
                      >
                        {t.glyph}
                      </button>
                    ))}
                  </div>
                  <textarea
                    ref={(el) => { areas.current[s.key] = el }}
                    className="input"
                    value={value}
                    rows={rows}
                    disabled={disabled || isHidden}
                    aria-invalid={over || undefined}
                    aria-describedby={countId}
                    onKeyDown={(e) => onAreaKeyDown(e, s.key)}
                    onChange={(e) => setValue(s.key, e.target.value)}
                    style={{ resize: "none", whiteSpace: "pre-wrap", lineHeight: 1.45, display: "block" }}
                  />
                </>
              ) : (
                <>
                  <span className="field-label">
                    {s.label} <span style={{ fontWeight: 400, color: "var(--gtm-text-faint)" }}>· max {s.maxChars}</span>
                  </span>
                  <input
                    className="input"
                    value={value}
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
      {anyMultiline && (
        <span className="section-note">Enter for a line break · **bold** · *italic* · __underline__</span>
      )}
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
