"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Plus, Menu, Flame, FileDown, Calendar, Zap } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

interface AppTopBarProps {
  onCreateEvent: () => void;
  onMenuToggle: () => void;
}

const mockNotifications = [
  { id: 1, icon: <Flame size={16} />, color: "#EF4444", text: "New hot lead: Jordan Lee at Talent Acquisition Live", time: "2m ago" },
  { id: 2, icon: <FileDown size={16} />, color: "var(--dash-accent)", text: "Session export complete: Campus Career Fair", time: "15m ago" },
  { id: 3, icon: <Calendar size={16} />, color: "var(--dash-text-muted)", text: "Field Sales Kickoff event ended", time: "1h ago" },
  { id: 4, icon: <Zap size={16} />, color: "var(--dash-accent)", text: "3 new sessions captured at Talent Acquisition Live", time: "3h ago" },
];

export default function AppTopBar({ onCreateEvent, onMenuToggle }: AppTopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showNotifications) return;
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications]);

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 md:px-6 lg:px-8"
      style={{
        background: "var(--dash-bg)",
        borderBottom: "1px solid var(--dash-border)",
      }}
    >
      {/* Left: mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="mr-3 rounded-lg p-2 md:hidden"
        style={{ color: "var(--dash-text)" }}
        aria-label="Toggle sidebar"
      >
        <Menu size={22} />
      </button>

      {/* Spacer to push items right */}
      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 transition-colors duration-150"
            style={{ color: "var(--dash-text-muted)" }}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
              style={{ background: "#E5484D" }}
            />
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 top-full z-30 mt-1 w-80 rounded-xl p-2 shadow-dash-3"
              style={{ background: "var(--dash-surface)", border: "1px solid var(--dash-border)" }}
            >
              <div className="mb-1 px-3 py-2">
                <h3 className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>Notifications</h3>
              </div>
              {mockNotifications.map((n) => (
                <button
                  key={n.id}
                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-100 hover:bg-[var(--dash-surface-2)]"
                >
                  <span className="mt-0.5 shrink-0" style={{ color: n.color }}>{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug" style={{ color: "var(--dash-text)" }}>{n.text}</p>
                    <p className="mt-0.5 text-[11px]" style={{ color: "var(--dash-text-muted)" }}>{n.time}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Create Event button */}
        <button
          onClick={onCreateEvent}
          className="bg-dash-action-light flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 md:px-4"
        >
          <Plus size={16} />
          <span className="hidden md:inline">Create Event</span>
        </button>

        {/* Theme toggle - hidden on very small screens */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
