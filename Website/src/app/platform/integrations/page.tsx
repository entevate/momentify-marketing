import type { Metadata } from "next";
import IntegrationsContent from "@/components/IntegrationsContent";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "Connect Momentify to the tools your team already uses. CRM, ATS, data analysis, productivity, automation, and more.",
  keywords: [
    "Momentify integrations",
    "event platform CRM integration",
    "Salesforce event integration",
    "HubSpot event integration",
    "ATS integration events",
    "event data automation",
  ],
  alternates: {
    canonical: "https://momentifyapp.com/platform/integrations",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
    { "@type": "ListItem", position: 2, name: "Platform" },
    { "@type": "ListItem", position: 3, name: "Integrations" },
  ],
};

export default function IntegrationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IntegrationsContent />
    </>
  );
}
