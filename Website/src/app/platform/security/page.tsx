import type { Metadata } from "next";
import SecurityContent from "@/components/SecurityContent";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Enterprise-grade security, privacy, and reliability. Momentify protects your data with AES-256 encryption, role-based access, SSO, and SOC 2 compliance.",
  keywords: [
    "Momentify security",
    "event platform security",
    "SOC 2 event software",
    "enterprise event security",
    "AES-256 encryption events",
    "SSO event platform",
  ],
  alternates: {
    canonical: "https://momentifyapp.com/platform/security",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
    { "@type": "ListItem", position: 2, name: "Platform" },
    { "@type": "ListItem", position: 3, name: "Security" },
  ],
};

export default function SecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SecurityContent />
    </>
  );
}
