import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RecruitingROXCalculator from "@/components/rox/RecruitingROXCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Recruiting ROX\u2122 Calculator",
  description:
    "Benchmark your recruiting events across candidate capture, engagement quality, follow-up speed, and conversion to hire. Get your ROX score in under 3 minutes.",
  keywords: [
    "recruiting event ROX calculator",
    "career fair ROI calculator",
    "recruiting event ROI",
    "candidate engagement score",
    "hiring event performance benchmark",
    "return on experience recruiting",
    "campus recruiting calculator",
    "talent acquisition ROI tool",
    "recruiting event analytics",
    "career fair performance score",
  ],
  openGraph: {
    images: [{ url: "/og/og-technical-recruiting.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/og-technical-recruiting.png"],
  },
  alternates: {
    canonical: "https://momentifyapp.com/rox/recruiting",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How to Calculate Your Recruiting Event ROX Score",
      description:
        "Use the Momentify Technical Recruiting ROX Calculator to assess your team's Return on Experience across four categories. Takes under 3 minutes with no login required.",
      step: [
        { "@type": "HowToStep", name: "Rate Candidate Capture Efficiency", text: "Answer questions about your current candidate capture process and percentage of event attendees converted to actionable prospects." },
        { "@type": "HowToStep", name: "Assess Engagement Quality", text: "Evaluate the depth of candidate interactions at your recruiting events, including role-fit scoring and content engagement." },
        { "@type": "HowToStep", name: "Measure Follow-Up Speed", text: "Rate how quickly your recruiting team follows up after events, including time-to-first-contact and pipeline routing speed." },
        { "@type": "HowToStep", name: "Evaluate Conversion to Hire", text: "Assess how many event candidates become interviews, offers, and hires." },
        { "@type": "HowToStep", name: "Get Your ROX Score", text: "Receive your overall ROX score (0-100) with per-category breakdown and tier classification from Critical Gap to Elite ROX." },
      ],
      tool: { "@type": "HowToTool", name: "Momentify ROX Calculator" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "ROX Calculators" },
        { "@type": "ListItem", position: 3, name: "Technical Recruiting ROX Calculator" },
      ],
    },
  ],
};

export default function RecruitingROXPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <RecruitingROXCalculator />
      <Footer />
    </main>
  );
}
