import type { LucideIcon } from "lucide-react";

export interface DashboardEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  coverGradient: string;
  sessionsCount: number;
  status: "live" | "upcoming" | "past";
  roxScore?: number;
  assignee: {
    name: string;
    initials: string;
  };
}

export interface DashboardUser {
  name: string;
  email: string;
  initials: string;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  children?: { label: string; href: string }[];
}

export type ViewMode = "grid" | "list" | "map";
export type EventTab = "all" | "live" | "upcoming" | "past";
export type RegistrationMode = "form" | "database" | "qr-code" | "none";

export type SessionTemp = "hot" | "warm" | "cold" | null;

export interface Session {
  id: string;
  temp: SessionTemp;
  name: string;
  created: string;
  email: string;
  company: string;
  title: string;
  optIn: boolean | null;
  followUp: boolean;
  media: boolean;
  notes: boolean;
}

export interface EventDetail extends DashboardEvent {
  manager: { name: string; initials: string };
  members: { name: string; initials: string }[];
  service: string;
  serviceActive: boolean;
  eventLink: string;
  totalLeads: number;
  hotLeads: number;
  companies: number;
  avgSessionDuration: number;
  roxScore: number;
  sessions: Session[];
}
