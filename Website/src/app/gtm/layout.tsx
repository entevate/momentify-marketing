"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import "@/styles/gtm-theme.css"
import {
  LayoutGrid,
  Building2,
  Target,
  MapPin,
  Layers,
  Ticket,
  CalendarDays,
  Images,
  Mail,
  LogOut,
  PenSquare,
  CreditCard,
  FileText,
  Palette,
  BarChart3,
  Contact,
  QrCode,
  Link2,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"

type NavLink = {
  label: string
  href: string
  icon: LucideIcon
  color: string
  /**
   * Part of the fleet-wide nav structure (STRUCTURE.md §1) but naming a module
   * this engine does not have yet. Structure is invariant across engines;
   * visibility is per-engine state — when a module lands, the entry un-hides
   * instead of the nav being redesigned.
   */
  hidden?: boolean
}

const ACCENT = "#0CF4DF"

/**
 * Organised by WHAT YOU ARE DOING (STRUCTURE.md §1, decision #7). Creation
 * happens inside the solutions (Content Builder), so Templates (a reference
 * gallery) and Media Library (an asset shelf) are what creation draws FROM —
 * they join Framework and Brand under FOUNDATION. The collateral builders are
 * the only true top-level creation surfaces, so they sit flat in CREATE.
 * Momentify has a real email system, so Email is visible in Distribute where
 * the other engines keep it hidden.
 */
const SECTIONS: { label: string; items: NavLink[] }[] = [
  {
    label: "Foundation",
    items: [
      { label: "Framework", href: "/gtm", icon: LayoutGrid, color: ACCENT },
      { label: "Brand", href: "/gtm/brand-kit", icon: Palette, color: ACCENT, hidden: true },
      { label: "Templates", href: "/gtm/templates", icon: Images, color: ACCENT },
      { label: "Media Library", href: "/gtm/media", icon: Images, color: ACCENT, hidden: true },
    ],
  },
  {
    label: "Create",
    items: [
      { label: "Email Signature", href: "/gtm/email-signature", icon: PenSquare, color: ACCENT },
      { label: "Business Card", href: "/gtm/business-card", icon: CreditCard, color: ACCENT },
      { label: "Letterhead", href: "/gtm/letterhead", icon: FileText, color: ACCENT },
      { label: "Backgrounds", href: "/gtm/backgrounds", icon: Layers, color: ACCENT, hidden: true },
    ],
  },
  {
    label: "Distribute",
    items: [
      { label: "Calendar", href: "/gtm/calendar", icon: CalendarDays, color: ACCENT },
      { label: "Email", href: "/gtm/email", icon: Mail, color: ACCENT },
      { label: "Contacts", href: "/gtm/contacts", icon: Contact, color: ACCENT, hidden: true },
      { label: "Pages", href: "/gtm/pages", icon: FileText, color: ACCENT },
      { label: "QR Codes", href: "/gtm/qr", icon: QrCode, color: ACCENT },
      { label: "Link in Bio", href: "/gtm/link-in-bio", icon: Link2, color: ACCENT },
    ],
  },
  {
    label: "Measure",
    items: [
      { label: "Analytics", href: "/gtm/analytics", icon: BarChart3, color: ACCENT, hidden: true },
    ],
  },
  {
    label: "Solutions",
    items: [
      { label: "General Momentify", href: "/gtm/general", icon: Layers, color: ACCENT },
      { label: "Trade Shows", href: "/gtm/trade-shows", icon: Building2, color: "#9B5FE8" },
      { label: "Technical Recruiting", href: "/gtm/recruiting", icon: Target, color: "#5FD9C2" },
      { label: "Field Sales", href: "/gtm/field-sales", icon: MapPin, color: "#F2B33D" },
      { label: "Facilities", href: "/gtm/facilities", icon: Layers, color: "#5B4499" },
      { label: "Events & Venues", href: "/gtm/events-venues", icon: Ticket, color: "#D43D1A" },
    ],
  },
]

const visibleSections = SECTIONS.map((s) => ({
  ...s,
  items: s.items.filter((i) => !i.hidden),
})).filter((s) => s.items.length > 0)

const NAV_FOLDED_KEY = "momentify_gtm_nav_folded"
const SIDEBAR_COLLAPSED_KEY = "momentify_gtm_sidebar_collapsed"
const EXPANDED_WIDTH = 240
const STRIP_WIDTH = 72

const font = "'Inter', system-ui, sans-serif"

function FoldChevron({ open }: { open: boolean }) {
  return (
    <ChevronRight
      size={9}
      style={{ flexShrink: 0, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}
      aria-hidden
    />
  )
}

function NavLinkRow({
  item,
  collapsed,
  active,
}: {
  item: NavLink
  collapsed: boolean
  active: boolean
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 44,
        padding: collapsed ? "0" : "0 24px 0 32px",
        justifyContent: collapsed ? "center" : "flex-start",
        textDecoration: "none",
        fontSize: 14,
        fontWeight: 500,
        fontFamily: font,
        color: active ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.70)",
        background: active ? "rgba(255, 255, 255, 0.06)" : "transparent",
        borderLeft: active ? `3px solid ${item.color}` : "3px solid transparent",
        transition: "all 150ms ease",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = "rgba(255, 255, 255, 0.90)"
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = "rgba(255, 255, 255, 0.70)"
          e.currentTarget.style.background = "transparent"
        }
      }}
    >
      <Icon size={16} style={{ opacity: active ? 1 : 0.45, flexShrink: 0 }} />
      {!collapsed && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
    </Link>
  )
}

