export interface SessionRecord {
  id: string;
  startedAt: string;
  durationMs: number | null;
  referrer: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
}

export interface SourceCount {
  name: string;
  count: number;
}

export interface AnalyticsSummary {
  totalSessions: number;
  avgDurationMs: number;
  sources: SourceCount[];
  locations: SourceCount[];
  recentSessions: SessionRecord[];
}

export function classifySource(session: SessionRecord): string {
  if (session.utmSource) return session.utmSource;
  if (!session.referrer || session.referrer === "Direct") return "Direct";
  try {
    return new URL(session.referrer).hostname.replace(/^www\./, "");
  } catch {
    return session.referrer;
  }
}

export function formatDuration(ms: number | null): string {
  if (ms == null) return "--";
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
