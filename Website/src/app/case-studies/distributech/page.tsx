import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DistribuTECHCaseStudy from "@/components/case-studies/DistribuTECHCaseStudy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DistribuTECH Case Study | Momentify",
  description:
    "How a Fortune 75 Heavy Equipment Manufacturer's Electric Power Division used Momentify to grow trade show leads by 92% over three consecutive years at DistribuTECH.",
  keywords: [
    "trade show case study",
    "trade show lead growth",
    "heavy equipment trade show",
    "event marketing case study",
    "DistribuTECH results",
    "trade show ROI case study",
    "lead capture results",
    "event engagement case study",
  ],
  alternates: {
    canonical: "https://momentifyapp.com/case-studies/distributech",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "DistribuTECH: 92% more leads at the same event, three years running.",
      description:
        "How a Fortune 75 Heavy Equipment Manufacturer's Electric Power Division used Momentify across three consecutive years at DistribuTECH to grow leads by 92% with better data every time.",
      author: { "@type": "Organization", name: "Momentify" },
      publisher: {
        "@type": "Organization",
        name: "Momentify",
        logo: { "@type": "ImageObject", url: "https://momentifyapp.com/Momentify-Icon.svg" },
      },
      url: "https://momentifyapp.com/case-studies/distributech",
      datePublished: "2025-02-01",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://momentifyapp.com/case-studies" },
        { "@type": "ListItem", position: 3, name: "DistribuTECH" },
      ],
    },
  ],
};

export default function DistribuTECHPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <DistribuTECHCaseStudy />
      <Footer />
    </main>
  );
}
