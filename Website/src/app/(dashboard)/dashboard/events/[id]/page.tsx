"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { ChevronLeft, CalendarCog, LayoutGrid, Info, Eye, Pencil, QrCode } from "lucide-react";
import EventDetailHeader from "@/components/dashboard/EventDetailHeader";
import SessionTable from "@/components/dashboard/SessionTable";
import SessionDetailDrawer from "@/components/dashboard/SessionDetailDrawer";
import DrawerPanel from "@/components/dashboard/DrawerPanel";
import { getEventDetail } from "@/components/dashboard/mockSessions";
import type { EventDetail, Session } from "@/components/dashboard/types";

const detailTabs = ["Sessions", "Intelligence", "Analytics"] as const;
type DetailTab = (typeof detailTabs)[number];

// Generate a random live session
function generateLiveSession(index: number): Session {
  const names = ["Alex Rivera", "Jordan Lee", "Morgan Park", "Casey Blake", "Taylor Kim", "Riley Cruz", "Avery Nash", "Quinn Fox"];
  const companies = ["Apex Systems", "Bright Wave", "Core Dynamics", "Delta Energy", "Evergreen Tech", "Frontier Labs"];
  const titles = ["Director", "VP Engineering", "Account Exec", "Project Manager", "Senior Engineer", "Sales Rep"];
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const name = pick(names);
  const company = pick(companies);

  return {
    id: `live-${Date.now()}-${index}`,
    temp: Math.random() < 0.1 ? "hot" : Math.random() < 0.2 ? "warm" : null,
    name,
    created: "Just now",
    email: `${name.split(" ")[0].toLowerCase()}@${company.toLowerCase().replace(/\s/g, "")}.com`,
    company,
    title: pick(titles),
    optIn: Math.random() < 0.3 ? true : null,
    followUp: Math.random() < 0.5,
    media: Math.random() < 0.3,
    notes: Math.random() < 0.2,
  };
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<DetailTab>("Sessions");
  const [eventData, setEventData] = useState<EventDetail | null>(null);
  const [drawer, setDrawer] = useState<
    { mode: "closed" } | { mode: "settings" } | { mode: "session"; session: Session | null } | { mode: "moments" }
  >({ mode: "closed" });

  useEffect(() => {
    const data = getEventDetail(id);
    setEventData(data);
  }, [id]);

  // Live event: add sessions every few seconds
  const addLiveSession = useCallback(() => {
    if (!eventData || eventData.status !== "live") return;

    const newSession = generateLiveSession(eventData.sessions.length);
    setEventData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sessions: [newSession, ...prev.sessions],
        totalLeads: prev.totalLeads + 1,
        hotLeads: prev.hotLeads + (newSession.temp === "hot" ? 1 : 0),
        companies: prev.companies + (Math.random() < 0.3 ? 1 : 0),
        sessionsCount: prev.sessionsCount + 1,
      };
    });
  }, [eventData]);

  useEffect(() => {
    if (!eventData || eventData.status !== "live") return;

    const interval = setInterval(() => {
      addLiveSession();
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [eventData?.status, addLiveSession]);

  if (!eventData) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>Event not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/dashboard/events"
          className="flex items-center gap-1 text-sm font-medium transition-colors duration-150"
          style={{ color: "var(--dash-text-muted)" }}
        >
          <ChevronLeft size={16} />
          Events
        </Link>
        <span className="text-sm" style={{ color: "var(--dash-text-muted)" }}>/</span>
        <span className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>
          {eventData.name}
        </span>
      </div>

      {/* Event header with stats */}
      <EventDetailHeader
        event={eventData}
        onSettingsClick={() => setDrawer({ mode: "settings" })}
        onMomentsClick={() => setDrawer({ mode: "moments" })}
        onNameChange={(name) => setEventData((prev) => prev ? { ...prev, name } : prev)}
      />

      {eventData.status === "upcoming" ? (
        /* Getting Setup for upcoming events */
        <div>
          <h2
            className="mb-4 text-lg font-medium"
            style={{ color: "var(--dash-text)" }}
          >
            Getting Setup
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div
              className="flex flex-col items-center rounded-xl px-6 py-10 text-center transition-shadow duration-200 hover:shadow-dash-2"
              style={{
                background: "var(--dash-surface)",
                border: "1px solid var(--dash-border)",
              }}
            >
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ background: "var(--dash-surface-2)" }}
              >
                <CalendarCog size={28} style={{ color: "var(--dash-accent)" }} />
              </div>
              <h3
                className="mb-1.5 text-base font-medium"
                style={{ color: "var(--dash-text)" }}
              >
                Event Setup
              </h3>
              <p
                className="mb-5 text-xs leading-relaxed"
                style={{ color: "var(--dash-text-muted)", maxWidth: 280 }}
              >
                Add members and review your registration settings.
              </p>
              <button
                className="rounded-lg px-4 py-2 text-xs font-medium transition-colors duration-150"
                style={{
                  color: "var(--dash-text)",
                  background: "var(--dash-surface)",
                  border: "1px solid var(--dash-border)",
                }}
              >
                Manage Event Settings
              </button>
            </div>

            <div
              className="flex flex-col items-center rounded-xl px-6 py-10 text-center transition-shadow duration-200 hover:shadow-dash-2"
              style={{
                background: "var(--dash-surface)",
                border: "1px solid var(--dash-border)",
              }}
            >
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ background: "var(--dash-surface-2)" }}
              >
                <LayoutGrid size={28} style={{ color: "var(--dash-accent)" }} />
              </div>
              <h3
                className="mb-1.5 text-base font-medium"
                style={{ color: "var(--dash-text)" }}
              >
                Moments Setup
              </h3>
              <p
                className="mb-5 text-xs leading-relaxed"
                style={{ color: "var(--dash-text-muted)", maxWidth: 280 }}
              >
                Manage your activities and registration to be used by the devices at the event.
              </p>
              <button
                className="rounded-lg px-4 py-2 text-xs font-medium transition-colors duration-150"
                style={{
                  color: "var(--dash-text)",
                  background: "var(--dash-surface)",
                  border: "1px solid var(--dash-border)",
                }}
              >
                Manage Moments
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Detail tabs */}
          <div
            className="mb-6 flex gap-6 border-b"
            style={{ borderColor: "var(--dash-border)" }}
          >
            {detailTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative pb-3 text-sm font-medium transition-colors duration-150"
                style={{
                  color: activeTab === tab ? "var(--dash-text)" : "var(--dash-text-muted)",
                }}
              >
                {tab}
                {activeTab === tab && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "var(--dash-accent)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "Sessions" && (
            <SessionTable
              sessions={eventData.sessions}
              isLive={eventData.status === "live"}
              onSessionClick={(session) => setDrawer({ mode: "session", session })}
              onAddSession={() => setDrawer({ mode: "session", session: null })}
            />
          )}
          {activeTab === "Intelligence" && (
            <Placeholder label="Intelligence" />
          )}
          {activeTab === "Analytics" && (
            <Placeholder label="Analytics" />
          )}
        </>
      )}

      {/* Settings Drawer */}
      <DrawerPanel
        open={drawer.mode === "settings"}
        onClose={() => setDrawer({ mode: "closed" })}
        title="Event Settings"
      >
        <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
          Event settings coming soon.
        </p>
      </DrawerPanel>

      {/* Moments Drawer */}
      <DrawerPanel
        open={drawer.mode === "moments"}
        onClose={() => setDrawer({ mode: "closed" })}
        title="Moments"
        icon={
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--dash-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="3" />
            <path d="M8 16V8l4 4 4-4v8" />
          </svg>
        }
        footer={
          <button
            onClick={() => setDrawer({ mode: "closed" })}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ background: "var(--dash-accent)" }}
          >
            Done
          </button>
        }
      >
        <MomentsDrawerContent />
      </DrawerPanel>

      {/* Session Detail Drawer */}
      <SessionDetailDrawer
        session={drawer.mode === "session" ? drawer.session : null}
        open={drawer.mode === "session"}
        onClose={() => setDrawer({ mode: "closed" })}
        onSave={(updated) => {
          setEventData((prev) => {
            if (!prev) return prev;
            const isNew = !prev.sessions.some((s) => s.id === updated.id);
            const sessions = isNew
              ? [updated, ...prev.sessions]
              : prev.sessions.map((s) => (s.id === updated.id ? updated : s));
            return {
              ...prev,
              sessions,
              totalLeads: isNew ? prev.totalLeads + 1 : prev.totalLeads,
              hotLeads: sessions.filter((s) => s.temp === "hot").length,
              companies: isNew ? prev.companies + (Math.random() < 0.3 ? 1 : 0) : prev.companies,
              sessionsCount: isNew ? prev.sessionsCount + 1 : prev.sessionsCount,
            };
          });
          setDrawer({ mode: "closed" });
        }}
      />
    </div>
  );
}

