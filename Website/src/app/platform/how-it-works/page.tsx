import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import HowItWorksContent from "@/components/HowItWorksContent";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Four steps. One platform. Every interaction measured. See how Momentify Web, Explorer, Intelligence, and Engage work together to capture, score, and prove ROX.",
  keywords: [
    "how Momentify works",
    "event engagement platform features",
    "lead capture workflow",
    "engagement scoring platform",
    "event analytics workflow",
    "in-person interaction platform",
  ],
  alternates: {
    canonical: "https://momentifyapp.com/platform/how-it-works",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
    { "@type": "ListItem", position: 2, name: "Platform" },
    { "@type": "ListItem", position: 3, name: "How It Works" },
  ],
};

export default function HowItWorksPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <HowItWorksContent />
    </main>
  );
}
