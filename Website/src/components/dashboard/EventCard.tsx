"use client";

import Link from "next/link";
import { Calendar, MapPin, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { DashboardEvent } from "./types";
import { getRoxZone } from "./mockSessions";

interface EventCardProps {
  event: DashboardEvent;
  index: number;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const yearOpts: Intl.DateTimeFormatOptions = { ...opts, year: "numeric" };

  if (s.getFullYear() !== e.getFullYear()) {
    return `${s.toLocaleDateString("en-US", yearOpts)} - ${e.toLocaleDateString("en-US", yearOpts)}`;
  }
  if (s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString("en-US", { month: "short" })} ${s.getDate()}-${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${s.toLocaleDateString("en-US", opts)} - ${e.toLocaleDateString("en-US", opts)}, ${s.getFullYear()}`;
}

export default function EventCard({ event, index }: EventCardProps) {
  const showRox = event.status !== "upcoming" && event.roxScore != null;
  const rox = showRox ? getRoxZone(event.roxScore!) : null;

  return (
    <Link href={`/dashboard/events/${event.id}`}>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group cursor-pointer overflow-hidden rounded-xl shadow-dash-2 transition-shadow duration-200 hover:shadow-dash-3"
      style={{
        background: "var(--dash-surface)",
        border: "1px solid var(--dash-border)",
      }}
    >
      {/* Cover image / gradient */}
      <div
        className="relative h-36 w-full"
        style={{ background: event.coverGradient }}
      >
        {/* Status badge */}
        {event.status === "live" && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Live
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Event name */}
        <h3
          className="mb-3 truncate text-[15px] font-medium leading-tight"
          style={{ color: "var(--dash-text)" }}
          title={event.name}
        >
          {event.name}
        </h3>

        {/* Meta: date */}
        <div className="mb-1.5 flex items-center gap-2">
          <Calendar size={14} style={{ color: "var(--dash-text-muted)", flexShrink: 0 }} />
          <span
            className="text-[13px]"
            style={{ color: "var(--dash-text-muted)" }}
          >
            {formatDateRange(event.startDate, event.endDate)}
          </span>
        </div>

        {/* Meta: location */}
        <div className="mb-3 flex items-center gap-2">
          <MapPin size={14} style={{ color: "var(--dash-text-muted)", flexShrink: 0 }} />
          <span
            className="text-[13px]"
            style={{ color: "var(--dash-text-muted)" }}
          >
            {event.location}
          </span>
        </div>

        {/* Footer: sessions + assignee */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid var(--dash-border)" }}
        >
          <div className="flex items-center gap-1.5">
            {event.status === "upcoming" ? (
              <span
                className="text-[13px] font-medium"
                style={{ color: "var(--dash-text-muted)" }}
              >
                Not Started
              </span>
            ) : (
              <>
                <Zap size={14} style={{ color: "var(--dash-accent)" }} />
                <span
                  className="text-[13px] font-medium"
                  style={{ color: "var(--dash-text-muted)" }}
                >
                  {event.sessionsCount} Sessions
                </span>
              </>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {showRox && rox && (
              <RoxHalfGauge score={event.roxScore!} color={rox.color} />
            )}
            <div
              className="avatar-subtle flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold"
              title={event.assignee.name}
            >
              {event.assignee.initials}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    </Link>
  );
}

function RoxHalfGauge({ score, color }: { score: number; color: string }) {
  const r = 14;
  const cx = 18;
  const cy = 18;
  const circumference = Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center" style={{ width: 36, height: 24 }}>
      <svg width={36} height={20} viewBox="0 0 36 20" overflow="visible">
        {/* Background arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="var(--dash-surface-2)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill={color}
        >
          {score}
        </text>
      </svg>
    </div>
  );
}
