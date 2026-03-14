"use client";

import Link from "next/link";
import EventCard from "./EventCard";
import EventMapView from "./EventMapView";
import { getRoxZone } from "./mockSessions";
import type { DashboardEvent, ViewMode } from "./types";

interface EventGridProps {
  events: DashboardEvent[];
  viewMode: ViewMode;
}

export default function EventGrid({ events, viewMode }: EventGridProps) {
  // Map view handles its own empty state (shows dimmed map)
  if (viewMode === "map") {
    return <EventMapView events={events} />;
  }

  if (events.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl py-20"
        style={{
          background: "var(--dash-surface)",
          border: "1px solid var(--dash-border)",
        }}
      >
        <div
          className="mb-3 text-5xl"
          style={{ color: "var(--dash-text-subtle)" }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </div>
        <h4
          className="mb-1 text-base font-medium"
          style={{ color: "var(--dash-text)" }}
        >
          No events found
        </h4>
        <p
          className="text-sm"
          style={{ color: "var(--dash-text-muted)" }}
        >
          Create your first event to get started.
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {events.map((event, i) => (
          <Link key={event.id} href={`/dashboard/events/${event.id}`}>
            <div
              className="flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-colors duration-150 hover:opacity-80"
              style={{
                background: "var(--dash-surface)",
                border: "1px solid var(--dash-border)",
              }}
            >
              <div
                className="h-12 w-12 flex-shrink-0 rounded-lg"
                style={{ background: event.coverGradient }}
              />
              <div className="min-w-0 flex-1">
                <h3
                  className="truncate text-sm font-medium"
                  style={{ color: "var(--dash-text)" }}
                >
                  {event.name}
                </h3>
                <p
                  className="text-xs"
                  style={{ color: "var(--dash-text-muted)" }}
                >
                  {event.location}
                </p>
              </div>
              <span
                className="text-xs"
                style={{ color: "var(--dash-text-muted)" }}
              >
                {event.status === "upcoming"
                  ? "Not Started"
                  : `${event.sessionsCount} Sessions`}
              </span>
              {event.status !== "upcoming" && event.roxScore != null && (
                <ListRoxGauge score={event.roxScore} />
              )}
              <div
                className="avatar-subtle flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold"
              >
                {event.assignee.initials}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {events.map((event, i) => (
        <EventCard key={event.id} event={event} index={i} />
      ))}
    </div>
  );
}

function ListRoxGauge({ score }: { score: number }) {
  const rox = getRoxZone(score);
  const r = 12;
  const cx = 14;
  const cy = 14;
  const circumference = Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex items-center gap-1.5">
      <svg width={28} height={16} viewBox="0 0 28 16" overflow="visible">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="var(--dash-surface-2)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={rox.color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="text-xs font-semibold" style={{ color: rox.color }}>{score}</span>
    </div>
  );
}
