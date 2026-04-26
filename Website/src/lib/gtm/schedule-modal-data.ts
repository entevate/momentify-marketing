/**
 * Static data for GenerateScheduleModal - solution metadata + persona lists.
 *
 * Mirrors the Momentify GTM solution pillars:
 *   trade-shows, recruiting, field-sales, facilities, events-venues
 */

export const tradeShowsPersonas: string[] = [
  "Trade Show & Exhibit Managers",
  "Event Marketing Directors",
  "Sales & Revenue Leaders",
  "Operations & Logistics Teams",
]

export const recruitingPersonas: string[] = [
  "Talent Acquisition Leaders",
  "HR & People Operations Teams",
  "Hiring Managers",
  "Recruiting Coordinators",
]

export const fieldSalesPersonas: string[] = [
  "Field Sales Representatives",
  "Sales Directors & VPs",
  "Territory & Regional Managers",
  "Revenue Operations Teams",
]

export const facilitiesPersonas: string[] = [
  "Facilities & Workplace Managers",
  "Corporate Real Estate Leaders",
  "Operations & FM Teams",
  "EHS & Compliance Officers",
]

export const eventsVenuesPersonas: string[] = [
  "Event & Venue Planners",
  "Corporate Events Teams",
  "Hospitality & Catering Managers",
  "Sponsorship & Partnership Leaders",
]

export const pillarMeta: Record<string, { label: string; color: string }> = {
  "trade-shows":    { label: "Trade Shows & Exhibits",       color: "#247b96" },
  "recruiting":     { label: "Recruiting & Talent",          color: "#2bbfa8" },
  "field-sales":    { label: "Field Sales Enablement",       color: "#e8782a" },
  "facilities":     { label: "Facilities Management",        color: "#6a6b9e" },
  "events-venues":  { label: "Events & Venues",              color: "#d45b8c" },
}

export function pillarLabel(id: string): string {
  return pillarMeta[id]?.label ?? id
}
