"use client"

/**
 * /gtm/qr - top-level QR Codes surface in the sidebar nav.
 *
 * Thin wrapper that renders the shared QrLibrary component: build trackable
 * QR codes that encode /q/<id>, so destinations stay editable after printing
 * and every scan is logged.
 */

import QrLibrary from "@/components/gtm/QrLibrary"

const font = "'Inter', system-ui, -apple-system, sans-serif"

export default function QrPage() {
  return (
    <div style={{ padding: "40px 48px 80px", maxWidth: 1400, margin: "0 auto", fontFamily: font }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em", margin: "0 0 6px 0", color: "#181818" }}>
          QR Codes
        </h1>
        <p style={{ fontSize: 14, color: "#6b6b6b", margin: 0 }}>
          Build trackable QR codes for print. Each encodes a short link, so the destination stays
          editable after printing and every scan is logged — device and country included.
        </p>
      </div>
      <QrLibrary />
    </div>
  )
}
