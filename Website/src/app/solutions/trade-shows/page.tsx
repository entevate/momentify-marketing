import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TradeShowsSolution from "@/components/solutions/TradeShowsSolution";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trade Shows and Exhibits",
  description:
    "Your booth captures badge scans. Momentify captures intent. Score leads, prioritize follow-up, and prove trade show ROI with ROX scoring.",
  keywords: [
    "trade show lead capture",
    "trade show ROI",
    "trade show engagement platform",
    "booth lead scoring",
    "trade show analytics",
    "exhibit lead capture software",
    "badge scanning alternative trade shows",
    "trade show follow-up automation",
    "event marketing ROI",
    "trade show lead management",
  ],
  openGraph: {
    images: [{ url: "/og/og-trade-shows.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/og-trade-shows.png"],
  },
  alternates: {
    canonical: "https://momentifyapp.com/solutions/trade-shows",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Momentify for Trade Shows and Exhibits",
      description:
        "Lead capture beyond badge scans for trade shows and exhibits. Capture visitor intent, score leads by engagement depth, and automate follow-up before the competition does. Includes ROX scoring for multi-event benchmarking.",
      brand: { "@type": "Brand", name: "Momentify" },
      url: "https://momentifyapp.com/solutions/trade-shows",
      category: "Event Engagement Software",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Schedule a demo for personalized pricing",
        url: "https://momentifyapp.com/demo?source=trade-shows",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "Solutions" },
        { "@type": "ListItem", position: 3, name: "Trade Shows and Exhibits" },
      ],
    },
  ],
};

export default function TradeShowsPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <TradeShowsSolution />
      <Footer />
    </main>
  );
}
