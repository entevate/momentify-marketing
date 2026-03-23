"use client"

import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useGTMTheme } from "@/hooks/useGTMTheme"
import "@/styles/gtm-theme.css"
import {
  LayoutGrid,
  Building2,
  Target,
  MapPin,
  Layers,
  Ticket,
  CalendarDays,
  Sun,
  Moon,
  LogOut,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/gtm", icon: LayoutGrid, color: "#0CF4DF" },
  { label: "Trade Shows", href: "/gtm/trade-shows", icon: Building2, color: "#9B5FE8" },
  { label: "Technical Recruiting", href: "/gtm/recruiting", icon: Target, color: "#5FD9C2" },
  { label: "Field Sales", href: "/gtm/field-sales", icon: MapPin, color: "#F2B33D" },
  { label: "Facilities", href: "/gtm/facilities", icon: Layers, color: "#7B62C9" },
  { label: "Events & Venues", href: "/gtm/events-venues", icon: Ticket, color: "#F25E3D" },
  { label: "Execution Calendar", href: "/gtm/calendar", icon: CalendarDays, color: "#0CF4DF" },
]

function Sidebar({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark"
  toggleTheme: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()

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
        width: 240,
        minHeight: "100vh",
        background: "#061341",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px" }}>
        <Image
          src="/Momentify-Logo_Reverse.svg"
          alt="Momentify"
          width={120}
          height={24}
          style={{ height: 24, width: "auto" }}
          priority
        />
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(255, 255, 255, 0.08)",
          margin: "0 16px",
        }}
      />

      {/* Section label */}
      <div
        style={{
          padding: "20px 24px 12px",
          fontSize: 10,
          fontWeight: 600,
          color: "#0CF4DF",
          letterSpacing: "0.14em",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        GTM FRAMEWORK
      </div>

      {/* Nav items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                height: 44,
                padding: "0 24px",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'Inter', system-ui, sans-serif",
                color: active
                  ? "rgba(255, 255, 255, 1)"
                  : "rgba(255, 255, 255, 0.70)",
                background: active ? "rgba(255, 255, 255, 0.06)" : "transparent",
                borderLeft: active ? `3px solid ${item.color}` : "3px solid transparent",
                transition: "all 150ms ease",
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
              <Icon
                size={16}
                style={{
                  opacity: active ? 1 : 0.45,
                  flexShrink: 0,
                }}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ marginTop: "auto" }}>
        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255, 255, 255, 0.08)",
            margin: "0 16px",
          }}
        />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            height: 44,
            padding: "0 24px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 400,
            fontFamily: "'Inter', system-ui, sans-serif",
            color: "rgba(255, 255, 255, 0.55)",
            transition: "color 150ms ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255, 255, 255, 0.80)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255, 255, 255, 0.55)")
          }
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            height: 44,
            padding: "0 24px 16px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 400,
            fontFamily: "'Inter', system-ui, sans-serif",
            color: "rgba(255, 255, 255, 0.40)",
            transition: "color 150ms ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255, 255, 255, 0.70)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255, 255, 255, 0.40)")
          }
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default function GTMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useGTMTheme()

  // Login page renders without the sidebar/layout shell
  if (pathname === "/gtm/login") {
    return <>{children}</>
  }

  return (
    <div data-theme={theme} style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <main
        style={{
          flex: 1,
          background: "var(--gtm-bg-page)",
          overflowY: "auto",
          transition: "background 200ms ease",
        }}
      >
        {children}
      </main>
    </div>
  )
}
