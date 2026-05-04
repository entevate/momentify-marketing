"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Mail } from "lucide-react"
import EmailTabs, { type EmailTabKey } from "@/components/gtm/email/EmailTabs"
import DraftsTab from "@/components/gtm/email/DraftsTab"
import AudiencesTab from "@/components/gtm/email/AudiencesTab"
import SendsTab from "@/components/gtm/email/SendsTab"

const font = "'Inter', system-ui, -apple-system, sans-serif"

/**
 * /gtm/email - Email module landing page.
 *
 * Three tabs: Drafts | Audiences | Sends & Metrics.
 *
 * Query params (all optional, all selection-only - none create state):
 *   ?draftId=<id>                    - preselects an existing draft on the
 *                                       Drafts tab (used by ContentLibrary's
 *                                       Send via Email button after it
 *                                       creates the draft server-side)
 *   ?tab=<drafts|audiences|sends>    - opens a specific tab on load
 */
function EmailPageInner() {
  const searchParams = useSearchParams()
  const preselectDraftId = searchParams.get("draftId") || undefined
  const tabParam = searchParams.get("tab") as EmailTabKey | null

  const [active, setActive] = useState<EmailTabKey>(tabParam ?? "drafts")

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 32px 64px 32px", fontFamily: font }}>
      <header style={{ marginBottom: 24 }}>
        <p style={eyebrow}>EMAIL</p>
        <h1 style={h1}>Email Module</h1>
        <p style={subhead}>Author, schedule, and send branded emails. Audiences sync with Resend. Engagement tracked via webhooks.</p>
      </header>

      <EmailTabs active={active} onChange={setActive}>
        {active === "drafts" && <DraftsTab preselectDraftId={preselectDraftId} />}
        {active === "audiences" && <AudiencesTab />}
        {active === "sends" && <SendsTab />}
      </EmailTabs>
    </div>
  )
}

export default function EmailPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, fontFamily: font }}><Mail size={20} /> Loading...</div>}>
      <EmailPageInner />
    </Suspense>
  )
}

const eyebrow: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "var(--gtm-cyan, #00BBA5)", letterSpacing: "0.14em", marginBottom: 10, fontFamily: font }
const h1: React.CSSProperties = { fontSize: 32, fontWeight: 300, color: "var(--gtm-text-primary)", margin: 0, fontFamily: font }
const subhead: React.CSSProperties = { fontSize: 14, fontWeight: 400, color: "var(--gtm-text-muted)", marginTop: 8, fontFamily: font, maxWidth: 720 }
