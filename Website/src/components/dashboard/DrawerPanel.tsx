"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings } from "lucide-react";

interface DrawerPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
}

export default function DrawerPanel({ open, onClose, title, children, icon, footer }: DrawerPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap: focus the panel when opened
  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30"
            style={{ background: "var(--dash-overlay)" }}
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-40 flex h-full w-full max-w-md flex-col shadow-dash-4 md:w-[480px]"
            style={{
              background: "var(--dash-surface)",
              borderLeft: "1px solid var(--dash-border)",
            }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid var(--dash-border)" }}
            >
              <div className="flex items-center gap-2.5">
                {icon !== undefined ? icon : <Settings size={18} style={{ color: "var(--dash-text-muted)" }} />}
                <h2
                  className="text-lg font-medium"
                  style={{ color: "var(--dash-text)" }}
                >
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 transition-colors duration-150"
                style={{ color: "var(--dash-text-muted)" }}
                aria-label="Close drawer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>

            {/* Optional footer */}
            {footer && (
              <div
                className="shrink-0 px-6 py-4"
                style={{ borderTop: "1px solid var(--dash-border)" }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
