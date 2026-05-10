import { notFound } from 'next/navigation';
import ExplorerRenderer from '@/components/explorer/ExplorerRenderer';
import ExplorerBezelWrapper from '@/components/explorer/ExplorerBezelWrapper';
import { PROTOTYPE_CONFIGS } from '@/lib/explorer/configs/registry';

export default async function ExplorerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bezel?: string }>;
}) {
  const { id } = await params;
  const { bezel } = await searchParams;
  const config = PROTOTYPE_CONFIGS[id];

  if (!config) {
    notFound();
  }

  if (bezel === 'false') {
    return <ExplorerRenderer config={config} />;
  }

  return (
    <ExplorerBezelWrapper config={config} />
  );
}

export function generateStaticParams() {
  return Object.keys(PROTOTYPE_CONFIGS).map(id => ({ id }));
}
