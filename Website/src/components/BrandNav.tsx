"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const THEME_KEY = "mk-theme";

/* ── Theme CSS variables (mirrors brand-nav.css) ── */
const darkVars: Record<string, string> = {
  "--bg": "#07081F",
  "--bg-card": "#0E0F2E",
  "--bg-card-2": "#12143A",
  "--surface": "#0F1035",
  "--surface-2": "#161840",
  "--border": "rgba(12, 244, 223, 0.12)",
  "--text": "#FFFFFF",
  "--text-muted": "rgba(255, 255, 255, 0.45)",
  "--text-body": "rgba(255, 255, 255, 0.72)",
  "--text-caption": "rgba(255, 255, 255, 0.42)",
  "--accent": "#0CF4DF",
  "--accent-sec": "rgba(12, 244, 223, 0.08)",
  "--nav-bg": "#07081F",
  "--nav-border": "rgba(12, 244, 223, 0.12)",
  "--nav-link": "rgba(255, 255, 255, 0.45)",
  "--toggle-bg": "rgba(255, 255, 255, 0.1)",
  "--toggle-border": "rgba(255, 255, 255, 0.18)",
  "--toggle-text": "rgba(255, 255, 255, 0.8)",
  "--header-bg": "rgba(7, 8, 31, 0.94)",
};
const lightVars: Record<string, string> = {
  "--bg": "#F4F5FA",
  "--bg-card": "#FFFFFF",
  "--bg-card-2": "#ECEEF6",
  "--surface": "#FFFFFF",
  "--surface-2": "#ECEEF6",
  "--border": "rgba(31, 51, 149, 0.12)",
  "--text": "#0B0B3C",
  "--text-muted": "rgba(11, 11, 60, 0.48)",
  "--text-body": "rgba(11, 11, 60, 0.68)",
  "--text-caption": "rgba(11, 11, 60, 0.38)",
  "--accent": "#1F3395",
  "--accent-sec": "rgba(31, 51, 149, 0.06)",
  "--nav-bg": "#FFFFFF",
  "--nav-border": "rgba(11, 11, 60, 0.1)",
  "--nav-link": "rgba(11, 11, 60, 0.48)",
  "--toggle-bg": "rgba(11, 11, 60, 0.06)",
  "--toggle-border": "rgba(11, 11, 60, 0.14)",
  "--toggle-text": "rgba(11, 11, 60, 0.7)",
  "--header-bg": "rgba(244, 245, 250, 0.96)",
};

function applyThemeVars(dark: boolean) {
  const vars = dark ? darkVars : lightVars;
  const root = document.documentElement;
  root.setAttribute("data-theme", dark ? "dark" : "light");
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

/* ── Nav config (matches brand-nav.js) ── */
const navLinks = [
  { label: "Brand Guidelines", href: "/brand/index.html" },
  { label: "Design System", href: "/brand/design-system.html" },
  { label: "Backgrounds", href: "/brand/backgrounds.html" },
  { label: "Social Toolkit", href: "/social-toolkit" },
];

// Graphic Library removed: Email Signature moved to Brand Guidelines side nav

const prototypeLinks: { label: string; href: string; newWindow?: boolean }[] = [
  { label: "Web", href: "/dashboard/events", newWindow: true },
  { label: "Explorer", href: "/prototypes/explorer" },
  { label: "Fan", href: "/fan-gallery/admin" },
];

function checkActive(href: string, pathname: string) {
  if (href.startsWith("/brand/")) return false;
  if (href === pathname) return true;
  if (href !== "/" && pathname.startsWith(href)) return true;
  return false;
}

export default function BrandNav() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const dark = saved ? saved === "dark" : true;
    setIsDark(dark);
    applyThemeVars(dark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    applyThemeVars(next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  }

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: "var(--header-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.22s ease, border-color 0.22s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 32px",
          height: 60,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Logo */}
        <a
          href="/brand/index.html"
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          <img
            src={isDark ? "/brand/assets/Momentify-Logo_Reverse.svg" : "/brand/assets/Momentify-Logo.svg"}
            alt="Momentify"
            style={{ height: 22, width: "auto" }}
          />
        </a>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--border)",
            flexShrink: 0,
          }}
        />

        {/* Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {navLinks.map((p) => {
            const active = checkActive(p.href, pathname);
            return (
              <a
                key={p.href}
                href={p.href}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "6px 10px",
                  borderRadius: 6,
                  transition: "color 0.15s, background 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {p.label}
              </a>
            );
          })}

          {/* Divider before prototypes */}
          <div
            style={{
              width: 1,
              height: 16,
              background: "var(--border)",
              flexShrink: 0,
              margin: "0 4px",
            }}
          />

          {/* Prototype links */}
          {prototypeLinks.map((p) => {
            const active = checkActive(p.href, pathname);
            return (
              <a
                key={p.href}
                href={p.href}
                target={p.newWindow ? "_blank" : undefined}
                rel={p.newWindow ? "noopener noreferrer" : undefined}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "6px 10px",
                  borderRadius: 6,
                  transition: "color 0.15s, background 0.15s",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <img
                  src={isDark ? "/brand/assets/Momentify-Icon.svg" : "/brand/assets/Momentify-Icon_Dark.svg"}
                  alt=""
                  style={{ width: 14, height: 14, flexShrink: 0 }}
                />
                {p.label}
                {p.newWindow && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                )}
              </a>
            );
          })}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: "var(--toggle-bg)",
            border: "1px solid var(--toggle-border)",
            borderRadius: 100,
            padding: "7px 16px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--toggle-text)",
            fontFamily: "Inter, sans-serif",
            transition: "background 0.15s, border-color 0.15s, color 0.15s",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {isDark ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
}
