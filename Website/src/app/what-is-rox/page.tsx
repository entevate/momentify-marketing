import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatIsROX from "@/components/WhatIsROX";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is ROX?",
  description:
    "Return on Experience (ROX) is the measurement standard for in-person engagement. Score every interaction across lead capture, engagement quality, follow-up speed, and conversion.",
  keywords: [
    "ROX",
    "return on experience",
    "ROX score",
    "ROX vs ROI",
    "event engagement score",
    "in-person engagement measurement",
    "event performance scoring",
    "ROX calculator",
    "event ROI alternative",
    "interaction quality score",
  ],
  openGraph: {
    images: [{ url: "/og/og-rox.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/og-rox.png"],
  },
  alternates: {
    canonical: "https://momentifyapp.com/what-is-rox",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "DefinedTerm",
      name: "ROX (Return on Experience)",
      description:
        "A measurement standard for in-person engagement that scores the quality of every interaction across four categories: Lead Capture Efficiency, Engagement Quality, Follow-Up Speed, and Conversion Effectiveness. Scores range from 0 to 100, with tiers of Critical Gap (0-39), Needs Optimization (40-69), High ROX (70-84), and Elite ROX (85-100).",
      url: "https://momentifyapp.com/what-is-rox",
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Momentify Engagement Metrics",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is ROX (Return on Experience)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ROX is a measurement standard for in-person engagement. It scores the quality of every interaction across four categories: Lead Capture Efficiency, Engagement Quality, Follow-Up Speed, and Conversion Effectiveness. Scores range from 0 to 100.",
          },
        },
        {
          "@type": "Question",
          name: "How is ROX different from ROI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ROI measures financial return. ROX measures the quality and effectiveness of in-person interactions. Traditional ROI cannot tell you which conversations mattered, which leads had real intent, or how fast your team followed up. ROX scores these dimensions so teams can optimize the full lifecycle from conversation to conversion.",
          },
        },
        {
          "@type": "Question",
          name: "What are the ROX score tiers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Critical Gap (0-39): Events are costing more than they deliver. Needs Optimization (40-69): Capturing some value but leaving results on the table. High ROX (70-84): Above average with strong capture and follow-up. Elite ROX (85-100): Highly optimized across every category.",
          },
        },
        {
          "@type": "Question",
          name: "What does ROX measure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ROX measures four categories: (1) Lead Capture Efficiency, the percentage of real visitors captured with actionable context; (2) Engagement Quality, depth of interaction with content, demos, or conversations; (3) Follow-Up Speed, how quickly teams reached out after an event; (4) Conversion Effectiveness, how many captured leads became meetings, hires, or closed opportunities.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "What is ROX?" },
      ],
    },
  ],
};

export default function WhatIsROXPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <WhatIsROX />
      <Footer />
    </main>
  );
}
