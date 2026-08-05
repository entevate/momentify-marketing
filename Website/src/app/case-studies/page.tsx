import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CaseStudiesContent from "@/components/CaseStudiesContent";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real results from real teams. See how organizations use Momentify to grow trade show leads 92%, capture 600+ candidates, and prove in-person engagement ROI.",
  keywords: [
    "event engagement case studies",
    "trade show case study",
    "recruiting event results",
    "event ROI case study",
    "lead capture case study",
    "Momentify results",
  ],
  alternates: {
    canonical: "https://momentifyapp.com/case-studies",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
    { "@type": "ListItem", position: 2, name: "Case Studies" },
  ],
};

export default function CaseStudiesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <CaseStudiesContent />
      <Footer />
    </main>
  );
}