function Sidebar({
  isMobile = false,
  drawerOpen = false,
  onClose,
}: {
  isMobile?: boolean
  drawerOpen?: boolean
  onClose?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  // Per-section fold (chevron on the label), independent of the whole-sidebar
  // width collapse. Both persisted so the sidebar comes back the way it was left.
  const [folded, setFolded] = useState<Record<string, boolean>>({})
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      const f = localStorage.getItem(NAV_FOLDED_KEY)
      if (f) setFolded(JSON.parse(f))
      setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true")
    } catch {
      // Corrupt state just means everything starts expanded.
    }
  }, [])

  // The mobile drawer always shows the full nav, never the icon strip.
  useEffect(() => {
    if (isMobile) setCollapsed(false)
  }, [isMobile])

  function toggleSection(label: string) {
    setFolded((prev) => {
      const next = { ...prev, [label]: !prev[label] }
      try {
        localStorage.setItem(NAV_FOLDED_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  function toggleCollapsed() {
    setCollapsed((prev) => {
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(!prev))
      } catch {}
      return !prev
    })
  }

  function isActive(href: string) {
    if (href === "/gtm") return pathname === "/gtm"
    return pathname.startsWith(href)
  }

  function handleSignOut() {
    document.cookie = "gtm_auth=; path=/; max-age=0"
    router.push("/gtm/login")
  }

  return (
    <aside
      style={{
        width: isMobile ? EXPANDED_WIDTH : collapsed ? STRIP_WIDTH : EXPANDED_WIDTH,
        transition: isMobile ? "transform 0.22s ease" : "width 0.2s ease",
        minHeight: "100vh",
        height: isMobile ? "100dvh" : undefined,
        background: "#061341",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
        ...(isMobile
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 1000,
              transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
              boxShadow: drawerOpen ? "0 0 40px rgba(0,0,0,0.5)" : "none",
            }
          : {}),
      }}
    >
      {isMobile && (
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 3,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 8,
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      )}
      {/* Logo */}
      <div style={{ padding: collapsed ? "28px 0 20px" : "28px 24px 20px", textAlign: collapsed ? "center" : undefined }}>
        <Image
          src={collapsed ? "/Momentify-Icon.svg" : "/Momentify-Logo_Reverse.svg"}
          alt="Momentify"
          width={collapsed ? 28 : 120}
          height={collapsed ? 28 : 24}
          style={{ height: collapsed ? 28 : 24, width: "auto", margin: collapsed ? "0 auto" : undefined }}
          priority
        />
      </div>

      <div style={{ height: 1, background: "rgba(255, 255, 255, 0.08)", margin: "0 16px" }} />

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8, ...(isMobile ? { flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" } : {}) }}>
        {visibleSections.map((section, sIdx) => {
          const isFolded = !collapsed && folded[section.label]
          return (
            <div key={section.label}>
              {collapsed ? (
                sIdx > 0 && <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 16px" }} />
              ) : (
                <button
                  onClick={() => toggleSection(section.label)}
                  aria-expanded={!isFolded}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    width: "100%",
                    textAlign: "left",
                    padding: "16px 24px 6px",
                    fontSize: 10,
                    fontWeight: 600,
                    color: ACCENT,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontFamily: font,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FoldChevron open={!isFolded} />
                  {section.label}
                </button>
              )}
              {!isFolded &&
                section.items.map((item) => (
                  <NavLinkRow key={item.href} item={item} collapsed={collapsed} active={isActive(item.href)} />
                ))}
            </div>
          )
        })}
      </nav>

      {/* Footer contract (STRUCTURE.md §1): one row — Sign Out left, collapse
          toggle right; strip mode shows the toggle centered. */}
      <div style={{ marginTop: "auto" }}>
        <div style={{ height: 1, background: "rgba(255, 255, 255, 0.08)", margin: "0 16px" }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            padding: isMobile
              ? "10px 20px calc(16px + env(safe-area-inset-bottom, 20px))"
              : collapsed
                ? "12px 0"
                : "10px 20px 16px",
          }}
        >
          {!collapsed && (
            <button
              onClick={handleSignOut}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: font,
                color: "rgba(255, 255, 255, 0.40)",
                padding: 0,
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.70)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.40)")}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          )}
          {!isMobile && (
          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255, 255, 255, 0.55)",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          )}
        </div>
      </div>
    </aside>
  )
}

export default function GTMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  // Login page renders without the sidebar/layout shell
  if (pathname === "/gtm/login") {
    return <>{children}</>
  }

  return (
    // Light only, fleet-wide (STRUCTURE.md §1) — the theme toggle is gone.
    <div data-theme="light" style={{ display: "flex", minHeight: "100vh" }}>
      {isMobile && drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          aria-hidden
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }}
        />
      )}
      <Sidebar isMobile={isMobile} drawerOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          background: "var(--gtm-bg-page)",
          overflowY: "auto",
          transition: "background 200ms ease",
          ...(isMobile ? { height: "100dvh", overflowX: "hidden" as const } : {}),
        }}
      >
        {isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              background: "#061341",
              position: "sticky",
              top: 0,
              zIndex: 500,
            }}
          >
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              style={{ background: "transparent", border: "none", padding: 4, cursor: "pointer", lineHeight: 0, color: "#fff" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <img src="/Momentify-Logo_Reverse.svg" alt="Momentify" style={{ height: 18, display: "block" }} />
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
