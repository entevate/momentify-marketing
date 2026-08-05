import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Momentify team. Reach out for sales inquiries, support, partnerships, or to schedule a demo of the platform.",
  alternates: {
    canonical: "https://momentifyapp.com/contact",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://momentifyapp.com" },
    { "@type": "ListItem", position: 2, name: "Contact Us" },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactContent />
    </>
  );
}
