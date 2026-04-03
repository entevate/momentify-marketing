'use client';

import { ExplorerProvider, useExplorer } from './ExplorerContext';
import type { ExplorerConfig } from '@/lib/explorer/types';
import './explorer.css';

// Lazy imports for step components
import dynamic from 'next/dynamic';

const ExplorerShell = dynamic(() => import('./ExplorerShell'), { ssr: false });

interface ExplorerRendererProps {
  config: ExplorerConfig;
}

export default function ExplorerRenderer({ config }: ExplorerRendererProps) {
  return (
    <ExplorerProvider config={config}>
      <ExplorerShell />
    </ExplorerProvider>
  );
}
