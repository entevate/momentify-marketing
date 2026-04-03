'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Link2 } from 'lucide-react';
import type { ExplorerConfig, QuickLink } from '@/lib/explorer/config-schema';

interface SettingsPanelProps {
  config: ExplorerConfig;
  onChange: (config: ExplorerConfig) => void;
}

function Toggle({ label, value, onChange, description }: { label: string; value: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <div>
        <span className="text-xs text-white/70">{label}</span>
        {description && <div className="text-[10px] text-white/30">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-8 h-[18px] rounded-full transition-colors relative flex-shrink-0 ${value ? 'bg-[#00BBA5]' : 'bg-white/12'}`}
      >
        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] transition-transform ${value ? 'translate-x-[16px]' : 'translate-x-[2px]'}`} />
      </button>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/8 text-xs text-white/80 outline-none focus:border-[#00BBA5] transition-colors"
      />
    </div>
  );
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/6 pb-3 mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 text-xs font-semibold text-white/70 uppercase tracking-wider hover:text-white/90 transition-colors"
      >
        {title}
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  );
}

export default function SettingsPanel({ config, onChange }: SettingsPanelProps) {
  const updateFeatures = (key: string, value: boolean) => {
    onChange({ ...config, features: { ...config.features, [key]: value } });
  };

  const updateShare = (key: string, value: boolean) => {
    onChange({ ...config, features: { ...config.features, share: { ...config.features.share, [key]: value } } });
  };

  const updateThankYou = (key: string, value: string | boolean) => {
    onChange({ ...config, thankYou: { ...config.thankYou, [key]: value } });
  };

  const updateQuickLink = (i: number, link: QuickLink) => {
    const links = [...config.features.quickLinks];
    links[i] = link;
    onChange({ ...config, features: { ...config.features, quickLinks: links } });
  };

  const deleteQuickLink = (i: number) => {
    onChange({ ...config, features: { ...config.features, quickLinks: config.features.quickLinks.filter((_, idx) => idx !== i) } });
  };

  const addQuickLink = () => {
    onChange({ ...config, features: { ...config.features, quickLinks: [...config.features.quickLinks, { label: '', url: '' }] } });
  };

  return (
    <div className="text-white">
      {/* Theme */}
      <Section title="Theme" defaultOpen>
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1.5">Default Theme</label>
          <div className="flex gap-1 bg-white/4 rounded-lg p-0.5">
            <button
              onClick={() => onChange({ ...config, features: { ...config.features, defaultTheme: 'dark' } })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${config.features.defaultTheme === 'dark' ? 'bg-white/8 text-white/80' : 'text-white/30'}`}
            >
              Dark
            </button>
            <button
              onClick={() => onChange({ ...config, features: { ...config.features, defaultTheme: 'light' } })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${config.features.defaultTheme === 'light' ? 'bg-white/8 text-white/80' : 'text-white/30'}`}
            >
              Light
            </button>
          </div>
        </div>
        <Toggle label="Dark Mode" value={config.features.darkMode} onChange={v => updateFeatures('darkMode', v)} description="Allow dark mode" />
        <Toggle label="Light Mode" value={config.features.lightMode} onChange={v => updateFeatures('lightMode', v)} description="Allow light mode" />
      </Section>

      {/* Features */}
      <Section title="Features" defaultOpen>
        <Toggle label="Briefcase" value={config.features.briefcase} onChange={v => updateFeatures('briefcase', v)} description="Save items for later" />
        <Toggle label="Notes" value={config.features.notes} onChange={v => updateFeatures('notes', v)} description="Lead notes with temperature" />
        <Toggle label="Voice Capture" value={config.features.voiceCapture} onChange={v => updateFeatures('voiceCapture', v)} description="Record voice notes" />
        <Toggle label="Media Capture" value={config.features.mediaCapture} onChange={v => updateFeatures('mediaCapture', v)} description="Photo/video/document" />
        <Toggle label="Capture Info" value={config.features.captureInfo} onChange={v => updateFeatures('captureInfo', v)} description="Re-capture lead mid-session" />
        <Toggle label="Content Library" value={config.features.contentLibrary} onChange={v => updateFeatures('contentLibrary', v)} description="Full searchable library" />
      </Section>

      {/* Share */}
      <Section title="Share Options">
        <Toggle label="Email" value={config.features.share.email} onChange={v => updateShare('email', v)} />
        <Toggle label="Text / SMS" value={config.features.share.text} onChange={v => updateShare('text', v)} />
        <Toggle label="QR Code" value={config.features.share.qr} onChange={v => updateShare('qr', v)} />
      </Section>

      {/* Registration */}
      <Section title="Registration">
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1.5">Default Mode</label>
          <div className="flex gap-1 bg-white/4 rounded-lg p-0.5">
            {(['scan', 'form', 'search'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => onChange({ ...config, registration: { ...config.registration, defaultMode: mode } })}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${config.registration.defaultMode === mode ? 'bg-white/8 text-white/80' : 'text-white/30'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <Toggle label="Skip Enabled" value={config.registration.skipEnabled} onChange={v => onChange({ ...config, registration: { ...config.registration, skipEnabled: v } })} description="Allow skipping registration" />
        <Toggle label="Locale Button" value={config.registration.showLocaleButton} onChange={v => onChange({ ...config, registration: { ...config.registration, showLocaleButton: v } })} description="I don't live in the US" />
        <TextField label="Form Title" value={config.registration.formTitle} onChange={v => onChange({ ...config, registration: { ...config.registration, formTitle: v } })} />
        <TextField label="Form Subtitle" value={config.registration.formSubtitle} onChange={v => onChange({ ...config, registration: { ...config.registration, formSubtitle: v } })} />
        <TextField label="Scan Label" value={config.registration.scanLabel} onChange={v => onChange({ ...config, registration: { ...config.registration, scanLabel: v } })} />
        <TextField label="Search Placeholder" value={config.registration.searchPlaceholder} onChange={v => onChange({ ...config, registration: { ...config.registration, searchPlaceholder: v } })} />
      </Section>

      {/* Thank You */}
      <Section title="Thank You Screen">
        <TextField label="Title" value={config.thankYou.title} onChange={v => updateThankYou('title', v)} placeholder="Thank you, {name}!" />
        <TextField label="Subtitle" value={config.thankYou.subtitle} onChange={v => updateThankYou('subtitle', v)} />
        <Toggle label="New Session Button" value={config.thankYou.showNewSession} onChange={v => updateThankYou('showNewSession', v)} />
        <Toggle label="Add Notes Button" value={config.thankYou.showAddNotes} onChange={v => updateThankYou('showAddNotes', v)} />
      </Section>

      {/* Quick Links */}
      <Section title="Quick Links">
        {config.features.quickLinks.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2 items-start">
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={link.label}
                onChange={e => updateQuickLink(i, { ...link, label: e.target.value })}
                placeholder="Label"
                className="w-full px-2 py-1 rounded-md bg-white/6 border border-white/8 text-xs text-white/80 outline-none focus:border-[#00BBA5]"
              />
              <input
                type="text"
                value={link.url}
                onChange={e => updateQuickLink(i, { ...link, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-2 py-1 rounded-md bg-white/6 border border-white/8 text-[10px] text-white/50 outline-none focus:border-[#00BBA5] font-mono"
              />
            </div>
            <button onClick={() => deleteQuickLink(i)} className="p-1 text-white/20 hover:text-red-400 transition-colors mt-1">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={addQuickLink}
          className="w-full py-1.5 rounded-lg border border-dashed border-white/12 text-xs text-white/40 hover:text-white/60 hover:border-white/20 transition-colors flex items-center justify-center gap-1"
        >
          <Link2 className="w-3 h-3" /> Add Quick Link
        </button>
      </Section>
    </div>
  );
}
