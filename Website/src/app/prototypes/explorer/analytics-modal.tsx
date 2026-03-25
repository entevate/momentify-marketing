"use client";

import { useEffect, useState } from "react";
import type { ExplorerInstance } from "./instances";
import type { AnalyticsSummary } from "./analytics-types";
import { formatDuration, timeAgo, classifySource } from "./analytics-types";

interface AnalyticsModalProps {
  slug: string;
  instance: ExplorerInstance;
  onClose: () => void;
}

export function AnalyticsModal({ slug, instance, onClose }: AnalyticsModalProps) {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/prototypes/analytics?slug=${slug}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData({ totalSessions: 0, avgDurationMs: 0, sources: [], locations: [], recentSessions: [] }))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const maxSourceCount = data?.sources[0]?.count ?? 1;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111318",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          width: "100%",
          maxWidth: 640,
          maxHeight: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 3, background: instance.accentColor }} />

        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: "#fff" }}>
              {instance.name} Analytics
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              {instance.company}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              fontSize: 20,
              cursor: "pointer",
              padding: "4px 8px",
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        {loading ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              fontSize: 13,
            }}
          >
            Loading analytics...
          </div>
        ) : (
          <div style={{ overflow: "auto", flex: 1 }}>
            {/* Summary stats */}
            <div
              style={{
                display: "flex",
                gap: 32,
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: instance.accentColor,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {data!.totalSessions}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Sessions
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#fff",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {formatDuration(data!.avgDurationMs || null)}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Avg Duration
                </div>
              </div>
            </div>

            {/* Source breakdown */}
            {data!.sources.length > 0 && (
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 12,
                  }}
                >
                  Traffic Sources
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data!.sources.slice(0, 8).map((src) => (
                    <div key={src.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 100,
                          fontSize: 12,
                          color: "rgba(255,255,255,0.7)",
                          flexShrink: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {src.name}
                      </div>
                      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 3 }}>
                        <div
                          style={{
                            width: `${(src.count / maxSourceCount) * 100}%`,
                            height: "100%",
                            background: instance.accentColor,
                            borderRadius: 3,
                            minWidth: 4,
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", width: 28, textAlign: "right", flexShrink: 0 }}>
                        {src.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locations */}
            {data!.locations.length > 0 && (
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 12,
                  }}
                >
                  Locations
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data!.locations.slice(0, 8).map((loc) => (
                    <div key={loc.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 140,
                          fontSize: 12,
                          color: "rgba(255,255,255,0.7)",
                          flexShrink: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {loc.name}
                      </div>
                      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 3 }}>
                        <div
                          style={{
                            width: `${(loc.count / (data!.locations[0]?.count || 1)) * 100}%`,
                            height: "100%",
                            background: instance.accentColor,
                            borderRadius: 3,
                            opacity: 0.6,
                            minWidth: 4,
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", width: 28, textAlign: "right", flexShrink: 0 }}>
                        {loc.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent sessions */}
            <div style={{ padding: "20px 24px" }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 12,
                }}
              >
                Recent Sessions
              </div>
              {data!.recentSessions.length === 0 ? (
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", padding: "12px 0" }}>
                  No sessions recorded yet
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {/* Table header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 70px 90px",
                      gap: 12,
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Source</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Location</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Duration</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "right" }}>When</div>
                  </div>
                  {data!.recentSessions.map((session) => (
                    <div
                      key={session.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 70px 90px",
                        gap: 12,
                        padding: "10px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.7)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {classifySource(session)}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.5)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {[session.city, session.country].filter(Boolean).join(", ") || "--"}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                        {formatDuration(session.durationMs)}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "right" }}>
                        {timeAgo(session.startedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
