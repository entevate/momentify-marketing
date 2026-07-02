import type { Metadata, Viewport } from 'next';
import { PROTOTYPE_CONFIGS } from '@/lib/explorer/configs/registry';
import { instances } from '@/app/prototypes/explorer/instances';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const config = PROTOTYPE_CONFIGS[id];

  if (!config) {
    return { title: 'Momentify Explorer' };
  }

  const instance = instances.find((i) => i.slug === id);
  const title = config.name;
  const description = instance
    ? `${instance.company} - ${instance.industry} interactive explorer experience powered by Momentify.`
    : 'Interactive explorer experience powered by Momentify.';
  const ogImage = `/api/prototypes/og?slug=${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export const viewport: Viewport = {
  width: 1366,
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
