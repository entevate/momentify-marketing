import type { Metadata } from "next";
import PricingContent from "@/components/PricingContent";

export const metadata: Metadata = {
  title: "Pricing | Momentify",
  description:
    "Momentify plans for teams and individuals. From Solo personal lead capture at $49/mo to enterprise dealer networks. Self-serve checkout launching soon.",
  alternates: { canonical: "https://momentifyapp.com/pricing" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
    { "@type": "ListItem", position: 2, name: "Pricing", item: "https://momentifyapp.com/pricing" },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PricingContent />
    </>
  );
}
