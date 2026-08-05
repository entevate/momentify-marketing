import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FacilitiesSolution from "@/components/solutions/FacilitiesSolution";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "Showroom visits generate pipeline you cannot see. Momentify captures zone-level engagement, tracks visitor intent, and connects facility investment to revenue.",
  keywords: [
    "facility visitor tracking",
    "showroom engagement software",
    "facility tour analytics",
    "visitor engagement platform",
    "demo floor tracking",
    "facility ROI measurement",
    "training center engagement",
    "facility lead capture",
    "showroom visitor analytics",
    "zone-level engagement tracking",
  ],
  openGraph: {
    images: [{ url: "/og/og-facilities.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/og-facilities.png"],
  },
  alternates: {
    canonical: "https://momentifyapp.com/solutions/facilities",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Momentify for Facilities",
      description:
        "Zone-level visitor engagement tracking for showrooms, training centers, and demo floors. Capture interactions at every station, track what content resonated, and connect facility investment to pipeline with ROX scoring.",
      brand: { "@type": "Brand", name: "Momentify" },
      url: "https://momentifyapp.com/solutions/facilities",
      category: "Facility Engagement Software",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Schedule a demo for personalized pricing",
        url: "https://momentifyapp.com/demo?source=facilities",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "Solutions" },
        { "@type": "ListItem", position: 3, name: "Facilities" },
      ],
    },
  ],
};

export default function FacilitiesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <FacilitiesSolution />
      <Footer />
    </main>
  );
}
