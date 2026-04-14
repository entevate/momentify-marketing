import { notFound } from 'next/navigation';
import ExplorerRenderer from '@/components/explorer/ExplorerRenderer';
import ExplorerBezelWrapper from '@/components/explorer/ExplorerBezelWrapper';
import { MOMENTIFY_DEFAULT_CONFIG } from '@/lib/explorer/defaults';
import { CLARIUM_CONFIG } from '@/lib/explorer/configs/clarium';
import { MAVEN_FP_CONFIG } from '@/lib/explorer/configs/maven-fp';
import { CDK_CONFIG } from '@/lib/explorer/configs/cdk';
import { SALESFLOWIQ_CONFIG } from '@/lib/explorer/configs/salesflowiq';

import type { ExplorerConfig } from '@/lib/explorer/types';

const CONFIGS: Record<string, ExplorerConfig> = {
  'momentify-default': MOMENTIFY_DEFAULT_CONFIG,
  'clarium': CLARIUM_CONFIG,
  'maven-fp': MAVEN_FP_CONFIG,
  'cdk': CDK_CONFIG,
  'salesflowiq': SALESFLOWIQ_CONFIG,
};

export default async function ExplorerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const config = CONFIGS[id];

  if (!config) {
    notFound();
  }

  return (
    <ExplorerBezelWrapper config={config} />
  );
}

export function generateStaticParams() {
  return Object.keys(CONFIGS).map(id => ({ id }));
}
