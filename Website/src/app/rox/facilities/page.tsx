import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FacilitiesROXCalculator from "@/components/rox/FacilitiesROXCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facilities ROX\u2122 Calculator",
  description:
    "Evaluate your facility performance across visitor capture, engagement quality, follow-up speed, and pipeline attribution. Get your ROX score in under 3 minutes.",
  keywords: [
    "facility ROX calculator",
    "facility ROI calculator",
    "showroom ROI calculator",
    "visitor engagement score",
    "facility performance benchmark",
    "return on experience facilities",
    "demo floor analytics calculator",
    "training center ROI tool",
    "facility visitor analytics",
    "showroom performance score",
  ],
  openGraph: {
    images: [{ url: "/og/og-facilities.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/og-facilities.png"],
  },
  alternates: {
    canonical: "https://momentifyapp.com/rox/facilities",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How to Calculate Your Facilities ROX Score",
      description:
        "Use the Momentify Facilities ROX Calculator to assess your facility's Return on Experience across four categories. Takes under 3 minutes with no login required.",
      step: [
        { "@type": "HowToStep", name: "Rate Visitor Capture Efficiency", text: "Answer questions about your current visitor capture process and percentage of facility guests converted to actionable leads." },
        { "@type": "HowToStep", name: "Assess Engagement Quality", text: "Evaluate the depth of visitor interactions across showroom zones, demo stations, and training areas." },
        { "@type": "HowToStep", name: "Measure Follow-Up Speed", text: "Rate how quickly your facility team follows up after visits, including time-to-first-contact and CRM sync." },
        { "@type": "HowToStep", name: "Evaluate Pipeline Attribution", text: "Assess how many facility visits become meetings, proposals, or pipeline opportunities." },
        { "@type": "HowToStep", name: "Get Your ROX Score", text: "Receive your overall ROX score (0-100) with per-category breakdown and tier classification from Critical Gap to Elite ROX." },
      ],
      tool: { "@type": "HowToTool", name: "Momentify ROX Calculator" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "ROX Calculators" },
        { "@type": "ListItem", position: 3, name: "Facilities ROX Calculator" },
      ],
    },
  ],
};

export default function FacilitiesROXPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <FacilitiesROXCalculator />
      <Footer />
    </main>
  );
}
