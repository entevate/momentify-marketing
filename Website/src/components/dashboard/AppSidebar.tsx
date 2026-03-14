"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Building2,
  FileText,
  BarChart3,
  Settings,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import WorkspaceSelector from "./WorkspaceSelector";
import type { NavItem } from "./types";

const navItems: NavItem[] = [
  {
    label: "Events",
    icon: Calendar,
    href: "/dashboard/events",
    children: [
      { label: "All", href: "/dashboard/events?tab=all" },
      { label: "Live", href: "/dashboard/events?tab=live" },
      { label: "Upcoming", href: "/dashboard/events?tab=upcoming" },
      { label: "Past", href: "/dashboard/events?tab=past" },
    ],
  },
  { label: "Facilities", icon: Building2, href: "/dashboard/facilities" },
  { label: "Content", icon: FileText, href: "/dashboard/content" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

interface AppSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AppSidebar({
  collapsed,
  mobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const isActive = (href: string) => {
    if (href.includes("?")) return false;
    return pathname.startsWith(href);
  };

  const isChildActive = (childHref: string) => {
    const url = new URL(childHref, "http://localhost");
    const parentPath = url.pathname;
    const childTab = url.searchParams.get("tab");
    if (!pathname.startsWith(parentPath)) return false;
    const currentTab = searchParams.get("tab") || "all";
    return childTab === currentTab;
  };

  const sidebarContent = (
    <div
      className="flex h-full flex-col"
      style={{ background: "var(--dash-sidebar-bg)" }}
    >
      {/* Logo - vertically centered in the top bar height */}
      <div className="flex h-[71px] shrink-0 items-center pl-[18px] pr-3">
        {collapsed ? (
          <Image
            src="/Momentify-Icon.svg"
            alt="Momentify"
            width={24}
            height={24}
          />
        ) : (
          <Image
            src={isDark ? "/Momentify-Logo_Reverse.svg" : "/Momentify-Logo.svg"}
            alt="Momentify"
            width={136}
            height={28}
            className="w-[120px] h-auto"
          />
        )}
      </div>

      {/* Workspace Selector - aligns below top bar line */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <WorkspaceSelector />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <div key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150"
                style={{
                  color: active
                    ? "var(--dash-sidebar-text-active)"
                    : "var(--dash-sidebar-text)",
                  background: active
                    ? "var(--dash-sidebar-surface)"
                    : "transparent",
                }}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
              {/* Sub-items */}
              {!collapsed && active && item.children && (
                <div className="ml-8 mt-0.5 space-y-0.5">
                  {item.children.map((child) => {
                    const childActive = isChildActive(child.href);
                    return (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-md px-3 py-1.5 text-[13px] transition-colors duration-150"
                        style={{
                          color: childActive
                            ? "var(--dash-sidebar-text-active)"
                            : "var(--dash-sidebar-text)",
                          fontWeight: childActive ? 500 : 400,
                          background: childActive
                            ? "var(--dash-sidebar-surface)"
                            : "transparent",
                        }}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex h-full flex-col transition-all duration-300"
        style={{
          width: collapsed ? 64 : 240,
          minWidth: collapsed ? 64 : 240,
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 md:hidden"
              style={{ background: "var(--dash-overlay)" }}
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 z-40 h-full w-[280px] md:hidden"
            >
              <button
                onClick={onMobileClose}
                className="absolute right-3 top-4 z-10 rounded-lg p-1.5"
                style={{ color: "var(--dash-sidebar-text)" }}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
