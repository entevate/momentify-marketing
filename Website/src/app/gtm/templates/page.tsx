"use client"

/**
 * /gtm/templates - top-level Templates page in the sidebar nav.
 *
 * Thin wrapper that renders the shared TemplatesGallery component.
 * (The gallery component lives under components/gtm/calendar/ so it can
 * also be embedded by related surfaces if we ever want to.)
 */

import TemplatesGallery from "@/components/gtm/calendar/TemplatesGallery"

const font = "'Inter', system-ui, -apple-system, sans-serif"

export default function TemplatesPage() {
  return (
    <div style={{ padding: "40px 48px 80px", maxWidth: 1400, margin: "0 auto", fontFamily: font }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em", margin: "0 0 6px 0", color: "#181818" }}>
          Templates
        </h1>
        <p style={{ fontSize: 14, color: "#6b6b6b", margin: 0 }}>
          Pre-approved social-post designs. Each template renders in your solution&apos;s brand palette. Claude fills the content slots at generation time — layout, palette, and typography stay fixed.
        </p>
      </div>
      <TemplatesGallery maxWidth={1400} />
    </div>
  )
}
