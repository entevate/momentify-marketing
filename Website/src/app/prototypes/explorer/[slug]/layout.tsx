import type { Metadata } from "next";
import { instances } from "../instances";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const instance = instances.find((i) => i.slug === slug);

  if (!instance) {
    return { title: "Explorer Prototype" };
  }

  const title = `${instance.name} | Momentify Explorer`;
  const description = `${instance.company} - ${instance.industry} interactive explorer experience powered by Momentify.`;

  return {
    title,
    description,
    openGraph: {
      title: instance.name,
      description,
      type: "website",
      images: [
        {
          url: `/api/prototypes/og?slug=${slug}`,
          width: 1200,
          height: 630,
          alt: instance.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: instance.name,
      description,
      images: [`/api/prototypes/og?slug=${slug}`],
    },
  };
}

export default function SlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}
