"use client"

import type { ReactNode } from "react"
import { Mail, Users, BarChart2 } from "lucide-react"

const font = "'Inter', system-ui, -apple-system, sans-serif"

export type EmailTabKey = "drafts" | "audiences" | "sends"

interface Props {
  active: EmailTabKey
  onChange: (k: EmailTabKey) => void
  children: ReactNode
}

const TABS: { key: EmailTabKey; label: string; icon: typeof Mail }[] = [
  { key: "drafts", label: "Drafts", icon: Mail },
  { key: "audiences", label: "Audiences", icon: Users },
  { key: "sends", label: "Sends & Metrics", icon: BarChart2 },
]

export default function EmailTabs({ active, onChange, children }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: font }}>
      <div style={tabBar}>
        {TABS.map((t) => {
          const isActive = active === t.key
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              style={{
                ...tabBtn,
                borderBottomColor: isActive ? "var(--gtm-accent, #00BBA5)" : "transparent",
                color: isActive ? "var(--gtm-accent, #00BBA5)" : "var(--gtm-text-muted)",
              }}
            >
              <Icon size={14} />
              {t.label}
            </button>
          )
        })}
      </div>
      <div>{children}</div>
    </div>
  )
}

const tabBar: React.CSSProperties = { display: "flex", gap: 0, borderBottom: "1px solid var(--gtm-border)" }
const tabBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, height: 44, padding: "0 18px", border: "none", borderBottom: "2px solid transparent", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: font, transition: "all 200ms ease" }
