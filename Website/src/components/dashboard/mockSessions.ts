import type { Session, EventDetail } from "./types";
import { mockEvents } from "./mockData";

const firstNames = [
  "Alex", "Jordan", "Morgan", "Casey", "Taylor", "Riley", "Avery", "Quinn",
  "Cameron", "Parker", "Drew", "Skyler", "Reese", "Dakota", "Hayden", "Blake",
  "Jamie", "Jesse", "Robin", "Sage", "Emery", "Finley", "Rowan", "Kendall",
  "Spencer", "Alexis", "Devon", "Harper", "Logan", "Peyton", "Bailey", "Ellis",
  "Remy", "Nico", "Kai", "Shea", "Milan", "Phoenix", "River", "Lane",
];

const lastNames = [
  "Anderson", "Bennett", "Carter", "Davis", "Evans", "Foster", "Grant", "Hayes",
  "Irving", "Jensen", "Klein", "Lawson", "Mitchell", "Nguyen", "Ortiz", "Palmer",
  "Quinn", "Rhodes", "Sullivan", "Torres", "Upton", "Vance", "Walsh", "Xu",
  "Young", "Zhang", "Brooks", "Chen", "Dunn", "Fischer", "Garcia", "Hoffman",
  "Jackson", "Kim", "Lewis", "Martin", "Nelson", "Olsen", "Patel", "Reyes",
];

const companies = [
  "Apex Systems", "Bright Wave", "Core Dynamics", "Delta Energy", "Evergreen Tech",
  "Frontier Labs", "Global Solutions", "Horizon Group", "Insight Corp", "Junction Analytics",
  "Keystone Power", "Lumina Digital", "Meridian Works", "Nova Industries", "Orbit Networks",
  "Pinnacle Services", "Quantum Grid", "Ridge Engineering", "Summit Electric", "Titan Utilities",
  "Unity Power", "Vista Solutions", "Weston Group", "Zenith Systems", "Atlas Engineering",
];

const titles = [
  "Project Manager", "Director of Operations", "VP of Engineering", "Account Executive",
  "Business Development", "Marketing Coordinator", "Senior Engineer", "Regional Manager",
  "Technical Lead", "Sales Representative", "Operations Analyst", "Product Manager",
  "Chief Technology Officer", "Portfolio Manager", "Field Technician", "Strategy Consultant",
  "Solutions Architect", "Program Director", "Customer Success", "Innovation Lead",
];

const domains = [
  "apexsys.com", "brightwave.io", "coredyn.com", "deltaenergy.net", "evergreentech.co",
  "frontierlabs.com", "globalsol.net", "horizongrp.com", "insightcorp.io", "junctionanal.com",
  "keystonepower.com", "luminadigital.io", "meridianworks.net", "novaind.com", "orbitnet.io",
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateSessions(eventId: string, count: number): Session[] {
  const rand = seededRandom(parseInt(eventId) * 1337 + 42);
  const sessions: Session[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(rand() * firstNames.length)];
    const lastName = lastNames[Math.floor(rand() * lastNames.length)];
    const company = companies[Math.floor(rand() * companies.length)];
    const domain = domains[Math.floor(rand() * domains.length)];
    const title = titles[Math.floor(rand() * titles.length)];

    const tempRoll = rand();
    const temp = tempRoll < 0.06 ? ("hot" as const) : tempRoll < 0.18 ? ("warm" as const) : tempRoll < 0.35 ? ("cold" as const) : null;

    sessions.push({
      id: `${eventId}-s${i + 1}`,
      temp,
      name: `${firstName} ${lastName}`,
      created: generateDate(rand),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      company,
      title,
      optIn: rand() < 0.3 ? true : rand() < 0.5 ? false : null,
      followUp: rand() < 0.7,
      media: rand() < 0.4,
      notes: rand() < 0.35,
    });
  }

  return sessions;
}

function generateDate(rand: () => number): string {
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return `${month[Math.floor(rand() * month.length)]} ${Math.floor(rand() * 28) + 1}`;
}

function getRoxZone(score: number): { label: string; color: string; desc: string } {
  if (score >= 76) return { label: "Elite", color: "#0CF4DF", desc: "Exceptional ROI on experience. Top-tier engagement and conversion." };
  if (score >= 51) return { label: "High ROX", color: "#5FD9C2", desc: "Strong return on experience. Solid lead quality and engagement." };
  if (score >= 26) return { label: "Optimize", color: "#F2B33D", desc: "Room for improvement. Review session quality and follow-ups." };
  return { label: "Critical", color: "#E5484D", desc: "Needs immediate attention. Low engagement and conversion rates." };
}

export { getRoxZone };

