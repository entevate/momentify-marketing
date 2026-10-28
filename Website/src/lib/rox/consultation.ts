/**
 * Sends a ROX calculator consultation request through the same pipeline as the
 * /demo form (POST /api/demo -> HubSpot Forms + Intercom).
 *
 * Only fields the /demo form already sends are used, so the HubSpot form
 * definition does not need new properties. Calculator results, phone and the
 * calculator's own count question ride in `message`, which maps to HubSpot
 * `message` and Intercom `demo_message`.
 */

export type RoxSolution =
  | "trade-shows"
  | "technical-recruiting"
  | "field-sales"
  | "facilities"
  | "venues-events";

export interface RoxConsultationRequest {
  /** Matches the /demo form's solution values. */
  solution: RoxSolution;
  /** Human name of the calculator, e.g. "Trade Show ROX". */
  calculatorName: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    jobTitle: string;
    phone: string;
  };
  /** The calculator's volume question and the visitor's answer. */
  volume: { question: string; answer: string };
  totalScore: number | null;
  tierName: string | null;
  categories: { name: string; score: number | null }[];
  /** Extra derived results, e.g. "Cost Per Lead" -> "$120". */
  extras?: Record<string, string | null>;
}

export function buildRoxMessage(req: RoxConsultationRequest): string {
  const lines = [`${req.calculatorName} calculator consultation request`];
  if (req.totalScore !== null) {
    lines.push(`ROX Score: ${Math.round(req.totalScore)} / 100${req.tierName ? ` (${req.tierName})` : ""}`);
  }
  for (const c of req.categories) {
    lines.push(`${c.name}: ${c.score !== null ? Math.round(c.score) : "--"}`);
  }
  for (const [label, value] of Object.entries(req.extras ?? {})) {
    if (value) lines.push(`${label}: ${value}`);
  }
  if (req.volume.answer) lines.push(`${req.volume.question} ${req.volume.answer}`);
  if (req.contact.phone.trim()) lines.push(`Phone: ${req.contact.phone.trim()}`);
  return lines.join("\n");
}

export async function submitRoxConsultation(req: RoxConsultationRequest): Promise<void> {
  const res = await fetch("/api/demo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: req.contact.firstName.trim(),
      lastName: req.contact.lastName.trim(),
      email: req.contact.email.trim(),
      company: req.contact.company.trim(),
      jobTitle: req.contact.jobTitle.trim(),
      solution: req.solution,
      companySize: "",
      // The calculators' volume ranges differ from the /demo events_per_year
      // options, so the answer goes in the message instead.
      eventsPerYear: "",
      referral: "",
      sourcePage: `rox-calculator-${req.solution}`,
      message: buildRoxMessage(req),
    }),
  });
  if (!res.ok) {
    throw new Error(`Consultation request failed (${res.status})`);
  }
}
