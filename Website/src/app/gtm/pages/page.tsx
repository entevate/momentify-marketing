"use client"

/**
 * /gtm/pages - top-level Pages surface in the sidebar nav.
 *
 * Thin wrapper that renders the shared PagesView component: publish standalone
 * HTML at public /p/<slug> links with OG meta + open/read-time tracking.
 */

import PagesView from "@/components/gtm/PagesView"

const font = "'Inter', system-ui, -apple-system, sans-serif"

export default function PagesPage() {
  return (
    <div style={{ padding: "40px 48px 80px", maxWidth: 1400, margin: "0 auto", fontFamily: font }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em", margin: "0 0 6px 0", color: "#181818" }}>
          Pages
        </h1>
        <p style={{ fontSize: 14, color: "#6b6b6b", margin: 0 }}>
          Publish a standalone HTML page — a case study, a microsite — to a public, shareable
          /p/&lt;slug&gt; link that carries social-preview tags and tracks opens, unique viewers, and read time.
        </p>
      </div>
      <PagesView />
    </div>
  )
}
