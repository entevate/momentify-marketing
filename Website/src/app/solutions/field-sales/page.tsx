import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FieldSalesSolution from "@/components/solutions/FieldSalesSolution";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Sales Enablement",
  description:
    "Field reps have the conversation. Then the insight disappears. Momentify captures interactions, delivers content, and syncs to your CRM before the drive back.",
  keywords: [
    "field sales enablement",
    "field sales software",
    "field sales CRM sync",
    "mobile sales capture",
    "field rep engagement tracking",
    "outside sales enablement",
    "field visit documentation",
    "offline sales capture",
    "field sales analytics",
    "sales interaction tracking",
  ],
  openGraph: {
    images: [{ url: "/og/og-field-sales.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/og-field-sales.png"],
  },
  alternates: {
    canonical: "https://momentifyapp.com/solutions/field-sales",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Momentify for Field Sales Enablement",
      description:
        "Offline-capable interaction capture for field reps. Document conversations, deliver the right content at the point of interaction, and sync everything to your CRM before the drive back. Includes ROX scoring for rep and territory benchmarking.",
      brand: { "@type": "Brand", name: "Momentify" },
      url: "https://momentifyapp.com/solutions/field-sales",
      category: "Field Sales Software",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Schedule a demo for personalized pricing",
        url: "https://momentifyapp.com/demo?source=field-sales",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
        { "@type": "ListItem", position: 2, name: "Solutions" },
        { "@type": "ListItem", position: 3, name: "Field Sales Enablement" },
      ],
    },
  ],
};

export default function FieldSalesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <FieldSalesSolution />
      <Footer />
    </main>
  );
}