const eventExtras: Record<string, Partial<EventDetail>> = {
  "1": { manager: { name: "Jake Hamann", initials: "JH" }, members: [{ name: "Sarah Chen", initials: "SC" }], service: "Converge", serviceActive: true, eventLink: "globaltechsummit.com", roxScore: 0, totalLeads: 0, hotLeads: 0, companies: 0, avgSessionDuration: 0 },
  "2": { manager: { name: "Sarah Chen", initials: "SC" }, members: [{ name: "Jake Hamann", initials: "JH" }], service: "Converge", serviceActive: true, eventLink: "industryconnect.com", roxScore: 0, totalLeads: 0, hotLeads: 0, companies: 0, avgSessionDuration: 0 },
  "3": { manager: { name: "Mike Torres", initials: "MT" }, members: [{ name: "Anna Kim", initials: "AK" }], service: "Converge", serviceActive: true, eventLink: "builderexpo.com", roxScore: 0, totalLeads: 0, hotLeads: 0, companies: 0, avgSessionDuration: 0 },
  "4": { manager: { name: "Jake Hamann", initials: "JH" }, members: [{ name: "Sarah Chen", initials: "SC" }, { name: "Mike Torres", initials: "MT" }], service: "Converge", serviceActive: true, eventLink: "talentlive.com", roxScore: 78, totalLeads: 412, hotLeads: 15, companies: 380, avgSessionDuration: 72 },
  "5": { manager: { name: "Anna Kim", initials: "AK" }, members: [{ name: "Mike Torres", initials: "MT" }], service: "Converge", serviceActive: false, eventLink: "mfgsummit.com", roxScore: 34, totalLeads: 340, hotLeads: 5, companies: 260, avgSessionDuration: 58 },
  "6": { manager: { name: "Sarah Chen", initials: "SC" }, members: [{ name: "Jake Hamann", initials: "JH" }, { name: "Anna Kim", initials: "AK" }], service: "Converge", serviceActive: false, eventLink: "campuscareers.com", roxScore: 82, totalLeads: 1245, hotLeads: 28, companies: 890, avgSessionDuration: 94 },
  "7": { manager: { name: "Mike Torres", initials: "MT" }, members: [{ name: "Sarah Chen", initials: "SC" }], service: "Converge", serviceActive: false, eventLink: "fieldsales.com", roxScore: 67, totalLeads: 520, hotLeads: 12, companies: 410, avgSessionDuration: 68 },
  "8": { manager: { name: "Jake Hamann", initials: "JH" }, members: [{ name: "Anna Kim", initials: "AK" }], service: "Converge", serviceActive: false, eventLink: "expmarketing.com", roxScore: 45, totalLeads: 615, hotLeads: 10, companies: 480, avgSessionDuration: 82 },
  "9": { manager: { name: "Anna Kim", initials: "AK" }, members: [{ name: "Jake Hamann", initials: "JH" }], service: "Converge", serviceActive: false, eventLink: "fmexpo.com", roxScore: 71, totalLeads: 820, hotLeads: 18, companies: 650, avgSessionDuration: 88 },
  "10": { manager: { name: "Sarah Chen", initials: "SC" }, members: [{ name: "Mike Torres", initials: "MT" }], service: "Converge", serviceActive: false, eventLink: "innovationshow.com", roxScore: 22, totalLeads: 210, hotLeads: 3, companies: 170, avgSessionDuration: 45 },
  "11": { manager: { name: "Mike Torres", initials: "MT" }, members: [{ name: "Anna Kim", initials: "AK" }], service: "Converge", serviceActive: false, eventLink: "energyconf.com", roxScore: 58, totalLeads: 380, hotLeads: 8, companies: 290, avgSessionDuration: 76 },
  "12": { manager: { name: "Jake Hamann", initials: "JH" }, members: [{ name: "Sarah Chen", initials: "SC" }], service: "Converge", serviceActive: false, eventLink: "communityengage.com", roxScore: 41, totalLeads: 185, hotLeads: 2, companies: 140, avgSessionDuration: 52 },
};

export function getEventDetail(id: string): EventDetail | null {
  const event = mockEvents.find((e) => e.id === id);
  if (!event) return null;

  const sessions = generateSessions(id, event.sessionsCount);
  const extras = eventExtras[id] || {
    manager: event.assignee,
    members: [],
    service: "Converge",
    serviceActive: false,
    eventLink: "",
    roxScore: 50,
    totalLeads: 0,
    hotLeads: 0,
    companies: 0,
    avgSessionDuration: 0,
  };

  // For events with sessions but no leads, derive from session count
  const totalLeads = extras.totalLeads || event.sessionsCount;
  const hotLeads = extras.hotLeads || sessions.filter((s) => s.temp === "hot").length;
  const companiesCount = extras.companies || new Set(sessions.map((s) => s.company)).size;
  const avgDuration = extras.avgSessionDuration || (event.sessionsCount > 0 ? 60 + Math.floor(seededRandom(parseInt(id) * 99)() * 60) : 0);

  return {
    ...event,
    ...extras,
    manager: extras.manager || event.assignee,
    members: extras.members || [],
    totalLeads,
    hotLeads,
    companies: companiesCount,
    avgSessionDuration: avgDuration,
    sessions,
  } as EventDetail;
}
