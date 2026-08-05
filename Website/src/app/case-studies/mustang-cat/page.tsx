import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MustangCatCaseStudy from "@/components/case-studies/MustangCatCaseStudy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mustang CAT Case Study",
  description:
    "How Mustang CAT transformed technical recruiting from paper sign-ups to a digital pipeline. 600+ candidates captured, 7 hires, 10/10 NPS.",
  keywords: [
    "recruiting case study",
    "career fair case study",
    "Caterpillar recruiting",
    "technical recruiting results",
    "candidate pipeline case study",
    "Mustang CAT recruiting",
    "digital recruiting pipeline",
    "career fair lead capture results",
  ],
  alternates: {
    canonical: "https://momentifyapp.com/case-studies/mustang-cat",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Mustang CAT: Paper sign-ups out. Digital pipeline in.",
      description:
        "How Mustang CAT transformed technical recruiting from paper sign-ups to a digital pipeline capturing 600+ candidates across career fairs and school visits with Momentify.",
      author: { "@type": "Organization", name: "Momentify" },
      publisher: {
        "@type": "Organization",
        name: "Momentify",
        logo: { "@type": "ImageObject", url: "https://momentifyapp.com/Momentify-Icon.svg" },
      },
      url: "https://momentifyapp.com/case-studies/mustang-cat",
      datePublished: "2025-01-15",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://momentifyapp.com/case-studies" },
        { "@type": "ListItem", position: 3, name: "Mustang CAT" },
      ],
    },
  ],
};

export default function MustangCatPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <MustangCatCaseStudy />
      <Footer />
    </main>
  );
}
