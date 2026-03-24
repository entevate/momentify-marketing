"use client";

import { useEffect, useState } from "react";
import { instances, type ExplorerInstance } from "./instances";

interface ViewData {
  [slug: string]: { views: number; lastViewed: string };
}

function trackView(slug: string) {
  fetch("/api/prototypes/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug }),
  }).catch(() => {});
}

function formatDate(iso: string) {
  if (!iso) return "--";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function InstanceCard({
  instance,
  viewData,
}: {
  instance: ExplorerInstance;
  viewData?: { views: number; lastViewed: string };
}) {
  return (
    <a
      href={`/prototypes/explorer/${instance.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackView(instance.slug)}
      style={{ textDecoration: "none", display: "flex", height: "100%" }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 0,
          overflow: "hidden",
          transition: "border-color 0.2s, transform 0.2s",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 3, background: instance.accentColor }} />

        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
            }}
          >
            {instance.logo && (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={instance.logo}
                  alt={instance.company}
                  style={{ width: 44, height: 44, objectFit: "cover" }}
                />
              </div>
            )}
            <div>
              <div
                style={{
                  color: "var(--text)",
                  fontSize: 16,
                  fontWeight: 500,
                  marginBottom: 2,
                }}
              >
                {instance.name}
              </div>
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 400,
                }}
              >
                {instance.company} &middot; {instance.industry}
              </div>
            </div>
          </div>

          {/* Password row (only for password-protected instances) */}
          {instance.password && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 8,
                background: "var(--accent-sec)",
                border: "1px solid var(--border)",
                marginBottom: 16,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-caption)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span
                style={{
                  color: "var(--text-caption)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Password:
              </span>
              <code
                style={{
                  color: instance.accentColor,
                  fontSize: 12,
                  fontFamily: "monospace",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                {instance.password}
              </code>
            </div>
          )}

          {/* Copy link + Stats row */}
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              borderTop: "1px solid var(--border)",
              paddingTop: 16,
              marginTop: "auto",
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const base = window.location.origin;
                const pw = instance.password ? `?pw=${instance.password}` : "";
                const url = `${base}/prototypes/explorer/${instance.slug}${pw}`;
                navigator.clipboard.writeText(url);
                const btn = e.currentTarget;
                const orig = btn.textContent;
                btn.textContent = "Copied!";
                setTimeout(() => { btn.textContent = orig; }, 1500);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "transparent",
                color: instance.accentColor,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              Copy Link
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: 24,
              paddingTop: 12,
            }}
          >
            <div>
              <div
                style={{
                  color: instance.accentColor,
                  fontSize: 22,
                  fontWeight: 600,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {viewData?.views ?? 0}
              </div>
              <div
                style={{
                  color: "var(--text-caption)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Views
              </div>
            </div>
            <div>
              <div
                style={{
                  color: "var(--text)",
                  fontSize: 13,
                  fontWeight: 400,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {viewData?.lastViewed ? formatDate(viewData.lastViewed) : "Never"}
              </div>
              <div
                style={{
                  color: "var(--text-caption)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Last Viewed
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function ExplorerDashboard() {
  const [viewData, setViewData] = useState<ViewData>({});

  useEffect(() => {
    fetch("/api/prototypes/track", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { console.log("View data:", d); setViewData(d); })
      .catch((e) => console.error("Fetch error:", e));
  }, []);

  return (
    <div
      style={{
        padding: "40px 32px",
        maxWidth: 960,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            color: "var(--text)",
            fontSize: 26,
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          Explorer Instances
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 14,
            fontWeight: 300,
          }}
        >
          Personalized product discovery experiences for each client
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        {instances.map((instance) => (
          <InstanceCard
            key={instance.slug}
            instance={instance}
            viewData={viewData[instance.slug]}
          />
        ))}
      </div>
    </div>
  );
}
