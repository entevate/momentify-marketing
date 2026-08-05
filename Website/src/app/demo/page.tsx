import type { Metadata } from "next";
import { Suspense } from "react";
import Navigation from "@/components/Navigation";
import DemoContent from "@/components/DemoContent";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Schedule a Demo",
  description:
    "See Momentify in action. Schedule a personalized demo to learn how ROX scoring captures and proves the value of your in-person interactions.",
  keywords: [
    "Momentify demo",
    "event engagement demo",
    "schedule demo event platform",
    "ROX demo",
    "trade show software demo",
    "lead capture platform demo",
    "in-person engagement demo",
  ],
  alternates: {
    canonical: "https://momentifyapp.com/demo",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
    { "@type": "ListItem", position: 2, name: "Schedule a Demo" },
  ],
};

export default function DemoPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <Suspense>
        <DemoContent />
      </Suspense>
      <Footer />
    </main>
  );
}
