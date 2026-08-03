/**
 * Pricing display data. MIRROR of fan-gallery repo
 * src/lib/billing/pricing.ts. If you change prices here, change them there
 * and run `npm run billing:sync` in that repo too.
 */
export type Cadence = "monthly" | "annual";

export interface PricingTier {
  key: "basic" | "team" | "pro" | "enterprise";
  name: string;
  audience: "business";
  /** Dollars per month. null = custom pricing. */
  annual: number | null;
  monthly: number | null;
  onboarding: string | null;
  /** Short onboarding note appended to the monthly-cadence price sub-line. */
  onboardingShort?: string;
  tagline: string;
  bullets: string[];
  /** Render a disabled Coming Soon button instead of cta. Unset on every
   *  tier since self-serve checkout went live on 2026-08-03. Kept for a
   *  future tier that ships its pricing ahead of its checkout. */
  comingSoon?: boolean;
  cta: { label: string; href: (cadence: Cadence) => string };
  highlight?: boolean;
}

// Confirmed 2026-08-03 against the Clerk production instance, whose OAuth
// callback is https://clerk.mymomentify.com/v1/oauth_callback.
const APP_SIGNUP = "https://mymomentify.com/sign-up";

/** Enterprise price sub-line. Keep in sync with the Enterprise FAQ answer. */
export const ENTERPRISE_FLOOR = "starting at $6,500/mo";

export const PRICING_TIERS: PricingTier[] = [
  {
    key: "basic", name: "Basic", audience: "business",
    annual: 650, monthly: 750, onboarding: null,
    tagline: "For a single team running a handful of events a year.",
    bullets: ["3 seats", "4 events per year", "2,500 sessions per month", "Fan Gallery + Explorer templates", "Database registration", "Custom colors and branding", "Email follow-up"],
    cta: { label: "Start 14-day trial", href: (c) => `${APP_SIGNUP}?intent=basic-${c}` },
  },
  {
    key: "team", name: "Team", audience: "business",
    annual: 1750, monthly: 1995, onboarding: "$1,250 one-time on monthly billing, waived on annual",
    onboardingShort: "$1,250 onboarding",
    tagline: "For multi-team organizations with a full event calendar.",
    bullets: ["7 seats", "12 events per year", "10,000 sessions per month", "All four template kinds", "SMS bundle", "QR code registration", "Salesforce and HubSpot integrations", "Custom domain"],
    cta: { label: "Start 14-day trial", href: (c) => `${APP_SIGNUP}?intent=team-${c}` },
    highlight: true,
  },
  {
    key: "pro", name: "Pro", audience: "business",
    annual: 3250, monthly: 3750, onboarding: "$2,500 one-time",
    tagline: "For multi-facility organizations that run events year-round.",
    bullets: ["15 seats", "Unlimited events", "50,000 sessions per month", "AI Intelligence and advanced analytics", "API access", "Multi-workspace (5)", "Remove Momentify badge", "Branded SMS sender"],
    cta: { label: "Contact sales", href: () => "/demo" },
  },
  {
    key: "enterprise", name: "Enterprise", audience: "business",
    annual: null, monthly: null, onboarding: "$7,500 one-time",
    tagline: "For dealer networks, regulated industries, and global teams.",
    bullets: ["Unlimited seats, events, and sessions", "SSO/SAML", "Audit log retention", "Custom data residency", "Dedicated CSM and SLA", "White-glove onboarding"],
    cta: { label: "Contact sales", href: () => "/demo" },
  },
];

export interface ComparisonRow { label: string; values: [string, string, string, string] }
/** Column order: Basic, Team, Pro, Enterprise. */
export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Seats", values: ["3", "7", "15", "Unlimited"] },
  { label: "Events", values: ["4 / year", "12 / year", "Unlimited", "Unlimited"] },
  { label: "Facilities", values: ["1", "3", "10", "Unlimited"] },
  { label: "Custom templates", values: ["3", "10", "Unlimited", "Unlimited"] },
  { label: "Moments per event", values: ["5", "15", "Unlimited", "Unlimited"] },
  { label: "Sessions / month", values: ["2,500", "10,000", "50,000", "Unlimited"] },
  { label: "Storage", values: ["20 GB", "100 GB", "500 GB", "Unlimited"] },
  { label: "Template kinds", values: ["Fan Gallery, Explorer", "All four", "All four", "All four"] },
  { label: "Registration modes", values: ["+ Database", "+ QR codes", "All", "All"] },
  { label: "Branding", values: ["Custom colors + branding", "+ Custom domain", "+ Remove Momentify badge, branded SMS sender", "Full white-label"] },
];

export const PRICING_FAQ: Array<{ q: string; a: string }> = [
  { q: "How does the 14-day trial work?", a: "Self-serve checkout is launching soon. Basic and Team will start with a 14-day free trial: you enter a card at checkout and are not charged until the trial ends, and you can cancel any time from the billing portal. Want in before launch? Schedule a demo and we will set you up." },
  { q: "What happens if I go over my monthly sessions?", a: "Nothing breaks. Attendee capture always keeps working at live events. We flag the overage in your dashboard and suggest a plan that fits your volume." },
  { q: "What is the onboarding fee?", a: "Team includes hands-on onboarding, billed as a one-time fee on monthly billing and waived when you choose annual. Pro and Enterprise onboarding is scoped with our team during the sales process." },
  { q: "Can I change plans later?", a: "Yes. Upgrades take effect immediately with prorated billing. Downgrades and cancellations are handled from the billing portal and take effect at the end of your billing period." },
  { q: "How does Enterprise pricing work?", a: "Enterprise is custom-priced starting at $6,500 per month based on seats, workspaces, data residency, and support requirements. Schedule a demo and we will scope it with you." },
];
