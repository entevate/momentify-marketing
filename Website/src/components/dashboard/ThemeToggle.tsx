"use client";

import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center gap-1 rounded-full p-1"
      style={{
        background: "var(--dash-surface-2)",
        border: "1px solid var(--dash-border)",
      }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span
        className="flex items-center justify-center rounded-full transition-colors duration-200"
        style={{
          width: 32,
          height: 32,
          background: theme === "light" ? "var(--dash-surface)" : "transparent",
          boxShadow: theme === "light" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <Sun size={16} style={{ color: theme === "light" ? "var(--dash-accent)" : "var(--dash-text-muted)" }} />
      </span>
      <span
        className="flex items-center justify-center rounded-full transition-colors duration-200"
        style={{
          width: 32,
          height: 32,
          background: theme === "dark" ? "var(--dash-surface)" : "transparent",
          boxShadow: theme === "dark" ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <Moon size={16} style={{ color: theme === "dark" ? "var(--dash-accent)" : "var(--dash-text-muted)" }} />
      </span>
    </button>
  );
}