function MomentsDrawerContent() {
  const moments = [
    {
      name: "Lead Generation - Data Centers",
      type: "Explorer",
      icon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--dash-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M17 7h4v4" />
        </svg>
      ),
      hasPreview: true,
    },
    {
      name: "Self Registration",
      type: "Self Registration \u2022 Public QR Code",
      icon: <QrCode size={24} style={{ color: "var(--dash-accent)" }} />,
      hasPreview: false,
    },
  ];

  const addOptions = [
    {
      label: "Explorer",
      icon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--dash-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M17 7h4v4" />
        </svg>
      ),
    },
    {
      label: "Self Registration",
      icon: <QrCode size={24} style={{ color: "var(--dash-accent)" }} />,
    },
    {
      label: "Activity",
      icon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--dash-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <p className="mb-4 text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
        2 Moments
      </p>

      {/* Existing moments */}
      <div className="mb-6 flex flex-col gap-3">
        {moments.map((m) => (
          <div
            key={m.name}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}
          >
            <div className="flex-shrink-0">{m.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--dash-text)" }}>{m.name}</p>
              <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>{m.type}</p>
            </div>
            <div className="flex items-center gap-2">
              {m.hasPreview && (
                <button className="rounded-lg p-1.5 transition-colors hover:opacity-70" style={{ color: "var(--dash-accent)" }} title="Preview">
                  <Eye size={16} />
                </button>
              )}
              <button className="rounded-lg p-1.5 transition-colors hover:opacity-70" style={{ color: "var(--dash-text-muted)" }} title="Edit">
                <Pencil size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New */}
      <p className="mb-3 text-sm font-semibold" style={{ color: "var(--dash-text-muted)" }}>
        Add New
      </p>
      <div
        className="grid grid-cols-3 overflow-hidden rounded-xl"
        style={{ border: "1px solid var(--dash-border)" }}
      >
        {addOptions.map((opt, i) => (
          <button
            key={opt.label}
            className="flex flex-col items-center gap-2 px-4 py-5 transition-colors hover:opacity-70"
            style={{
              background: "var(--dash-surface-2)",
              borderRight: i < addOptions.length - 1 ? "1px solid var(--dash-border)" : "none",
            }}
          >
            {opt.icon}
            <span className="text-xs font-medium" style={{ color: "var(--dash-text)" }}>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl py-20"
      style={{
        background: "var(--dash-surface)",
        border: "1px solid var(--dash-border)",
      }}
    >
      <h4 className="mb-1 text-base font-medium" style={{ color: "var(--dash-text)" }}>
        {label}
      </h4>
      <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>Coming soon</p>
    </div>
  );
}
