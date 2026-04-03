import { notFound } from 'next/navigation';
import ExplorerRenderer from '@/components/explorer/ExplorerRenderer';
import { MOMENTIFY_DEFAULT_CONFIG } from '@/lib/explorer/defaults';

// For now, only the default config is available
// Later this will fetch from Vercel KV/Blob
const CONFIGS: Record<string, typeof MOMENTIFY_DEFAULT_CONFIG> = {
  'momentify-default': MOMENTIFY_DEFAULT_CONFIG,
};

export default async function ExplorerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const config = CONFIGS[id];

  if (!config) {
    notFound();
  }

  return (
    <ExplorerRenderer config={config} />
  );
}

export function generateStaticParams() {
  return Object.keys(CONFIGS).map(id => ({ id }));
}
