import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TradeShowsROXCalculator from "@/components/rox/TradeShowsROXCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trade Shows ROX\u2122 Calculator",
  description:
    "Score your trade show performance across lead capture, engagement, follow-up speed, and conversion. Get your ROX score in under 3 minutes. No login required.",
  keywords: [
    "trade show ROX calculator",
    "trade show ROI calculator",
    "calculate trade show ROI",
    "event engagement score",
    "trade show performance benchmark",
    "return on experience calculator",
    "trade show lead capture score",
    "exhibit performance measurement",
    "event ROI tool",
    "trade show analytics calculator",
  ],
  openGraph: {
    images: [{ url: "/og/og-trade-shows.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/og-trade-shows.png"],
  },
  alternates: {
    canonical: "https://momentifyapp.com/rox/trade-shows",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How to Calculate Your Trade Show ROX Score",
      description:
        "Use the Momentify Trade Shows ROX Calculator to assess your team's Return on Experience across four categories. Takes under 3 minutes with no login required.",
      step: [
        { "@type": "HowToStep", name: "Rate Lead Capture Efficiency", text: "Answer questions about your current lead capture process, data completeness, and percentage of booth visitors converted to actionable leads." },
        { "@type": "HowToStep", name: "Assess Engagement Quality", text: "Evaluate the depth of visitor interactions at your booth, including content engagement, demo participation, and conversation quality." },
        { "@type": "HowToStep", name: "Measure Follow-Up Speed", text: "Rate how quickly your team follows up after the show, including time-to-first-contact and personalization of outreach." },
        { "@type": "HowToStep", name: "Evaluate Conversion Effectiveness", text: "Assess how many trade show leads become meetings, pipeline, or closed deals." },
        { "@type": "HowToStep", name: "Get Your ROX Score", text: "Receive your overall ROX score (0-100) with per-category breakdown and tier classification from Critical Gap to Elite ROX." },
      ],
      tool: { "@type": "HowToTool", name: "Momentify ROX Calculator" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "ROX Calculators" },
        { "@type": "ListItem", position: 3, name: "Trade Shows ROX Calculator" },
      ],
    },
  ],
};

export default function TradeShowsROXPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <TradeShowsROXCalculator />
      <Footer />
    </main>
  );
}
