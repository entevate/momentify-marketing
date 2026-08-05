import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventsVenuesROXCalculator from "@/components/rox/EventsVenuesROXCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venues & Events ROX\u2122 Calculator",
  description:
    "Measure your event performance across attendee capture, engagement quality, follow-up speed, and sponsor conversion. Get your ROX score in under 3 minutes.",
  keywords: [
    "venue ROX calculator",
    "event ROI calculator",
    "sponsor ROI calculator",
    "attendee engagement score",
    "event performance benchmark",
    "return on experience events",
    "venue analytics calculator",
    "event sponsorship ROI tool",
    "hospitality engagement score",
    "event performance measurement",
  ],
  openGraph: {
    images: [{ url: "/og/og-events-venues.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/og-events-venues.png"],
  },
  alternates: {
    canonical: "https://momentifyapp.com/rox/venues",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How to Calculate Your Venue and Event ROX Score",
      description:
        "Use the Momentify Venues & Events ROX Calculator to assess your event's Return on Experience across four categories. Takes under 3 minutes with no login required.",
      step: [
        { "@type": "HowToStep", name: "Rate Attendee Capture Efficiency", text: "Answer questions about your current attendee capture process and percentage of event guests converted to actionable contacts." },
        { "@type": "HowToStep", name: "Assess Engagement Quality", text: "Evaluate the depth of attendee interactions across zones, suites, activations, and sponsor experiences." },
        { "@type": "HowToStep", name: "Measure Follow-Up Speed", text: "Rate how quickly your event team and sponsors follow up after the event, including outreach timing and personalization." },
        { "@type": "HowToStep", name: "Evaluate Sponsor Conversion", text: "Assess how many attendee interactions become sponsor meetings, renewals, or attributed revenue." },
        { "@type": "HowToStep", name: "Get Your ROX Score", text: "Receive your overall ROX score (0-100) with per-category breakdown and tier classification from Critical Gap to Elite ROX." },
      ],
      tool: { "@type": "HowToTool", name: "Momentify ROX Calculator" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "ROX Calculators" },
        { "@type": "ListItem", position: 3, name: "Venues & Events ROX Calculator" },
      ],
    },
  ],
};

export default function EventsVenuesROXPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <EventsVenuesROXCalculator />
      <Footer />
    </main>
  );
}
