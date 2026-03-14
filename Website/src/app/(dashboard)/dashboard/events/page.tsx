"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ArrowUpDown } from "lucide-react";
import TabBar from "@/components/dashboard/TabBar";
import ViewToggle from "@/components/dashboard/ViewToggle";
import EventGrid from "@/components/dashboard/EventGrid";
import { mockEvents } from "@/components/dashboard/mockData";
import type { EventTab, ViewMode } from "@/components/dashboard/types";

type SortOption = "date-desc" | "date-asc" | "name-asc" | "name-desc" | "sessions" | "rox-desc";

const validTabs: EventTab[] = ["all", "live", "upcoming", "past"];

export default function EventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") as EventTab | null;
  const activeTab: EventTab = tabParam && validTabs.includes(tabParam) ? tabParam : "all";

  const setActiveTab = (tab: EventTab) => {
    router.replace(`/dashboard/events?tab=${tab}`, { scroll: false });
  };

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const filteredEvents = useMemo(() => {
    let events =
      activeTab === "all"
        ? mockEvents
        : mockEvents.filter((e) => e.status === activeTab);

    if (search.trim()) {
      const q = search.toLowerCase();
      events = events.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }

    const sorted = [...events];
    switch (sortBy) {
      case "date-desc":
        sorted.sort((a, b) => b.startDate.localeCompare(a.startDate));
        break;
      case "date-asc":
        sorted.sort((a, b) => a.startDate.localeCompare(b.startDate));
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "sessions":
        sorted.sort((a, b) => b.sessionsCount - a.sessionsCount);
        break;
      case "rox-desc":
        sorted.sort((a, b) => (b.roxScore ?? 0) - (a.roxScore ?? 0));
        break;
    }

    return sorted;
  }, [activeTab, search, sortBy]);

  const tabCounts = useMemo(() => {
    const counts = { live: 0, upcoming: 0, past: 0 };
    mockEvents.forEach((e) => counts[e.status]++);
    return counts;
  }, []);

  return (
    <div>
      {/* Page header */}
      <h1
        className="mb-6 text-2xl font-medium"
        style={{ color: "var(--dash-text)" }}
      >
        Events
      </h1>

      {/* Tabs row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <TabBar
          tabs={[
            { id: "all", label: "All", count: mockEvents.length },
            { id: "live", label: "Live", count: tabCounts.live },
            { id: "upcoming", label: "Upcoming", count: tabCounts.upcoming },
            { id: "past", label: "Past", count: tabCounts.past },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
      </div>

      {/* Search & Sort row */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div
          className="relative flex-1"
          style={{ minWidth: 200, maxWidth: 360 }}
        >
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--dash-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search events..."
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
        <div className="relative">
          <ArrowUpDown
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--dash-text-muted)" }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none rounded-lg py-2 pl-8 pr-8 text-sm outline-none transition-colors duration-150"
            style={{
              background: "var(--dash-surface)",
              border: "1px solid var(--dash-border)",
              color: "var(--dash-text)",
            }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="sessions">Most Sessions</option>
            <option value="rox-desc">Highest ROX</option>
          </select>
        </div>
      </div>

      {/* Event grid */}
      <EventGrid events={filteredEvents} viewMode={viewMode} />
    </div>
  );
}
