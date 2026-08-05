import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TechRecruitingSolution from "@/components/solutions/TechRecruitingSolution";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Recruiting",
  description:
    "Stop losing top candidates to slow follow-up. Momentify gives recruiting teams mobile capture, role-based scoring, and same-day pipeline from every career fair.",
  keywords: [
    "recruiting event technology",
    "career fair lead capture",
    "technical recruiting platform",
    "campus recruiting software",
    "hiring event analytics",
    "candidate engagement tracking",
    "job fair lead capture",
    "recruiting event ROI",
    "talent acquisition events",
    "career fair software",
  ],
  openGraph: {
    images: [{ url: "/og/og-technical-recruiting.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/og-technical-recruiting.png"],
  },
  alternates: {
    canonical: "https://momentifyapp.com/solutions/technical-recruiting",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Momentify for Technical Recruiting",
      description:
        "Mobile-first candidate capture for career fairs, hiring events, and campus visits. Score candidates by role fit and engagement depth, deliver persona-based content, and route qualified talent to your ATS in real time.",
      brand: { "@type": "Brand", name: "Momentify" },
      url: "https://momentifyapp.com/solutions/technical-recruiting",
      category: "Recruiting Event Software",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Schedule a demo for personalized pricing",
        url: "https://momentifyapp.com/demo?source=technical-recruiting",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "Solutions" },
        { "@type": "ListItem", position: 3, name: "Technical Recruiting" },
      ],
    },
  ],
};

export default function TechRecruitingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <TechRecruitingSolution />
      <Footer />
    </main>
  );
}
