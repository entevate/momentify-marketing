import type { Metadata } from "next";
import PricingContent from "@/components/PricingContent";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Momentify pricing for teams of every size. From a single team at $650/mo to enterprise dealer networks. Start a 14-day free trial on Basic or Team today.",
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
