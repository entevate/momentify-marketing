"use client"

/**
 * Modal dialog for picking the schedule date + time slot + autoSend
 * toggle on an email draft. Returned from ComposePane's "Schedule" button.
 */

import { useState } from "react"
import { CalendarPlus, X } from "lucide-react"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface Props {
  defaultDate?: string
  onCancel: () => void
  onConfirm: (params: { date: string; timeSlot?: "morning" | "afternoon"; autoSend: boolean }) => void
  busy?: boolean
}

export default function ScheduleDialog({ defaultDate, onCancel, onConfirm, busy = false }: Props) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const fallback = tomorrow.toISOString().slice(0, 10)
  const [date, setDate] = useState<string>(defaultDate || fallback)
  const [timeSlot, setTimeSlot] = useState<"morning" | "afternoon">("morning")
  const [autoSend, setAutoSend] = useState(false)

  return (
    <div style={overlay} onClick={onCancel}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, fontFamily: font, color: "var(--gtm-text-primary)" }}>
            Schedule send
          </h3>
          <button type="button" onClick={onCancel} style={closeBtn} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div style={body}>
          <Field label="Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={input}
              min={new Date().toISOString().slice(0, 10)}
            />
          </Field>

          <Field label="Time slot">
            <div style={{ display: "flex", gap: 6 }}>
              {(["morning", "afternoon"] as const).map((t) => {
                const active = timeSlot === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeSlot(t)}
                    style={{
                      ...slotBtn,
                      background: active ? "rgba(0,187,165,0.10)" : "#fff",
                      color: active ? "#0AA891" : "var(--gtm-text-secondary)",
                      borderColor: active ? "#00BBA5" : "var(--gtm-border)",
                    }}
                  >
                    {t === "morning" ? "Morning" : "Afternoon"}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="Auto-send">
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={autoSend}
                onChange={(e) => setAutoSend(e.target.checked)}
              />
              <span style={{ fontSize: 13, color: "var(--gtm-text-secondary)", fontFamily: font }}>
                Fire automatically at 9am UTC on the scheduled date
              </span>
            </label>
            <p style={{ margin: "6px 0 0 22px", fontSize: 11, color: "var(--gtm-text-faint)", fontFamily: font, lineHeight: 1.45 }}>
              {autoSend
                ? "The cron will send this draft to all recipients automatically. You won't get a confirmation prompt."
                : "The draft will appear on the calendar; you'll click Send Now manually when you're ready."}
            </p>
          </Field>
        </div>

        <div style={footer}>
          <button type="button" onClick={onCancel} style={cancelBtn} disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm({ date, timeSlot, autoSend })}
            disabled={busy || !date}
            style={{
              ...confirmBtn,
              opacity: busy || !date ? 0.5 : 1,
              cursor: busy || !date ? "not-allowed" : "pointer",
            }}
          >
            <CalendarPlus size={13} />
            {busy ? "Scheduling..." : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={fieldLabel}>{label}</span>
      {children}
    </div>
  )
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(6,19,65,0.45)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  fontFamily: font,
}

const panel: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 30px 60px rgba(6,19,65,0.25)",
  overflow: "hidden",
}

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  borderBottom: "1px solid var(--gtm-border)",
}

const body: React.CSSProperties = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 16,
}

const footer: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
  padding: "12px 20px",
  borderTop: "1px solid var(--gtm-border)",
  background: "var(--gtm-bg-page)",
}

const fieldLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--gtm-text-faint)",
}

const input: React.CSSProperties = {
  height: 36,
  padding: "0 12px",
  fontSize: 13,
  fontFamily: font,
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  background: "#fff",
  color: "var(--gtm-text-primary)",
}

const slotBtn: React.CSSProperties = {
  flex: 1,
  height: 36,
  padding: "0 12px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: font,
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  cursor: "pointer",
}

const closeBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  background: "transparent",
  color: "var(--gtm-text-faint)",
  cursor: "pointer",
}

const cancelBtn: React.CSSProperties = {
  height: 34,
  padding: "0 14px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: font,
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  background: "#fff",
  color: "var(--gtm-text-secondary)",
  cursor: "pointer",
}

const confirmBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 34,
  padding: "0 14px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: font,
  border: "none",
  borderRadius: 6,
  background: "#00BBA5",
  color: "#fff",
}
