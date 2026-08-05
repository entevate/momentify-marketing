import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventsVenuesSolution from "@/components/solutions/EventsVenuesSolution";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venues and Events",
  description:
    "Ticket counts do not tell you what happened. Momentify captures attendee engagement, attributes sponsor value, and delivers follow-up clarity for every event.",
  keywords: [
    "venue engagement platform",
    "event sponsor analytics",
    "venue attendee tracking",
    "event engagement measurement",
    "sponsor ROI tracking",
    "event activation analytics",
    "venue analytics software",
    "attendee engagement platform",
    "event sponsorship measurement",
    "suite and hospitality analytics",
  ],
  openGraph: {
    images: [{ url: "/og/og-events-venues.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/og-events-venues.png"],
  },
  alternates: {
    canonical: "https://momentifyapp.com/solutions/venues",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Momentify for Venues and Events",
      description:
        "Multi-zone attendee engagement capture for venues, events, and hospitality. Track sponsor interactions, attribute value with exportable ROX reports, and deliver persona-based experiences by section, suite, and guest type.",
      brand: { "@type": "Brand", name: "Momentify" },
      url: "https://momentifyapp.com/solutions/venues",
      category: "Event Engagement Software",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Schedule a demo for personalized pricing",
        url: "https://momentifyapp.com/demo?source=venues",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "Solutions" },
        { "@type": "ListItem", position: 3, name: "Venues and Events" },
      ],
    },
  ],
};

export default function EventsVenuesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <EventsVenuesSolution />
      <Footer />
    </main>
  );
}
