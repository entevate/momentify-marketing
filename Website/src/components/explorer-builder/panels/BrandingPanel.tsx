'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Upload, ChevronDown, ChevronRight, Sun, Moon } from 'lucide-react';
import type { ExplorerConfig } from '@/lib/explorer/config-schema';

interface BrandingPanelProps {
  config: ExplorerConfig;
  onChange: (config: ExplorerConfig) => void;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const isGradient = value.includes('gradient');

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">{label}</label>
        {!isGradient && (
          <span className="text-[10px] text-white/30 font-mono">{value}</span>
        )}
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full h-8 rounded-lg border border-white/12 flex items-center gap-2 px-2 hover:border-white/20 transition-colors"
      >
        <div
          className="w-5 h-5 rounded-md border border-white/12 flex-shrink-0"
          style={{ background: value }}
        />
        <span className="text-xs text-white/60 truncate flex-1 text-left">
          {isGradient ? 'Gradient' : value}
        </span>
        <ChevronDown className={`w-3 h-3 text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && !isGradient && (
        <div className="mt-2 p-2 rounded-lg border border-white/12 bg-[#0F1035]">
          <HexColorPicker color={value} onChange={onChange} style={{ width: '100%', height: 140 }} />
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full mt-2 px-2 py-1.5 rounded-md bg-white/6 border border-white/8 text-xs text-white/80 font-mono outline-none focus:border-[#00BBA5]"
          />
        </div>
      )}
      {open && isGradient && (
        <div className="mt-2 p-2 rounded-lg border border-white/12 bg-[#0F1035]">
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-2 py-1.5 rounded-md bg-white/6 border border-white/8 text-xs text-white/80 font-mono outline-none focus:border-[#00BBA5]"
            placeholder="linear-gradient(135deg, #color1, #color2)"
          />
        </div>
      )}
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

function FileField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="URL or upload..."
          className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/8 text-xs text-white/80 outline-none focus:border-[#00BBA5] transition-colors"
        />
        <button className="px-2 py-1.5 rounded-lg border border-white/12 text-white/40 hover:text-white/60 hover:border-white/20 transition-colors">
          <Upload className="w-3.5 h-3.5" />
        </button>
      </div>
      {value && (
        <div className="mt-1.5 h-8 rounded-md bg-white/4 border border-white/8 flex items-center px-2">
          <img src={value} alt="" className="h-5 max-w-full object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
        </div>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/8 text-xs text-white/80 outline-none focus:border-[#00BBA5] transition-colors appearance-none"
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-[#0F1035]">{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function BrandingPanel({ config, onChange }: BrandingPanelProps) {
  const [themeTab, setThemeTab] = useState<'dark' | 'light'>('dark');

  const updateBranding = (path: string, value: string) => {
    const updated = { ...config, branding: { ...config.branding } };
    const parts = path.split('.');
    let obj: Record<string, unknown> = updated.branding as Record<string, unknown>;
    for (let i = 0; i < parts.length - 1; i++) {
      obj[parts[i]] = { ...(obj[parts[i]] as Record<string, unknown>) };
      obj = obj[parts[i]] as Record<string, unknown>;
    }
    obj[parts[parts.length - 1]] = value;
    onChange(updated);
  };

  const themeColors = themeTab === 'dark' ? config.branding.colors.dark : config.branding.colors.light;
  const updateThemeColor = (key: string, value: string) => {
    updateBranding(`colors.${themeTab}.${key}`, value);
  };

  return (
    <div className="text-white">
      {/* Logo & Identity */}
      <Section title="Logo & Identity" defaultOpen>
        <TextField label="Company Name" value={config.branding.companyName} onChange={v => updateBranding('companyName', v)} />
        <FileField label="Logo (Dark Mode)" value={config.branding.logo.dark} onChange={v => updateBranding('logo.dark', v)} />
        <FileField label="Logo (Light Mode)" value={config.branding.logo.light} onChange={v => updateBranding('logo.light', v)} />
        <FileField label="Icon" value={config.branding.icon} onChange={v => updateBranding('icon', v)} />
        <SelectField
          label="Font"
          value={config.branding.font}
          onChange={v => updateBranding('font', v)}
          options={[
            { value: "'Inter', -apple-system, sans-serif", label: 'Inter' },
            { value: "'Manrope', sans-serif", label: 'Manrope' },
          ]}
        />
      </Section>

      {/* Brand Colors */}
      <Section title="Brand Colors" defaultOpen>
        <ColorField label="Primary (Cyan)" value={config.branding.colors.primary} onChange={v => updateBranding('colors.primary', v)} />
        <ColorField label="Teal" value={config.branding.colors.teal} onChange={v => updateBranding('colors.teal', v)} />
        <ColorField label="Blue" value={config.branding.colors.blue} onChange={v => updateBranding('colors.blue', v)} />
        <ColorField label="Navy" value={config.branding.colors.navy} onChange={v => updateBranding('colors.navy', v)} />
        <ColorField label="Midnight" value={config.branding.colors.midnight} onChange={v => updateBranding('colors.midnight', v)} />
        <ColorField label="Plum" value={config.branding.colors.plum} onChange={v => updateBranding('colors.plum', v)} />
      </Section>

      {/* Theme Colors */}
      <Section title="Theme Colors">
        <div className="flex gap-1 mb-3 bg-white/4 rounded-lg p-0.5">
          <button
            onClick={() => setThemeTab('dark')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              themeTab === 'dark' ? 'bg-white/8 text-white/80' : 'text-white/30'
            }`}
          >
            <Moon className="w-3 h-3" /> Dark
          </button>
          <button
            onClick={() => setThemeTab('light')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              themeTab === 'light' ? 'bg-white/8 text-white/80' : 'text-white/30'
            }`}
          >
            <Sun className="w-3 h-3" /> Light
          </button>
        </div>
        <ColorField label="Background" value={themeColors.bg} onChange={v => updateThemeColor('bg', v)} />
        <ColorField label="Background Gradient" value={themeColors.bgGradient} onChange={v => updateThemeColor('bgGradient', v)} />
        <ColorField label="Surface" value={themeColors.surface} onChange={v => updateThemeColor('surface', v)} />
        <ColorField label="Border" value={themeColors.border} onChange={v => updateThemeColor('border', v)} />
        <ColorField label="Text Primary" value={themeColors.text1} onChange={v => updateThemeColor('text1', v)} />
        <ColorField label="Text Secondary" value={themeColors.text2} onChange={v => updateThemeColor('text2', v)} />
        <ColorField label="Text Tertiary" value={themeColors.text3} onChange={v => updateThemeColor('text3', v)} />
        <ColorField label="Input Background" value={themeColors.inputBg} onChange={v => updateThemeColor('inputBg', v)} />
        <ColorField label="Focus Ring" value={themeColors.focusRing} onChange={v => updateThemeColor('focusRing', v)} />
      </Section>

      {/* CTA & Accents */}
      <Section title="CTA & Accents">
        <ColorField label="CTA Gradient" value={config.branding.ctaGradient} onChange={v => updateBranding('ctaGradient', v)} />
        <ColorField label="CTA Text" value={config.branding.ctaTextColor} onChange={v => updateBranding('ctaTextColor', v)} />
        <ColorField label="Gradient Word" value={config.branding.gradientWord} onChange={v => updateBranding('gradientWord', v)} />
      </Section>

      {/* Background */}
      <Section title="Background">
        <SelectField
          label="Pattern"
          value={config.branding.backgroundPattern}
          onChange={v => updateBranding('backgroundPattern', v)}
          options={[
            { value: 'dots-grid-contour', label: 'Dots + Grid + Contour' },
            { value: 'dots-grid', label: 'Dots + Grid' },
            { value: 'dots', label: 'Dots Only' },
            { value: 'none', label: 'None' },
          ]}
        />
        <FileField label="Background Image" value={config.branding.backgroundImage || ''} onChange={v => updateBranding('backgroundImage', v)} />
        <ColorField label="Aurora Orb 1" value={config.branding.auroraOrbs.orb1} onChange={v => updateBranding('auroraOrbs.orb1', v)} />
        <ColorField label="Aurora Orb 2" value={config.branding.auroraOrbs.orb2} onChange={v => updateBranding('auroraOrbs.orb2', v)} />
        <ColorField label="Aurora Orb 3" value={config.branding.auroraOrbs.orb3} onChange={v => updateBranding('auroraOrbs.orb3', v)} />
      </Section>
    </div>
  );
}
