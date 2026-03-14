"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Zap,
  Link as LinkIcon,
  Settings,
  Flame,
  QrCode,
  X,
  Copy,
  Download,
  Info,
  Pencil,
  Check,
} from "lucide-react";
import type { EventDetail } from "./types";
import { getRoxZone } from "./mockSessions";

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  if (s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString("en-US", { month: "short" })} ${s.getDate()}-${e.getDate()}, ${s.getFullYear()}`;
  }
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${s.toLocaleDateString("en-US", opts)} - ${e.toLocaleDateString("en-US", opts)}, ${s.getFullYear()}`;
}

interface EventDetailHeaderProps {
  event: EventDetail;
  onSettingsClick?: () => void;
  onMomentsClick?: () => void;
  onNameChange?: (name: string) => void;
}

export default function EventDetailHeader({ event, onSettingsClick, onMomentsClick, onNameChange }: EventDetailHeaderProps) {
  const rox = getRoxZone(event.roxScore);
  const isUpcoming = event.status === "upcoming";
  const [showQR, setShowQR] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(event.name);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  function saveName() {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== event.name) {
      onNameChange?.(trimmed);
    } else {
      setDraftName(event.name);
    }
    setEditingName(false);
  }

  return (
    <div
      className="mb-6 rounded-xl"
      style={{
        background: "var(--dash-surface)",
        border: "1px solid var(--dash-border)",
      }}
    >
      {/* Top section: cover + name + stats */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
        {/* Cover gradient thumbnail */}
        <div
          className="relative h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-40"
          style={{ background: event.coverGradient }}
        >
          {event.status === "live" && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Live
            </div>
          )}
          {event.status === "past" && (
            <div className="absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
              style={{ background: "var(--dash-surface-2)", color: "var(--dash-text-muted)" }}>
              Past
            </div>
          )}
        </div>

        {/* Event info */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            {editingName ? (
              <>
                <input
                  ref={nameInputRef}
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName();
                    if (e.key === "Escape") { setDraftName(event.name); setEditingName(false); }
                  }}
                  className="rounded-md border px-2 py-1 text-xl font-medium outline-none"
                  style={{ color: "var(--dash-text)", background: "var(--dash-surface-2)", borderColor: "var(--dash-border)" }}
                />
                <button
                  onClick={saveName}
                  className="rounded p-1 transition-colors hover:opacity-70"
                  style={{ color: "var(--dash-accent)" }}
                  title="Save"
                >
                  <Check size={16} />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-medium" style={{ color: "var(--dash-text)" }}>
                  {event.name}
                </h2>
                {isUpcoming && (
                  <button
                    onClick={() => { setDraftName(event.name); setEditingName(true); }}
                    className="rounded p-1 transition-colors hover:opacity-70"
                    style={{ color: "var(--dash-text-muted)" }}
                    title="Edit Event Name"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--dash-text-muted)" }}>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDateRange(event.startDate, event.endDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {event.location}
            </span>
          </div>
        </div>

        {/* Stats + settings */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-7">
          <StatBox icon={<Zap size={20} />} value={isUpcoming ? "\u2014" : event.totalLeads.toLocaleString()} label="Total Leads" color="var(--dash-accent)" />
          <StatBox icon={<Flame size={20} />} value={isUpcoming ? "\u2014" : String(event.hotLeads)} label="Hot Leads" color="#EF4444" />
          <StatBox value={isUpcoming ? "\u2014" : event.companies.toLocaleString()} label="Companies" />
          <StatBox value={isUpcoming ? "\u2014" : `${event.avgSessionDuration}s`} label="Avg. Duration" />

          {/* ROX gauge */}
          <div className="flex items-center gap-2">
            {!isUpcoming && <RoxHalfGauge score={event.roxScore} color={rox.color} />}
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold leading-tight" style={{ color: "var(--dash-text)" }}>
                {isUpcoming ? "\u2014" : event.roxScore}
              </span>
              <span className="text-xs font-medium" style={{ color: "var(--dash-text-muted)" }}>ROX</span>
            </div>
            {!isUpcoming && (
              <div className="group relative flex items-center">
                <span
                  className="cursor-default rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    background: `${rox.color}20`,
                    color: rox.color,
                  }}
                >
                  {rox.label}
                </span>
                <div
                  className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-48 -translate-x-1/2 rounded-lg p-2.5 text-[11px] leading-relaxed opacity-0 shadow-dash-3 transition-opacity duration-150 group-hover:opacity-100"
                  style={{ background: "var(--dash-surface)", border: "1px solid var(--dash-border)", color: "var(--dash-text-muted)" }}
                >
                  <span className="font-semibold" style={{ color: rox.color }}>{rox.label}</span>
                  {" \u2014 "}{rox.desc}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Details row: manager, members, service, link */}
      <div
        className="border-t px-5 py-4"
        style={{ borderColor: "var(--dash-border)" }}
      >
        <div className="flex flex-wrap items-center gap-6 text-sm">
          {/* Manager */}
          <div className="flex items-center gap-2">
            <div
              className="avatar-subtle flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold"
            >
              {event.manager.initials}
            </div>
            <div>
              <p className="text-[11px]" style={{ color: "var(--dash-text-muted)" }}>Event Manager</p>
              <p className="font-medium" style={{ color: "var(--dash-text)" }}>{event.manager.name}</p>
            </div>
          </div>

          {/* Members */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {event.members.map((m) => (
                <div
                  key={m.initials}
                  className="avatar-subtle flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ring-2 ring-[var(--dash-surface)]"
                >
                  {m.initials}
                </div>
              ))}
            </div>
            <div>
              <p className="text-[11px]" style={{ color: "var(--dash-text-muted)" }}>Members</p>
              <p className="font-medium" style={{ color: "var(--dash-text)" }}>{event.members.length}</p>
            </div>
          </div>

          {/* Service */}
          <div className="flex items-center gap-2">
            <Settings size={16} style={{ color: "var(--dash-text-muted)" }} />
            <div>
              <p className="text-[11px]" style={{ color: "var(--dash-text-muted)" }}>Service</p>
              <p className="font-medium" style={{ color: "var(--dash-text)" }}>
                {event.service}
                <span
                  className="ml-1.5 text-[11px]"
                  style={{ color: event.serviceActive ? "#5FD9C2" : "var(--dash-text-muted)" }}
                >
                  {event.serviceActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          </div>

          {/* Event Link */}
          <div className="flex items-center gap-2">
            <LinkIcon size={16} style={{ color: "var(--dash-text-muted)" }} />
            <div>
              <p className="text-[11px]" style={{ color: "var(--dash-text-muted)" }}>Event Link</p>
              <p className="font-medium" style={{ color: "var(--dash-accent)" }}>{event.eventLink}</p>
            </div>
          </div>

          {/* Attendee Access */}
          <div className="flex items-center gap-2">
            <QrCode size={16} style={{ color: "var(--dash-text-muted)" }} />
            <div>
              <p className="text-[11px]" style={{ color: "var(--dash-text-muted)" }}>Attendee Access</p>
              <button
                onClick={() => setShowQR(true)}
                className="font-medium transition-colors hover:opacity-70"
                style={{ color: "var(--dash-accent)" }}
              >
                View Code
              </button>
            </div>
          </div>

          {/* Settings + Moments */}
          <div className="ml-auto flex items-center gap-1.5">
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="rounded-lg p-2 transition-colors duration-150 hover:opacity-70"
                style={{ color: "var(--dash-text-muted)", background: "var(--dash-surface-2)" }}
                title="Event Settings"
              >
                <Settings size={18} />
              </button>
            )}
            <button
              onClick={onMomentsClick}
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-150 hover:opacity-70"
              style={{ background: "var(--dash-surface-2)" }}
              title="Moments"
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--dash-text)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="3" />
                <path d="M8 16V8l4 4 4-4v8" />
              </svg>
              <span className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>Moments</span>
              <span
                className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold text-white"
                style={{ background: "var(--dash-accent)" }}
              >
                2
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowQR(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-6"
            style={{ background: "var(--dash-surface)", border: "1px solid var(--dash-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={20} style={{ color: "var(--dash-text)" }} />
                <h3 className="text-base font-medium" style={{ color: "var(--dash-text)" }}>Event QR Code</h3>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="rounded-lg p-1 transition-colors hover:opacity-70"
                style={{ color: "var(--dash-text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-center text-sm font-medium" style={{ color: "var(--dash-text)" }}>
              Self Registration
            </p>
            <div className="mb-6 flex justify-center">
              <div
                className="flex h-56 w-56 items-center justify-center rounded-lg"
                style={{ background: "var(--dash-surface-2)" }}
              >
                <QrCode size={160} strokeWidth={0.5} style={{ color: "var(--dash-text)" }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:opacity-70"
                  style={{ color: "var(--dash-text)", background: "var(--dash-surface-2)" }}
                >
                  <Copy size={14} />
                  Copy
                </button>
                <button
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:opacity-70"
                  style={{ color: "var(--dash-text)", background: "var(--dash-surface-2)" }}
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
              <button
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: "var(--dash-text)", background: "var(--dash-surface-2)" }}
              >
                <Settings size={14} />
                Manage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({
  icon,
  value,
  label,
  color,
}: {
  icon?: React.ReactNode;
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {icon && <span style={{ color: color || "var(--dash-text-muted)" }}>{icon}</span>}
      <div>
        <p className="text-2xl font-semibold leading-tight" style={{ color: "var(--dash-text)" }}>
          {value}
        </p>
        <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function RoxHalfGauge({ score, color }: { score: number; color: string }) {
  const r = 16;
  const cx = 20;
  const cy = 20;
  const circumference = Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - pct);

  return (
    <svg width={40} height={24} viewBox="0 0 40 24" overflow="visible">
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--dash-surface-2)"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

