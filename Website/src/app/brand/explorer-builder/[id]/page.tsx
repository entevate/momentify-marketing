'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Palette, ListOrdered, FileText, GitBranch, Settings, ArrowLeft, ExternalLink, Monitor, Tablet, Sun, Moon } from 'lucide-react';
import { DEFAULT_CONFIG, type ExplorerConfig } from '@/lib/explorer/config-schema';
import BrandingPanel from '@/components/explorer-builder/panels/BrandingPanel';
import StepsPanel from '@/components/explorer-builder/panels/StepsPanel';
import ContentPanel from '@/components/explorer-builder/panels/ContentPanel';
import SettingsPanel from '@/components/explorer-builder/panels/SettingsPanel';

const TABS = [
  { id: 'branding', label: 'Branding', Icon: Palette },
  { id: 'steps', label: 'Steps', Icon: ListOrdered },
  { id: 'content', label: 'Content', Icon: FileText },
  { id: 'flow', label: 'Flow', Icon: GitBranch },
  { id: 'settings', label: 'Settings', Icon: Settings },
] as const;

type TabId = typeof TABS[number]['id'];
type DeviceMode = 'tablet' | 'kiosk';

export default function ExplorerEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<TabId>('branding');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('tablet');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [config, setConfig] = useState<ExplorerConfig>(() => ({
    ...DEFAULT_CONFIG,
    id: id === 'new' ? '' : id,
    name: id === 'new' ? 'New Explorer' : 'Momentify Explorer',
  }));

  // Brand files base URL. In production these are on the same domain.
  const brandBase = process.env.NEXT_PUBLIC_BRAND_URL || 'http://localhost:3001';

  const previewUrl = deviceMode === 'tablet'
    ? `${brandBase}/explorer-template-preview.html`
    : `${brandBase}/explorer-template-kiosk-preview.html`;

  const directUrls = {
    tablet: `${brandBase}/explorer-template-preview.html`,
    kiosk: `${brandBase}/explorer-template-kiosk-preview.html`,
  };

  return (
    <div className="h-screen flex flex-col bg-[#07081F] text-white font-[family-name:var(--font-inter)]">
      {/* Top Bar */}
      <header className="h-14 border-b border-white/8 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/brand/explorer-builder" className="text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-px h-6 bg-white/8" />
          <img src="/brand/assets/Momentify-Icon.svg" alt="" className="h-5" />
          <span className="text-sm font-medium">{id === 'new' ? 'New Explorer' : 'Momentify Explorer'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 rounded-lg text-sm font-medium border border-white/12 text-white/60 hover:text-white hover:border-white/20 transition-colors">
            Save Draft
          </button>
          <button
            className="px-4 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #00BBA5, #1A56DB)' }}
          >
            Publish
          </button>
        </div>
      </header>

      {/* Main: sidebar + preview */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside className="w-[280px] border-r border-white/8 flex flex-col flex-shrink-0">
          <nav className="flex border-b border-white/8">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#00BBA5] border-b-2 border-[#00BBA5]'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <tab.Icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'branding' && <BrandingPanel config={config} onChange={setConfig} />}
            {activeTab === 'steps' && <StepsPanel config={config} onChange={setConfig} />}
            {activeTab === 'content' && <ContentPanel config={config} onChange={setConfig} />}
            {activeTab === 'settings' && <SettingsPanel config={config} onChange={setConfig} />}
            {activeTab === 'flow' && (
              <div className="text-sm text-white/30 text-center py-12">
                Flow editor (node graph) coming soon
              </div>
            )}
          </div>
        </aside>

        {/* Preview */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Preview toolbar */}
          <div className="h-10 border-b border-white/8 px-4 flex items-center justify-between flex-shrink-0">
            {/* Device toggle */}
            <div className="flex items-center gap-1 bg-white/4 rounded-lg p-0.5">
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  deviceMode === 'tablet' ? 'bg-[#00BBA5]/15 text-[#00BBA5]' : 'text-white/40 hover:text-white/60'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                Tablet
              </button>
              <button
                onClick={() => setDeviceMode('kiosk')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  deviceMode === 'kiosk' ? 'bg-[#00BBA5]/15 text-[#00BBA5]' : 'text-white/40 hover:text-white/60'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Kiosk
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <div className="flex items-center gap-1 bg-white/4 rounded-lg p-0.5">
                <button
                  onClick={() => setPreviewTheme('dark')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
                    previewTheme === 'dark' ? 'bg-white/8 text-white/80' : 'text-white/30'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  Dark
                </button>
                <button
                  onClick={() => setPreviewTheme('light')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
                    previewTheme === 'light' ? 'bg-white/8 text-white/80' : 'text-white/30'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  Light
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-white/8" />

              {/* Open in new window links */}
              <a
                href={directUrls.tablet}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-white/30 hover:text-white/60 hover:bg-white/4 transition-colors"
                title="Open tablet preview in new window"
              >
                <Tablet className="w-3 h-3" />
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={directUrls.kiosk}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-white/30 hover:text-white/60 hover:bg-white/4 transition-colors"
                title="Open kiosk preview in new window"
              >
                <Monitor className="w-3 h-3" />
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Preview iframe */}
          <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center p-4">
            <iframe
              key={`${deviceMode}-${previewTheme}`}
              src={previewUrl}
              className="w-full h-full border-none rounded-lg"
              title={`${deviceMode} preview`}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
