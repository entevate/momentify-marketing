"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronUp, ChevronDown, Filter, Download, Paperclip, StickyNote, Flame, Snowflake, Reply, Plus, Plug, Globe, Link2, FileDown, FileSpreadsheet, FileText, Sparkles, User } from "lucide-react";
import type { Session } from "./types";

type SortKey = "temp" | "name" | "created" | "email" | "company" | "title";
type SortDir = "asc" | "desc";

interface SessionTableProps {
  sessions: Session[];
  isLive?: boolean;
  onSessionClick?: (session: Session) => void;
  onAddSession?: () => void;
}

export default function SessionTable({ sessions, isLive, onSessionClick, onAddSession }: SessionTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterOptIn, setFilterOptIn] = useState<boolean | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showEnhance, setShowEnhance] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const integrationRef = useRef<HTMLDivElement>(null);
  const enhanceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilter(false);
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) setShowDownload(false);
      if (integrationRef.current && !integrationRef.current.contains(e.target as Node)) setShowIntegrations(false);
      if (enhanceRef.current && !enhanceRef.current.contains(e.target as Node)) setShowEnhance(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let result = sessions;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.company.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q)
      );
    }

    if (filterOptIn !== null) {
      result = result.filter((s) => s.optIn === filterOptIn);
    }

    const tempOrder: Record<string, number> = { hot: 3, warm: 2, cold: 1 };
    const sorted = [...result];
    sorted.sort((a, b) => {
      let cmp: number;
      if (sortKey === "temp") {
        cmp = (tempOrder[a.temp || ""] || 0) - (tempOrder[b.temp || ""] || 0);
      } else {
        const aVal = a[sortKey] || "";
        const bVal = b[sortKey] || "";
        cmp = String(aVal).localeCompare(String(bVal));
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [sessions, search, sortKey, sortDir, filterOptIn]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="opacity-0 group-hover:opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp size={12} style={{ color: "var(--dash-accent)" }} />
    ) : (
      <ChevronDown size={12} style={{ color: "var(--dash-accent)" }} />
    );
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative" style={{ minWidth: 200, maxWidth: 320, flex: 1 }}>
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--dash-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg py-2 pl-9 pr-3 text-sm outline-none transition-colors duration-150"
            style={{
              background: "var(--dash-surface)",
              border: "1px solid var(--dash-border)",
              color: "var(--dash-text)",
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Add Session */}
          {onAddSession && (
            <button
              onClick={onAddSession}
              className="rounded-lg p-2 transition-colors duration-150"
              style={{
                color: "var(--dash-text-muted)",
                background: "var(--dash-surface)",
                border: "1px solid var(--dash-border)",
              }}
              title="Add Session"
            >
              <Plus size={16} />
            </button>
          )}

          {/* Filter */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="rounded-lg p-2 transition-colors duration-150"
              style={{
                color: filterOptIn !== null ? "var(--dash-accent)" : "var(--dash-text-muted)",
                background: "var(--dash-surface)",
                border: "1px solid var(--dash-border)",
              }}
              title="Filter"
            >
              <Filter size={16} />
            </button>
            {showFilter && (
              <div
                className="absolute right-0 top-full z-20 mt-1 min-w-[160px] rounded-lg p-2 shadow-dash-3"
                style={{
                  background: "var(--dash-surface)",
                  border: "1px solid var(--dash-border)",
                }}
              >
                <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>
                  Opt In
                </p>
                {[
                  { label: "All", value: null },
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => {
                      setFilterOptIn(opt.value as boolean | null);
                      setShowFilter(false);
                    }}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-100"
                    style={{
                      color: filterOptIn === opt.value ? "var(--dash-accent)" : "var(--dash-text)",
                      background: filterOptIn === opt.value ? "var(--dash-surface-2)" : "transparent",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Download */}
          <div className="relative" ref={downloadRef}>
            <button
              onClick={() => setShowDownload(!showDownload)}
              className="rounded-lg p-2 transition-colors duration-150"
              style={{
                color: "var(--dash-text-muted)",
                background: "var(--dash-surface)",
                border: "1px solid var(--dash-border)",
              }}
              title="Download"
            >
              <Download size={16} />
            </button>
            {showDownload && (
              <div
                className="absolute right-0 top-full z-20 mt-1 min-w-[190px] rounded-lg p-2 shadow-dash-3"
                style={{
                  background: "var(--dash-surface)",
                  border: "1px solid var(--dash-border)",
                }}
              >
                <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>
                  Export As
                </p>
                {[
                  { label: "Download to .csv", icon: FileDown },
                  { label: "Download to .xlsx", icon: FileSpreadsheet },
                  { label: "Download to PDF", icon: FileText },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setShowDownload(false)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-100 hover:bg-[var(--dash-surface-2)]"
                    style={{ color: "var(--dash-text)" }}
                  >
                    <opt.icon size={14} style={{ color: "var(--dash-text-muted)" }} />
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Integrations */}
          <div className="relative" ref={integrationRef}>
            <button
              onClick={() => setShowIntegrations(!showIntegrations)}
              className="rounded-lg p-2 transition-colors duration-150"
              style={{
                color: "var(--dash-text-muted)",
                background: "var(--dash-surface)",
                border: "1px solid var(--dash-border)",
              }}
              title="Integrations"
            >
              <Plug size={16} />
            </button>
            {showIntegrations && (
              <div
                className="absolute right-0 top-full z-20 mt-1 min-w-[210px] rounded-lg p-2 shadow-dash-3"
                style={{
                  background: "var(--dash-surface)",
                  border: "1px solid var(--dash-border)",
                }}
              >
                <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>
                  Integrations
                </p>
                {[
                  { label: "Salesforce", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M10 3.2a4.4 4.4 0 0 1 3.6 1.9 3.8 3.8 0 0 1 5.5 3.4 3.6 3.6 0 0 1 2 6.4 4 4 0 0 1-5.2 3.6 4.2 4.2 0 0 1-7.2.2A4.1 4.1 0 0 1 3 15a3.9 3.9 0 0 1 1.4-7.5A4.4 4.4 0 0 1 10 3.2z" fill="#00A1E0"/></svg> },
                  { label: "HubSpot", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.5" stroke="#FF7A59" strokeWidth="2"/><circle cx="12" cy="4" r="1.5" fill="#FF7A59"/><circle cx="12" cy="20" r="1.5" fill="#FF7A59"/><circle cx="4.5" cy="8" r="1.5" fill="#FF7A59"/><circle cx="19.5" cy="8" r="1.5" fill="#FF7A59"/><circle cx="4.5" cy="16" r="1.5" fill="#FF7A59"/><circle cx="19.5" cy="16" r="1.5" fill="#FF7A59"/><path d="M12 5.5v3M12 15.5v3M5.8 9l2.6 1.5M15.6 13.5l2.6 1.5M5.8 15l2.6-1.5M15.6 10.5l2.6-1.5" stroke="#FF7A59" strokeWidth="1.2"/></svg> },
                  { label: "Other", icon: <Plug size={14} style={{ color: "var(--dash-text-muted)" }} /> },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setShowIntegrations(false)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-100 hover:bg-[var(--dash-surface-2)]"
                    style={{ color: "var(--dash-text)" }}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhancement */}
          <div className="relative" ref={enhanceRef}>
            <button
              onClick={() => setShowEnhance(!showEnhance)}
              className="rounded-lg p-2 transition-colors duration-150"
              style={{
                color: "var(--dash-text-muted)",
                background: "var(--dash-surface)",
                border: "1px solid var(--dash-border)",
              }}
              title="Enhancement"
            >
              <Sparkles size={16} />
            </button>
            {showEnhance && (
              <div
                className="absolute right-0 top-full z-20 mt-1 min-w-[210px] rounded-lg p-2 shadow-dash-3"
                style={{
                  background: "var(--dash-surface)",
                  border: "1px solid var(--dash-border)",
                }}
              >
                <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>
                  Enhancements
                </p>
                {[
                  { label: "Popl", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#FF6B35" strokeWidth="2.5"/><path d="M9 7h3.5a3.5 3.5 0 0 1 0 7H9V7z" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                  { label: "Mobly", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="3" stroke="#4F46E5" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="#4F46E5" strokeWidth="1.5"/><path d="M7 18c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                  { label: "Other", icon: <Link2 size={14} style={{ color: "var(--dash-text-muted)" }} /> },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setShowEnhance(false)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-100 hover:bg-[var(--dash-surface-2)]"
                    style={{ color: "var(--dash-text)" }}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Session count */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>
          Total Sessions: {sessions.length.toLocaleString()}
        </span>
        {isLive && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-500">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto overflow-y-visible rounded-lg"
        style={{
          background: "var(--dash-surface)",
          border: "1px solid var(--dash-border)",
        }}
      >
        <table className="w-full min-w-[1050px] text-xs">
          <thead>
            <tr
              style={{ borderBottom: "1px solid var(--dash-border)" }}
            >
              <th className="w-10 whitespace-nowrap px-3 py-3.5 text-left">
                <button
                  onClick={() => handleSort("temp")}
                  className="group flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--dash-text-muted)", opacity: 0.7 }}
                >
                  Temp
                  <SortIcon col={"temp"} />
                </button>
              </th>
              {(["name", "created", "email", "company", "title"] as SortKey[]).map((col) => (
                <th key={col} className="whitespace-nowrap px-3 py-3.5 text-left">
                  <button
                    onClick={() => handleSort(col)}
                    className="group flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider"
                    style={{ color: "var(--dash-text-muted)", opacity: 0.7 }}
                  >
                    {col === "created" ? "Created" : col.charAt(0).toUpperCase() + col.slice(1)}
                    <SortIcon col={col} />
                  </button>
                </th>
              ))}
              <th className="whitespace-nowrap px-4 py-3.5 text-center">
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--dash-text-muted)", opacity: 0.7 }}>Opt In</span>
              </th>
              <th className="whitespace-nowrap px-4 py-3.5 text-center">
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--dash-text-muted)", opacity: 0.7 }}>Follow Up</span>
              </th>
              <th className="whitespace-nowrap px-4 py-3.5 text-center">
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--dash-text-muted)", opacity: 0.7 }}>Media</span>
              </th>
              <th className="whitespace-nowrap px-4 py-3.5 text-center">
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--dash-text-muted)", opacity: 0.7 }}>Notes</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((session) => (
              <tr
                key={session.id}
                onClick={() => onSessionClick?.(session)}
                className="cursor-pointer transition-colors duration-100 hover:bg-[var(--dash-surface-2)]"
                style={{ borderBottom: "1px solid color-mix(in srgb, var(--dash-border) 50%, transparent)" }}
              >
                {/* Temp */}
                <td className="px-3 py-3 text-center">
                  {session.temp === "hot" && (
                    <span title="Hot"><Flame size={14} style={{ color: "#EF4444", margin: "0 auto" }} /></span>
                  )}
                  {session.temp === "warm" && (
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#F2B33D" }} title="Warm" />
                  )}
                  {session.temp === "cold" && (
                    <span title="Cold"><Snowflake size={14} style={{ color: "#3B82F6", margin: "0 auto" }} /></span>
                  )}
                </td>
                {/* Name */}
                <td className="whitespace-nowrap px-3 py-3 font-medium" style={{ color: "var(--dash-text)" }}>
                  {session.name}
                </td>
                {/* Created */}
                <td className="whitespace-nowrap px-3 py-3" style={{ color: "var(--dash-text-muted)" }}>
                  {session.created}
                </td>
                {/* Email */}
                <td className="max-w-[180px] truncate px-3 py-3" style={{ color: "var(--dash-text-muted)" }}>
                  {session.email}
                </td>
                {/* Company */}
                <td className="max-w-[160px] truncate px-3 py-3" style={{ color: "var(--dash-text-muted)" }}>
                  {session.company}
                </td>
                {/* Title */}
                <td className="max-w-[160px] truncate px-3 py-3" style={{ color: "var(--dash-text-muted)" }}>
                  {session.title}
                </td>
                {/* Opt In */}
                <td className="px-3 py-3 text-center" style={{ color: "var(--dash-text-muted)" }}>
                  {session.optIn === true ? "Yes" : session.optIn === false ? "No" : ""}
                </td>
                {/* Follow Up */}
                <td className="px-3 py-3 text-center">
                  {session.followUp && <Reply size={12} style={{ color: "var(--dash-text-muted)", margin: "0 auto" }} />}
                </td>
                {/* Media */}
                <td className="px-3 py-3 text-center">
                  {session.media && (
                    <div className="group/media relative inline-flex items-center justify-center">
                      <Paperclip size={12} style={{ color: "var(--dash-text-muted)" }} />
                      <div className="pointer-events-none absolute top-full left-1/2 z-30 mt-2 hidden -translate-x-1/2 group-hover/media:block">
                        <div
                          className="overflow-hidden rounded-lg shadow-dash-3"
                          style={{ border: "1px solid var(--dash-border)", width: 200 }}
                        >
                          <div
                            className="flex h-[120px] items-center justify-center text-[10px]"
                            style={{ background: "linear-gradient(135deg, #f0f4f8, #e2e8f0)", color: "#94a3b8" }}
                          >
                            <div className="text-center">
                              <Paperclip size={24} className="mx-auto mb-1" />
                              <span>Business Card</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
                {/* Notes */}
                <td className="px-3 py-3 text-center">
                  {session.notes && <StickyNote size={12} style={{ color: "var(--dash-text-muted)", margin: "0 auto" }} />}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-xs" style={{ color: "var(--dash-text-muted)" }}>
                  No sessions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
