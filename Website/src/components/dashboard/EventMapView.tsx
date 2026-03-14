"use client";

import { useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Calendar, Zap } from "lucide-react";
import type { DashboardEvent } from "./types";
import { getRoxZone } from "./mockSessions";

/* ── City lat/lng coordinates ── */
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "San Francisco, CA": { lat: 37.7749, lng: -122.4194 },
  "Chicago, IL": { lat: 41.8781, lng: -87.6298 },
  "Las Vegas, NV": { lat: 36.1699, lng: -115.1398 },
  "Austin, TX": { lat: 30.2672, lng: -97.7431 },
  "Boston, MA": { lat: 42.3601, lng: -71.0589 },
  "Dallas, TX": { lat: 32.7767, lng: -96.7970 },
  "Miami, FL": { lat: 25.7617, lng: -80.1918 },
  "Orlando, FL": { lat: 28.5383, lng: -81.3792 },
  "Denver, CO": { lat: 39.7392, lng: -104.9903 },
  "Houston, TX": { lat: 29.7604, lng: -95.3698 },
  "Portland, OR": { lat: 45.5152, lng: -122.6784 },
};

function groupByLocation(events: DashboardEvent[]) {
  const groups: Record<string, DashboardEvent[]> = {};
  for (const event of events) {
    if (!groups[event.location]) groups[event.location] = [];
    groups[event.location].push(event);
  }
  return groups;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (s.getFullYear() !== e.getFullYear()) {
    return `${s.toLocaleDateString("en-US", { ...opts, year: "numeric" })} - ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
  }
  if (s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString("en-US", { month: "short" })} ${s.getDate()}-${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${s.toLocaleDateString("en-US", opts)} - ${e.toLocaleDateString("en-US", opts)}, ${s.getFullYear()}`;
}

function getDotColor(events: DashboardEvent[]): string {
  if (events.some((e) => e.status === "live")) return "#E5484D";
  if (events.some((e) => e.status === "upcoming")) return "#1F3395";
  return "#00BBA5";
}

/* ── Dynamically import the map (Leaflet has no SSR support) ── */
const MapInner = dynamic(() => import("./EventMapInner"), { ssr: false });

interface EventMapViewProps {
  events: DashboardEvent[];
}

export default function EventMapView({ events }: EventMapViewProps) {
  const groups = useMemo(() => groupByLocation(events), [events]);

  const locations = useMemo(() => {
    return Object.entries(groups)
      .filter(([loc]) => CITY_COORDS[loc])
      .map(([loc, evts]) => ({
        location: loc,
        coords: CITY_COORDS[loc],
        events: evts,
        color: getDotColor(evts),
      }));
  }, [groups]);

  if (events.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          height: "calc(100vh - 320px)",
          minHeight: 400,
          background: "var(--dash-surface)",
          border: "1px solid var(--dash-border)",
        }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--dash-text-muted)" }}>
          No events match your filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{ height: "calc(100vh - 320px)", minHeight: 400, border: "1px solid var(--dash-border)" }}
    >
      <MapInner locations={locations} />
    </div>
  );
}

/* ── Exported popup helpers (used by EventMapInner) ── */

export function PopupContent({ events }: { events: DashboardEvent[] }) {
  return (
    <div className="event-map-popup" style={{ maxHeight: 300, overflowY: "auto" }}>
      {events.map((event, i) => (
        <PopupEventRow key={event.id} event={event} isLast={i === events.length - 1} />
      ))}
    </div>
  );
}

function PopupEventRow({ event, isLast }: { event: DashboardEvent; isLast: boolean }) {
  const showRox = event.status !== "upcoming" && event.roxScore != null;
  const rox = showRox ? getRoxZone(event.roxScore!) : null;

  return (
    <div
      style={{
        padding: "8px 0",
        borderBottom: isLast ? "none" : "1px solid var(--dash-border)",
      }}
    >
      {/* Gradient strip */}
      <div
        style={{
          height: 3,
          borderRadius: 2,
          marginBottom: 6,
          background: event.coverGradient,
        }}
      />

      {/* Name as link */}
      <a
        href={`/dashboard/events/${event.id}`}
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--dash-text)",
          textDecoration: "none",
          marginBottom: 4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {event.name}
      </a>

      {/* Date */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--dash-text-muted)" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <span style={{ fontSize: 11, color: "var(--dash-text-muted)" }}>
          {formatDateRange(event.startDate, event.endDate)}
        </span>
      </div>

      {/* Location */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--dash-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span style={{ fontSize: 11, color: "var(--dash-text-muted)" }}>
          {event.location}
        </span>
      </div>

      {/* Sessions + ROX + status row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {event.status === "upcoming" ? (
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--dash-text-muted)" }}>
            Not Started
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 500, color: "var(--dash-text-muted)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--dash-accent)" stroke="var(--dash-accent)" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            {event.sessionsCount} Sessions
          </span>
        )}

        {showRox && rox && (
          <span style={{ fontSize: 10, fontWeight: 600, color: rox.color }}>
            ROX {event.roxScore}
          </span>
        )}

        {event.status === "live" && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 9,
              fontWeight: 600,
              textTransform: "uppercase",
              color: "#E5484D",
              background: "rgba(229, 72, 77, 0.1)",
              padding: "1px 6px",
              borderRadius: 99,
            }}
          >
            Live
          </span>
        )}

        <div
          className="avatar-subtle"
          style={{
            marginLeft: event.status === "live" ? 0 : "auto",
            width: 20,
            height: 20,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 8,
            fontWeight: 600,
            flexShrink: 0,
          }}
          title={event.assignee.name}
        >
          {event.assignee.initials}
        </div>
      </div>
    </div>
  );
}
