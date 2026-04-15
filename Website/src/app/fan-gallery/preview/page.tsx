"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const PRESETS = [
  { label: "Mobile", w: 393, h: 852 },
  { label: "Tablet", w: 1024, h: 768 },
  { label: "Desktop", w: 1280, h: 800 },
];

const TEAL = "#00BBA5";

export default function FanGalleryPreviewPage() {
  return (
    <Suspense>
      <FanGalleryPreview />
    </Suspense>
  );
}

function FanGalleryPreview() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "demo";
  const galleryUrl = `/fan-gallery/${slug}`;

  const [device, setDevice] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mk-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  const preset = PRESETS[device];
  const isPhone = preset.label === "Mobile";
  const isTablet = preset.label === "Tablet";

  // Scale to fit viewport
  const maxW = typeof window !== "undefined" ? window.innerWidth - 120 : 800;
  const maxH = typeof window !== "undefined" ? window.innerHeight - 200 : 600;
  const scale = Math.min(maxW / preset.w, maxH / preset.h, 1);
  const scaledW = preset.w * scale;
  const scaledH = preset.h * scale;

  const bezelRadius = isPhone ? 40 : isTablet ? 24 : 8;
  const bezelPadTop = isPhone ? 48 : isTablet ? 20 : 28;
  const bezelPadBottom = isPhone ? 48 : isTablet ? 20 : 12;
  const bezelPadSide = isPhone ? 12 : isTablet ? 12 : 0;

  const bg = theme === "dark" ? "#07081F" : "#F4F5FA";
  const surface = theme === "dark" ? "#0F1035" : "#FFFFFF";
  const border = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(11,11,60,0.1)";
  const text = theme === "dark" ? "#E8EAF6" : "#0B0B3C";
  const textMuted = theme === "dark" ? "rgba(232,234,246,0.5)" : "rgba(11,11,60,0.5)";
  const bezelBg = theme === "dark" ? "#1a1a1e" : "#e4e4e7";
  const bezelBorder = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${galleryUrl}` : galleryUrl;

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Toolbar */}
      <div style={{
        width: "100%",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        borderBottom: `1px solid ${border}`,
        flexWrap: "wrap",
      }}>
        {/* URL bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 6,
          padding: "8px 12px",
          fontSize: 12,
          fontFamily: "monospace",
          color: textMuted,
          minWidth: 200,
        }}>
          <span style={{ color: text, fontWeight: 500 }}>{galleryUrl}</span>
        </div>

        {/* Copy URL */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          style={{
            padding: "8px 14px",
            fontSize: 11,
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            border: `1px solid ${border}`,
            borderRadius: 6,
            background: copied ? TEAL : "transparent",
            color: copied ? "#fff" : textMuted,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 150ms ease",
          }}
        >
          {copied ? "Copied!" : "Copy URL"}
        </button>

        {/* Device switcher */}
        <div style={{
          display: "flex",
          borderRadius: 6,
          overflow: "hidden",
          border: `1px solid ${border}`,
        }}>
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => setDevice(i)}
              style={{
                padding: "8px 14px",
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                border: "none",
                cursor: "pointer",
                background: device === i ? TEAL : "transparent",
                color: device === i ? "#fff" : textMuted,
                borderRight: i < PRESETS.length - 1 ? `1px solid ${border}` : "none",
                transition: "all 150ms ease",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
          style={{
            padding: "8px",
            border: `1px solid ${border}`,
            borderRadius: 6,
            background: "transparent",
            color: textMuted,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M4.2 13.8l1.4-1.4M12.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M15.1 11.3A6.5 6.5 0 016.7 2.9a7 7 0 108.4 8.4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Device bezel */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
      }}>
        <div style={{
          background: bezelBg,
          borderRadius: bezelRadius,
          padding: `${bezelPadTop}px ${bezelPadSide}px ${bezelPadBottom}px`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
          border: `1px solid ${bezelBorder}`,
          position: "relative",
        }}>
          {/* Dynamic Island */}
          {isPhone && (
            <div style={{
              position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
              width: 36, height: 11, borderRadius: 6,
              background: theme === "dark" ? "#000" : "#1a1a1e",
            }} />
          )}
          {/* Tablet camera */}
          {isTablet && (
            <div style={{
              position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
              width: 8, height: 8, borderRadius: "50%",
              background: theme === "dark" ? "#333" : "#bbb",
            }} />
          )}

          {/* Screen */}
          <div style={{
            width: scaledW,
            height: scaledH,
            borderRadius: isPhone ? 4 : 2,
            overflow: "hidden",
            background: "#000",
            position: "relative",
          }}>
            <iframe
              src={galleryUrl}
              title={`Fan Gallery - ${preset.label}`}
              style={{
                border: "none",
                width: preset.w,
                height: preset.h,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            />
          </div>

          {/* Phone home indicator */}
          {isPhone && (
            <div style={{
              position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
              width: 100, height: 4, borderRadius: 2,
              background: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            }} />
          )}
        </div>

        {/* Size indicator */}
        <div style={{
          textAlign: "center",
          fontSize: 10,
          color: textMuted,
          marginTop: 12,
        }}>
          {preset.w} x {preset.h}
        </div>
      </div>
    </div>
  );
}
