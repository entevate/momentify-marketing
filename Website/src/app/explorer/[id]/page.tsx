import { notFound } from 'next/navigation';
import ExplorerRenderer from '@/components/explorer/ExplorerRenderer';
import ExplorerBezelWrapper from '@/components/explorer/ExplorerBezelWrapper';
import { MOMENTIFY_DEFAULT_CONFIG } from '@/lib/explorer/defaults';
import { CLARIUM_CONFIG } from '@/lib/explorer/configs/clarium';
import { CLARIUM_MOBILE_CONFIG } from '@/lib/explorer/configs/clarium-mobile';
import { MAVEN_FP_CONFIG } from '@/lib/explorer/configs/maven-fp';
import { CDK_CONFIG } from '@/lib/explorer/configs/cdk';
import { SALESFLOWIQ_CONFIG } from '@/lib/explorer/configs/salesflowiq';
import { DEALROOM_CONFIG } from '@/lib/explorer/configs/dealroom';
import { DEALROOM_MOBILE_CONFIG } from '@/lib/explorer/configs/dealroom-mobile';
import { SALAS_OBRIEN_CONFIG } from '@/lib/explorer/configs/salas-o-brien';
import { SALAS_OBRIEN_MOBILE_CONFIG } from '@/lib/explorer/configs/salas-o-brien-mobile';
import { DFWPB_PICKLEBALL_CONFIG } from '@/lib/explorer/configs/dfwpb-pickleball-may132026';
import { DFWPB_PICKLEBALL_MOBILE_CONFIG } from '@/lib/explorer/configs/dfwpb-pickleball-may132026-mobile';
import { CARTER_MACHINERY_CONFIG } from '@/lib/explorer/configs/carter-machinery';
import { CARTER_MACHINERY_MOBILE_CONFIG } from '@/lib/explorer/configs/carter-machinery-mobile';
import { FORTUNE_TIRE_CONFIG } from '@/lib/explorer/configs/fortune-tire';

import type { ExplorerConfig } from '@/lib/explorer/types';

const CONFIGS: Record<string, ExplorerConfig> = {
  'momentify-default': MOMENTIFY_DEFAULT_CONFIG,
  'clarium': CLARIUM_CONFIG,
  'clarium-mobile': CLARIUM_MOBILE_CONFIG,
  'maven-fp': MAVEN_FP_CONFIG,
  'cdk': CDK_CONFIG,
  'salesflowiq': SALESFLOWIQ_CONFIG,
  'dealroom': DEALROOM_CONFIG,
  'dealroom-mobile': DEALROOM_MOBILE_CONFIG,
  'salas-o-brien': SALAS_OBRIEN_CONFIG,
  'salas-o-brien-mobile': SALAS_OBRIEN_MOBILE_CONFIG,
  'dfwpb-pickleball-may132026': DFWPB_PICKLEBALL_CONFIG,
  'dfwpb-pickleball-may132026-mobile': DFWPB_PICKLEBALL_MOBILE_CONFIG,
  'carter-machinery': CARTER_MACHINERY_CONFIG,
  'carter-machinery-mobile': CARTER_MACHINERY_MOBILE_CONFIG,
  'fortune-tire': FORTUNE_TIRE_CONFIG,
};

export default async function ExplorerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bezel?: string }>;
}) {
  const { id } = await params;
  const { bezel } = await searchParams;
  const config = CONFIGS[id];

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
  return Object.keys(CONFIGS).map(id => ({ id }));
}
