"use client";

import BrandNav from "@/components/BrandNav";

export default function SocialToolkitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.22s ease, color 0.22s ease",
      }}
    >
      <BrandNav />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}
