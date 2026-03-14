"use client";

import { useState } from "react";
import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import AppSidebar from "@/components/dashboard/AppSidebar";
import AppTopBar from "@/components/dashboard/AppTopBar";
import DrawerPanel from "@/components/dashboard/DrawerPanel";
import CreateEventForm from "@/components/dashboard/CreateEventForm";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ThemeProvider>
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: "var(--dash-bg)" }}
      >
        {/* Sidebar */}
        <AppSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppTopBar
            onCreateEvent={() => setDrawerOpen(true)}
            onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
          />
          <main
            className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8"
            style={{ background: "var(--dash-bg)" }}
          >
            {children}
          </main>
        </div>

        {/* Create Event Drawer */}
        <DrawerPanel
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Create Event"
        >
          <CreateEventForm onCancel={() => setDrawerOpen(false)} />
        </DrawerPanel>
      </div>
    </ThemeProvider>
  );
}
