import type { Metadata } from "next";
import { Suspense } from "react";
import SocialToolkitContent from "@/components/social-toolkit/SocialToolkitContent";

export const metadata: Metadata = {
  title: "Social Toolkit | Momentify",
  description:
    "Create branded social graphics, generate AI-powered captions, and manage your content library. Built for LinkedIn and B2B social channels.",
  keywords: [
    "social media toolkit",
    "branded graphics creator",
    "LinkedIn post creator",
    "B2B social content",
    "Momentify social toolkit",
    "event marketing graphics",
  ],
  alternates: {
    canonical: "https://momentifyapp.com/social-toolkit",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
    { "@type": "ListItem", position: 2, name: "Social Toolkit" },
  ],
};

export default function SocialToolkitPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <SocialToolkitContent />
      </Suspense>
    </main>
  );
}
