import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlobalDealerLearningCaseStudy from "@/components/case-studies/GlobalDealerLearningCaseStudy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Dealer Learning Case Study",
  description:
    "How a Fortune 75 Heavy Equipment Manufacturer's Global Dealer Learning group used Momentify to unify technician recruiting across SkillsUSA and FFA, routing candidates to 40 dealers in real time.",
  keywords: [
    "dealer recruiting case study",
    "SkillsUSA recruiting",
    "FFA recruiting",
    "multi-event recruiting",
    "distributed recruiting platform",
    "heavy equipment dealer recruiting",
    "technician recruiting case study",
    "real-time candidate routing",
  ],
  alternates: {
    canonical: "https://momentifyapp.com/case-studies/global-dealer-learning",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Global Dealer Learning: 40 dealers. One platform. Zero lost candidates.",
      description:
        "How a Fortune 75 Heavy Equipment Manufacturer's Global Dealer Learning group used Momentify to unify technician recruiting across SkillsUSA and FFA events, routing qualified candidates to 40 dealers in real time.",
      author: { "@type": "Organization", name: "Momentify" },
      publisher: {
        "@type": "Organization",
        name: "Momentify",
        logo: { "@type": "ImageObject", url: "https://momentifyapp.com/Momentify-Icon.svg" },
      },
      url: "https://momentifyapp.com/case-studies/global-dealer-learning",
      datePublished: "2025-03-01",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://momentifyapp.com/case-studies" },
        { "@type": "ListItem", position: 3, name: "Global Dealer Learning" },
      ],
    },
  ],
};

export default function GlobalDealerLearningPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <GlobalDealerLearningCaseStudy />
      <Footer />
    </main>
  );
}
