import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FieldSalesROXCalculator from "@/components/rox/FieldSalesROXCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Sales ROX\u2122 Calculator",
  description:
    "Assess your field sales effectiveness across interaction capture, content engagement, follow-up speed, and deal progression. Get your ROX score in under 3 minutes.",
  keywords: [
    "field sales ROX calculator",
    "field sales ROI calculator",
    "calculate field sales ROI",
    "sales engagement score",
    "field rep performance benchmark",
    "return on experience field sales",
    "outside sales calculator",
    "field visit ROI tool",
    "sales interaction analytics",
    "field sales performance score",
  ],
  openGraph: {
    images: [{ url: "/og/og-field-sales.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/og-field-sales.png"],
  },
  alternates: {
    canonical: "https://momentifyapp.com/rox/field-sales",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How to Calculate Your Field Sales ROX Score",
      description:
        "Use the Momentify Field Sales ROX Calculator to assess your team's Return on Experience across four categories. Takes under 3 minutes with no login required.",
      step: [
        { "@type": "HowToStep", name: "Rate Interaction Capture Efficiency", text: "Answer questions about your current field visit documentation process and percentage of interactions captured with actionable context." },
        { "@type": "HowToStep", name: "Assess Content Engagement", text: "Evaluate how effectively your field reps deliver content at the point of conversation and track what resonates." },
        { "@type": "HowToStep", name: "Measure Follow-Up Speed", text: "Rate how quickly your field team follows up after visits, including CRM sync speed and outreach timing." },
        { "@type": "HowToStep", name: "Evaluate Deal Progression", text: "Assess how many field interactions become meetings, proposals, or closed deals." },
        { "@type": "HowToStep", name: "Get Your ROX Score", text: "Receive your overall ROX score (0-100) with per-category breakdown and tier classification from Critical Gap to Elite ROX." },
      ],
      tool: { "@type": "HowToTool", name: "Momentify ROX Calculator" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "ROX Calculators" },
        { "@type": "ListItem", position: 3, name: "Field Sales ROX Calculator" },
      ],
    },
  ],
};

export default function FieldSalesROXPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <FieldSalesROXCalculator />
      <Footer />
    </main>
  );
}
