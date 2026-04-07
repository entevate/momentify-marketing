'use client';

import { useState, useEffect, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Plus, X, ChevronDown, Sparkles, Link2, Calculator, MonitorPlay, Sun, Moon, Pipette, Globe, Loader2 } from 'lucide-react';
import IntakeDropZone from '@/components/explorer-builder/IntakeDropZone';

// ── Types ──────────────────────────────────────────
type SolutionType = 'trade-shows' | 'recruiting' | 'sales-enablement' | 'facilities' | 'events-venues' | '';

const SOLUTION_TYPES: { value: SolutionType; label: string; disabled: boolean }[] = [
  { value: 'trade-shows', label: 'Trade Shows & Exhibits', disabled: false },
  { value: 'recruiting', label: 'Technical Recruiting', disabled: false },
  { value: 'sales-enablement', label: 'Sales Enablement (On-The-Go)', disabled: true },
  { value: 'facilities', label: 'Facilities', disabled: true },
  { value: 'events-venues', label: 'Events & Venues', disabled: true },
];

interface IntakeForm {
  companyName: string;
  templateName: string;
  slug: string;
  slugEdited: boolean;
  solutionType: SolutionType;
  industry: string;
  websiteUrl: string;
  contentFiles: File[];
  logos: { dark: File | null; light: File | null; icon: File | null };
  colors: { primary: string; secondary: string };
  password: string;
  screensaver: { enabled: boolean; url: string };
  calculator: { enabled: boolean; url: string };
  quickLinks: { label: string; url: string }[];
}

const INDUSTRIES = [
  'Aerospace & Defense', 'Agriculture', 'Automotive', 'Construction',
  'Education', 'Energy & Utilities', 'Event Services', 'Financial Services',
  'Food & Beverage', 'Government', 'Healthcare', 'Hospitality',
  'Manufacturing', 'Mining', 'Oil & Gas', 'Real Estate',
  'Retail', 'Technology', 'Telecommunications', 'Transportation & Logistics',
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ── Theme tokens ───────────────────────────────────
type Theme = 'light' | 'dark';

const THEMES = {
  light: {
    bg: '#F5F6FA',
    surface: '#FFFFFF',
    border: 'rgba(6,19,65,0.08)',
    borderFocus: '#00BBA5',
    text1: '#061341',
    text2: 'rgba(6,19,65,0.60)',
    text3: 'rgba(6,19,65,0.38)',
    inputBg: '#FFFFFF',
    inputBorder: 'rgba(6,19,65,0.10)',
    inputText: '#061341',
    accent: '#00BBA5',
    accentSoft: 'rgba(0,187,165,0.08)',
    headerBg: '#FFFFFF',
    headerBorder: 'rgba(6,19,65,0.06)',
    toggleOff: 'rgba(6,19,65,0.12)',
    codeBg: 'rgba(6,19,65,0.05)',
    dropLight: true,
  },
  dark: {
    bg: '#07081F',
    surface: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.08)',
    borderFocus: '#0CF4DF',
    text1: '#FFFFFF',
    text2: 'rgba(255,255,255,0.60)',
    text3: 'rgba(255,255,255,0.38)',
    inputBg: 'rgba(255,255,255,0.04)',
    inputBorder: 'rgba(255,255,255,0.08)',
    inputText: '#FFFFFF',
    accent: '#00BBA5',
    accentSoft: 'rgba(0,187,165,0.1)',
    headerBg: 'rgba(255,255,255,0.02)',
    headerBorder: 'rgba(255,255,255,0.06)',
    toggleOff: 'rgba(255,255,255,0.10)',
    codeBg: 'rgba(255,255,255,0.06)',
    dropLight: false,
  },
} as const;

// ── Component ──────────────────────────────────────
export default function ExplorerIntakePage() {
  const [theme, setTheme] = useState<Theme>('light');
  const T = THEMES[theme];

  const [form, setForm] = useState<IntakeForm>({
    companyName: '',
    templateName: '',
    slug: '',
    slugEdited: false,
    solutionType: '',
    industry: '',
    websiteUrl: '',
    contentFiles: [],
    logos: { dark: null, light: null, icon: null },
    colors: { primary: '#0CF4DF', secondary: '#254FE5' },
    password: '',
    screensaver: { enabled: false, url: '' },
    calculator: { enabled: false, url: '' },
    quickLinks: [],
  });

  const [showOptional, setShowOptional] = useState(false);
  const [activeColorPicker, setActiveColorPicker] = useState<'primary' | 'secondary' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const update = useCallback(<K extends keyof IntakeForm>(key: K, value: IntakeForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  // Extract dominant colors from an uploaded logo using canvas
  const extractColorsFromLogo = useCallback(() => {
    const logoFile = form.logos.light || form.logos.dark || form.logos.icon;
    if (!logoFile) return;
    setExtracting(true);

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    const url = URL.createObjectURL(logoFile);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 64;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setExtracting(false); URL.revokeObjectURL(url); return; }

      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      // Collect non-white, non-black, non-transparent pixels
      const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a < 128) continue; // skip transparent
        const brightness = (r + g + b) / 3;
        if (brightness > 240 || brightness < 15) continue; // skip near-white/black
        // Quantize to reduce noise
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;
        const key = `${qr},${qg},${qb}`;
        if (!buckets[key]) buckets[key] = { r: 0, g: 0, b: 0, count: 0 };
        buckets[key].r += r;
        buckets[key].g += g;
        buckets[key].b += b;
        buckets[key].count++;
      }

      const sorted = Object.values(buckets).sort((a, b) => b.count - a.count);
      if (sorted.length >= 1) {
        const p = sorted[0];
        const pr = Math.round(p.r / p.count);
        const pg = Math.round(p.g / p.count);
        const pb = Math.round(p.b / p.count);
        const primary = `#${pr.toString(16).padStart(2, '0')}${pg.toString(16).padStart(2, '0')}${pb.toString(16).padStart(2, '0')}`.toUpperCase();

        let secondary = form.colors.secondary;
        if (sorted.length >= 2) {
          const s = sorted[1];
          const sr = Math.round(s.r / s.count);
          const sg = Math.round(s.g / s.count);
          const sb = Math.round(s.b / s.count);
          secondary = `#${sr.toString(16).padStart(2, '0')}${sg.toString(16).padStart(2, '0')}${sb.toString(16).padStart(2, '0')}`.toUpperCase();
        }
        update('colors', { primary, secondary });
      }

      URL.revokeObjectURL(url);
      setExtracting(false);
    };
    img.onerror = () => { setExtracting(false); URL.revokeObjectURL(url); };
    img.src = url;
  }, [form.logos, form.colors.secondary, update]);

  // Extract logos + colors from a website URL
  const [extractingUrl, setExtractingUrl] = useState(false);
  const [extractStatus, setExtractStatus] = useState<string | null>(null);

  const extractFromUrl = useCallback(async () => {
    if (!form.websiteUrl.trim()) return;
    setExtractingUrl(true);
    setExtractStatus('Fetching website...');

    try {
      const res = await fetch('/api/explorer/extract-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.websiteUrl }),
      });

      if (!res.ok) {
        setExtractStatus('Could not reach the website');
        setTimeout(() => setExtractStatus(null), 3000);
        return;
      }

      const data = await res.json();
      const updates: string[] = [];

      // Apply colors if found
      if (data.colors && data.colors.length > 0) {
        const primary = data.colors[0];
        const secondary = data.colors.length > 1 ? data.colors[1] : form.colors.secondary;
        update('colors', { primary, secondary });
        updates.push('colors');
      }

      // Download a file from a URL and return as a File object
      const downloadAsFile = async (url: string, name: string): Promise<File | null> => {
        try {
          const r = await fetch(url);
          if (!r.ok) return null;
          const blob = await r.blob();
          if (blob.size < 100) return null;
          const isSvg = blob.type.includes('svg') || url.endsWith('.svg');
          const ext = isSvg ? 'svg' : blob.type.includes('png') ? 'png' : 'png';
          return new File([blob], `${name}.${ext}`, { type: isSvg ? 'image/svg+xml' : (blob.type || 'image/png') });
        } catch {
          return null;
        }
      };

      // Create a white/reverse version of an SVG for dark backgrounds
      // Create a white/reverse version of a logo for dark backgrounds
      const createReverselogo = async (file: File): Promise<File | null> => {
        try {
          const isSvg = file.name.endsWith('.svg') || file.type === 'image/svg+xml';

          if (isSvg) {
            const text = await file.text();
            // Helper: check if a hex color is "dark" (brightness < 50%)
            const isDarkHex = (hex: string) => {
              const h = hex.replace('#', '');
              const full = h.length === 3
                ? h[0]+h[0]+h[1]+h[1]+h[2]+h[2]
                : h.slice(0, 6);
              const r = parseInt(full.slice(0, 2), 16);
              const g = parseInt(full.slice(2, 4), 16);
              const b = parseInt(full.slice(4, 6), 16);
              return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
            };

            // Replace dark hex fills/strokes with white
            let reversed = text.replace(
              /(fill|stroke)\s*=\s*"(#[0-9a-fA-F]{3,6})"/gi,
              (match, attr, hex) => isDarkHex(hex) ? `${attr}="#FFFFFF"` : match,
            );
            // CSS style fill/stroke
            reversed = reversed.replace(
              /(fill|stroke)\s*:\s*(#[0-9a-fA-F]{3,6})/gi,
              (match, attr, hex) => isDarkHex(hex) ? `${attr}:#FFFFFF` : match,
            );
            // rgb(...) dark values
            reversed = reversed.replace(
              /(fill|stroke)\s*[:=]\s*"?rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)"?/gi,
              (match, attr, r, g, b) => {
                const brightness = parseInt(r) * 0.299 + parseInt(g) * 0.587 + parseInt(b) * 0.114;
                return brightness < 128 ? `${attr}="#FFFFFF"` : match;
              },
            );
            // If SVG has no explicit fill and uses currentColor or inherits black, add fill="white" to root
            if (!text.includes('fill=') && !text.includes('fill:')) {
              reversed = reversed.replace(/<svg/, '<svg fill="#FFFFFF"');
            }
            return new File([reversed], file.name.replace(/\.svg$/i, '-reverse.svg'), { type: 'image/svg+xml' });
          }

          // For raster images (PNG, JPG): use canvas to make dark pixels white
          return new Promise<File | null>((resolve) => {
            const img = new window.Image();
            const url = URL.createObjectURL(file);
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              const ctx = canvas.getContext('2d');
              if (!ctx) { resolve(null); URL.revokeObjectURL(url); return; }

              ctx.drawImage(img, 0, 0);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const px = imageData.data;

              for (let i = 0; i < px.length; i += 4) {
                const a = px[i + 3];
                if (a < 10) continue; // skip fully transparent
                const brightness = px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114;
                if (brightness < 160) {
                  // Dark pixel -> make white, keep alpha
                  px[i] = 255;
                  px[i + 1] = 255;
                  px[i + 2] = 255;
                }
              }

              ctx.putImageData(imageData, 0, 0);
              canvas.toBlob((blob) => {
                if (!blob) { resolve(null); URL.revokeObjectURL(url); return; }
                resolve(new File([blob], file.name.replace(/(\.\w+)$/, '-reverse$1'), { type: 'image/png' }));
                URL.revokeObjectURL(url);
              }, 'image/png');
            };
            img.onerror = () => { resolve(null); URL.revokeObjectURL(url); };
            img.src = url;
          });
        } catch {
          return null;
        }
      };

      // Extract dominant colors from a File using canvas (for cascading colors from logo)
      const extractColorsFromFile = (file: File): Promise<{ primary: string; secondary: string } | null> => {
        return new Promise(resolve => {
          if (!file.type.startsWith('image/')) { resolve(null); return; }
          const img = new window.Image();
          const url = URL.createObjectURL(file);
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const sz = 64;
            canvas.width = sz; canvas.height = sz;
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(null); URL.revokeObjectURL(url); return; }
            ctx.drawImage(img, 0, 0, sz, sz);
            const px = ctx.getImageData(0, 0, sz, sz).data;
            const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {};
            for (let i = 0; i < px.length; i += 4) {
              const r = px[i], g = px[i+1], b = px[i+2], a = px[i+3];
              if (a < 128) continue;
              const br = (r + g + b) / 3;
              if (br > 240 || br < 15) continue;
              const qr = Math.round(r / 32) * 32, qg = Math.round(g / 32) * 32, qb = Math.round(b / 32) * 32;
              const k = `${qr},${qg},${qb}`;
              if (!buckets[k]) buckets[k] = { r: 0, g: 0, b: 0, count: 0 };
              buckets[k].r += r; buckets[k].g += g; buckets[k].b += b; buckets[k].count++;
            }
            const sorted = Object.values(buckets).sort((a, b) => b.count - a.count);
            if (sorted.length === 0) { resolve(null); URL.revokeObjectURL(url); return; }
            const p = sorted[0];
            const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
            const primary = `#${toHex(p.r/p.count)}${toHex(p.g/p.count)}${toHex(p.b/p.count)}`.toUpperCase();
            let secondary = primary;
            if (sorted.length >= 2) {
              const s = sorted[1];
              secondary = `#${toHex(s.r/s.count)}${toHex(s.g/s.count)}${toHex(s.b/s.count)}`.toUpperCase();
            }
            resolve({ primary, secondary });
            URL.revokeObjectURL(url);
          };
          img.onerror = () => { resolve(null); URL.revokeObjectURL(url); };
          img.src = url;
        });
      };

      setExtractStatus('Downloading logos...');

      const newLogos = { ...form.logos };
      let mainLogoFile: File | null = null;

      // Main logo -> light background version, and create reverse for dark bg
      if (data.logos?.main) {
        mainLogoFile = await downloadAsFile(data.logos.main, 'logo');
        if (mainLogoFile) {
          if (!newLogos.light) newLogos.light = mainLogoFile;
          // Auto-generate a white/reverse version for dark backgrounds
          setExtractStatus('Generating reverse logo...');
          const reverse = await createReverselogo(mainLogoFile);
          if (reverse) {
            newLogos.dark = reverse;
          } else {
            if (!newLogos.dark) newLogos.dark = mainLogoFile;
          }
          updates.push('logo');
        }
      }

      // Icon
      if (data.logos?.icon) {
        const iconFile = await downloadAsFile(data.logos.icon, 'icon');
        if (iconFile && !newLogos.icon) {
          newLogos.icon = iconFile;
          updates.push('icon');
        }
      }

      if (newLogos.dark || newLogos.light || newLogos.icon) {
        setForm(prev => ({ ...prev, logos: newLogos }));
      }

      // Cascade: if no colors from meta tags, extract from the downloaded logo
      if (data.colors.length === 0 && mainLogoFile) {
        setExtractStatus('Extracting colors from logo...');
        const logoColors = await extractColorsFromFile(mainLogoFile);
        if (logoColors) {
          update('colors', logoColors);
          updates.push('colors');
        }
      }

      if (updates.length > 0) {
        setExtractStatus(`Extracted ${updates.join(', ')}`);
      } else {
        setExtractStatus('No brand assets found');
      }
      setTimeout(() => setExtractStatus(null), 3000);
    } catch (err) {
      console.error('URL extraction failed:', err);
      setExtractStatus('Extraction failed');
      setTimeout(() => setExtractStatus(null), 3000);
    } finally {
      setExtractingUrl(false);
    }
  }, [form.websiteUrl, form.colors.secondary, form.logos, update]);

  // Auto-generate slug + password from company name + template name
  useEffect(() => {
    if (form.companyName) {
      setForm(prev => {
        const base = prev.templateName
          ? `${slugify(prev.companyName)}-${slugify(prev.templateName)}`
          : slugify(prev.companyName);
        return {
          ...prev,
          password: `${slugify(prev.companyName)}2026`,
          slug: prev.slugEdited ? prev.slug : base,
        };
      });
    }
  }, [form.companyName, form.templateName]);

  const setLogo = (slot: 'dark' | 'light' | 'icon', files: File[]) => {
    setForm(prev => ({ ...prev, logos: { ...prev.logos, [slot]: files[0] || null } }));
  };

  const addLink = () => {
    setForm(prev => ({ ...prev, quickLinks: [...prev.quickLinks, { label: '', url: '' }] }));
  };

  const removeLink = (index: number) => {
    setForm(prev => ({ ...prev, quickLinks: prev.quickLinks.filter((_, i) => i !== index) }));
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    setForm(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map((link, i) => i === index ? { ...link, [field]: value } : link),
    }));
  };

  const handleSubmit = async () => {
    if (!form.companyName.trim()) return;
    setSubmitting(true);

    try {
      const formData = new FormData();

      const intake = {
        companyName: form.companyName,
        templateName: form.templateName,
        solutionType: form.solutionType,
        industry: form.industry,
        websiteUrl: form.websiteUrl,
        slug: form.slug || slugify(form.companyName),
        colors: form.colors,
        password: form.password || `${slugify(form.companyName)}2026`,
        screensaver: form.screensaver,
        calculator: form.calculator,
        quickLinks: form.quickLinks.filter(l => l.label && l.url),
      };
      formData.append('data', JSON.stringify(intake));

      if (form.logos.dark) formData.append('logo-dark', form.logos.dark);
      if (form.logos.light) formData.append('logo-light', form.logos.light);
      if (form.logos.icon) formData.append('logo-icon', form.logos.icon);

      form.contentFiles.forEach((file, i) => {
        formData.append(`content-${i}`, file);
      });

      await fetch('/api/explorer/intake', { method: 'POST', body: formData });
      setSubmitted(true);
    } catch (err) {
      console.error('Intake submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center', maxWidth: 420, padding: '0 24px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.accentSoft, border: `1px solid rgba(0,187,165,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Sparkles style={{ width: 24, height: 24, color: T.accent }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 500, color: T.text1, marginBottom: 8 }}>Explorer Intake Saved</h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: T.text2, marginBottom: 24, lineHeight: 1.6 }}>
            The intake data for <strong style={{ color: T.accent }}>{form.companyName}</strong> has been saved. Run the <code style={{ background: 'rgba(6,19,65,0.05)', padding: '2px 6px', borderRadius: 4, fontSize: 13, color: T.text1 }}>momentify-explorer</code> skill in Claude Code to generate the full prototype.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={() => { setSubmitted(false); setForm({ companyName: '', templateName: '', slug: '', slugEdited: false, solutionType: '', industry: '', websiteUrl: '', contentFiles: [], logos: { dark: null, light: null, icon: null }, colors: { primary: '#0CF4DF', secondary: '#254FE5' }, password: '', screensaver: { enabled: false, url: '' }, calculator: { enabled: false, url: '' }, quickLinks: [] }); }}
              style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid ${T.border}`, background: 'transparent', color: T.text2, fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}
            >
              Create Another
            </button>
            <a
              href="/prototypes/explorer"
              style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #00BBA5, #1A56DB)', color: '#fff', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              View Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ background: T.headerBg, borderBottom: `1px solid ${T.headerBorder}`, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/assets/Momentify-Icon.svg" alt="Momentify" style={{ height: 28 }} />
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 500, color: T.text1, margin: 0 }}>Momentify Explorer &ndash; Prototype Builder</h1>
            <p style={{ fontSize: 12, fontWeight: 300, color: T.text3, margin: 0 }}>Provide the basics and AI generates the rest</p>
          </div>
        </div>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            border: `1px solid ${T.border}`,
            background: 'transparent',
            color: T.text3,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon style={{ width: 16, height: 16 }} /> : <Sun style={{ width: 16, height: 16 }} />}
        </button>
      </header>

      {/* Form */}
      <main style={{ maxWidth: 620, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── Company Info ────────────────────────── */}
        <Section label="Company Info" t={T}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InputField
              label="Company Name"
              required
              value={form.companyName}
              onChange={(v) => update('companyName', v)}
              placeholder="Acme Corp"
              t={T}
            />
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 400, color: T.text3, marginBottom: 6 }}>Solution Type</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.solutionType}
                  onChange={(e) => update('solutionType', e.target.value as SolutionType)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    paddingRight: 32,
                    borderRadius: 10,
                    border: `1px solid ${T.inputBorder}`,
                    background: T.inputBg,
                    color: form.solutionType ? T.inputText : T.text3,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box' as const,
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" style={{ color: T.text3 }}>Select solution...</option>
                  {SOLUTION_TYPES.map(s => (
                    <option key={s.value} value={s.value} disabled={s.disabled} style={{ color: s.disabled ? T.text3 : T.inputText }}>
                      {s.label}{s.disabled ? ' (coming soon)' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: T.text3, pointerEvents: 'none' }} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 400, color: T.text3, marginBottom: 6 }}>Industry</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.industry}
                  onChange={(e) => update('industry', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    paddingRight: 32,
                    borderRadius: 10,
                    border: `1px solid ${T.inputBorder}`,
                    background: T.inputBg,
                    color: form.industry ? T.inputText : T.text3,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box' as const,
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" style={{ color: T.text3 }}>Select industry...</option>
                  {INDUSTRIES.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <ChevronDown style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: T.text3, pointerEvents: 'none' }} />
              </div>
            </div>
          </div>
        </Section>

        {/* ── Template Name ────────────────────────── */}
        <Section label="Template Name" t={T}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InputField
              label="Template Name"
              value={form.templateName}
              onChange={(v) => update('templateName', v)}
              placeholder="e.g. CONEXPO 2026"
              t={T}
            />
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 400, color: T.text3, marginBottom: 6 }}>URL Slug</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 13,
                  color: T.text3,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}>
                  /explorer/
                </div>
                <input
                  value={form.slug}
                  onChange={(e) => {
                    const v = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                    setForm(prev => ({ ...prev, slug: v, slugEdited: true }));
                  }}
                  placeholder={slugify(form.companyName) || 'company-template'}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    paddingLeft: 86,
                    borderRadius: 10,
                    border: `1px solid ${T.inputBorder}`,
                    background: T.inputBg,
                    color: T.inputText,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box' as const,
                  }}
                />
              </div>
              {form.slugEdited && (
                <button
                  onClick={() => setForm(prev => {
                    const base = prev.templateName
                      ? `${slugify(prev.companyName)}-${slugify(prev.templateName)}`
                      : slugify(prev.companyName);
                    return { ...prev, slug: base, slugEdited: false };
                  })}
                  style={{ background: 'none', border: 'none', color: T.accent, fontSize: 11, cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit' }}
                >
                  Reset to auto
                </button>
              )}
            </div>
          </div>
        </Section>

        {/* ── Content Source ──────────────────────── */}
        <Section label="Content Source" hint="Paste a website URL, upload files, or both. AI will extract content to build traits and results cards." t={T}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <InputField
                label="Website URL"
                value={form.websiteUrl}
                onChange={(v) => update('websiteUrl', v)}
                placeholder="https://www.example.com"
                t={T}
              />
            </div>
            {form.websiteUrl.trim() && (
              <button
                onClick={extractFromUrl}
                disabled={extractingUrl}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  background: T.accentSoft,
                  color: T.accent,
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  cursor: extractingUrl ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  height: 42,
                }}
              >
                {extractingUrl
                  ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 0.8s linear infinite' }} />
                  : <Globe style={{ width: 14, height: 14 }} />}
                {extractingUrl ? 'Extracting...' : 'Extract Brand'}
              </button>
            )}
          </div>
          {extractStatus && (
            <div style={{ marginTop: 8, fontSize: 12, color: extractingUrl ? T.text3 : T.accent, display: 'flex', alignItems: 'center', gap: 6 }}>
              {extractStatus}
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 400, color: T.text3, marginBottom: 6 }}>Upload Files</label>
            <IntakeDropZone
              accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.png,.jpg,.jpeg"
              multiple
              files={form.contentFiles}
              onChange={(files) => update('contentFiles', files)}
              label="Drop PDFs, docs, spreadsheets, or images"
              hint="Supports PDF, DOCX, XLSX, CSV, PNG, JPG"
              light={T.dropLight}
            />
          </div>
        </Section>

        {/* ── Logos ───────────────────────────────── */}
        <Section label="Logos" hint="Upload logo variants. SVG or PNG recommended." t={T}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 400, color: T.text3, marginBottom: 6, textAlign: 'center' }}>Dark Background</label>
              <IntakeDropZone
                accept="image/*"
                files={form.logos.dark ? [form.logos.dark] : []}
                onChange={(f) => setLogo('dark', f)}
                label="Logo (reverse)"
                preview
                compact
                light={T.dropLight}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 400, color: T.text3, marginBottom: 6, textAlign: 'center' }}>Light Background</label>
              <IntakeDropZone
                accept="image/*"
                files={form.logos.light ? [form.logos.light] : []}
                onChange={(f) => setLogo('light', f)}
                label="Logo (dark)"
                preview
                compact
                light={T.dropLight}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 400, color: T.text3, marginBottom: 6, textAlign: 'center' }}>Square Icon</label>
              <IntakeDropZone
                accept="image/*"
                files={form.logos.icon ? [form.logos.icon] : []}
                onChange={(f) => setLogo('icon', f)}
                label="Icon"
                preview
                compact
                light={T.dropLight}
              />
            </div>
          </div>
        </Section>

        {/* ── Brand Colors ───────────────────────── */}
        <Section label="Brand Colors" hint="Pick primary and secondary. All theme colors are derived automatically." t={T}>
          {(form.logos.light || form.logos.dark || form.logos.icon) && (
            <button
              onClick={extractColorsFromLogo}
              disabled={extracting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: T.accentSoft,
                color: T.accent,
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: extracting ? 'wait' : 'pointer',
                marginBottom: 14,
                transition: 'all 0.2s',
              }}
            >
              <Pipette style={{ width: 13, height: 13 }} />
              {extracting ? 'Extracting...' : 'Extract from Logo'}
            </button>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <ColorPickerField
              label="Primary"
              color={form.colors.primary}
              onChange={(c) => update('colors', { ...form.colors, primary: c })}
              isOpen={activeColorPicker === 'primary'}
              onToggle={() => setActiveColorPicker(activeColorPicker === 'primary' ? null : 'primary')}
              t={T}
            />
            <ColorPickerField
              label="Secondary"
              color={form.colors.secondary}
              onChange={(c) => update('colors', { ...form.colors, secondary: c })}
              isOpen={activeColorPicker === 'secondary'}
              onToggle={() => setActiveColorPicker(activeColorPicker === 'secondary' ? null : 'secondary')}
              t={T}
            />
          </div>
        </Section>

        {/* ── Password ───────────────────────────── */}
        <Section label="Password" t={T}>
          <div style={{ position: 'relative' }}>
            <InputField
              label=""
              value={form.password}
              onChange={(v) => update('password', v)}
              placeholder="Auto-generated"
              t={T}
            />
            {form.password && form.password === `${slugify(form.companyName)}2026` && (
              <span style={{ position: 'absolute', top: 10, right: 12, fontSize: 10, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Auto
              </span>
            )}
          </div>
        </Section>

        {/* ── Optional Settings ──────────────────── */}
        <div style={{ marginTop: 36 }}>
          <button
            onClick={() => setShowOptional(!showOptional)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              color: T.text3,
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: 0,
            }}
          >
            <ChevronDown style={{ width: 14, height: 14, transition: 'transform 0.2s', transform: showOptional ? 'rotate(180deg)' : 'rotate(0)' }} />
            Optional Settings
          </button>

          {showOptional && (
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Screensaver */}
              <ToggleRow
                icon={<MonitorPlay style={{ width: 16, height: 16 }} />}
                label="Screensaver"
                hint="Idle video or image on the welcome screen"
                enabled={form.screensaver.enabled}
                onToggle={() => update('screensaver', { ...form.screensaver, enabled: !form.screensaver.enabled })}
                t={T}
              >
                {form.screensaver.enabled && (
                  <InputField
                    label="Screensaver URL"
                    value={form.screensaver.url}
                    onChange={(v) => update('screensaver', { ...form.screensaver, url: v })}
                    placeholder="https://youtube.com/watch?v=..."
                    t={T}
                  />
                )}
              </ToggleRow>

              {/* Calculator */}
              <ToggleRow
                icon={<Calculator style={{ width: 16, height: 16 }} />}
                label="Calculator"
                hint="Opens in a popup modal. Provide a URL or request a custom build"
                enabled={form.calculator.enabled}
                onToggle={() => update('calculator', { ...form.calculator, enabled: !form.calculator.enabled })}
                t={T}
              >
                {form.calculator.enabled && (
                  <InputField
                    label="Calculator Embed URL"
                    value={form.calculator.url}
                    onChange={(v) => update('calculator', { ...form.calculator, url: v })}
                    placeholder="https://example.com/calculator or 'build custom'"
                    t={T}
                  />
                )}
              </ToggleRow>

              {/* Quick Links */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Link2 style={{ width: 16, height: 16, color: T.text3 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: T.text2 }}>Quick Links</span>
                  <span style={{ fontSize: 11, color: T.text3 }}>Optional external links</span>
                </div>
                {form.quickLinks.map((link, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: 8, marginBottom: 8 }}>
                    <input
                      value={link.label}
                      onChange={(e) => updateLink(i, 'label', e.target.value)}
                      placeholder="Label"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.inputBorder}`, background: T.inputBg, color: T.inputText, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
                    />
                    <input
                      value={link.url}
                      onChange={(e) => updateLink(i, 'url', e.target.value)}
                      placeholder="https://..."
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.inputBorder}`, background: T.inputBg, color: T.inputText, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
                    />
                    <button
                      onClick={() => removeLink(i)}
                      style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, color: T.text3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addLink}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: `1px dashed ${T.border}`, borderRadius: 8, padding: '8px 14px', color: T.text3, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', width: '100%', justifyContent: 'center' }}
                >
                  <Plus style={{ width: 14, height: 14 }} />
                  Add Link
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Submit ─────────────────────────────── */}
        <button
          onClick={handleSubmit}
          disabled={!form.companyName.trim() || submitting}
          style={{
            marginTop: 48,
            width: '100%',
            padding: '16px 24px',
            borderRadius: 12,
            border: 'none',
            background: form.companyName.trim() ? 'linear-gradient(135deg, #00BBA5, #1A56DB)' : 'rgba(6,19,65,0.06)',
            color: form.companyName.trim() ? '#fff' : T.text3,
            fontSize: 16,
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: form.companyName.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'all 0.2s',
          }}
        >
          {submitting ? (
            <>
              <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              Saving...
            </>
          ) : (
            <>
              <Sparkles style={{ width: 18, height: 18 }} />
              Save Intake
            </>
          )}
        </button>
      </main>

      {/* Spinner animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Sub-components (accept theme tokens via `t` prop) ──

type ThemeTokens = (typeof THEMES)[Theme];

function Section({ label, hint, children, t }: { label: string; hint?: string; children: React.ReactNode; t: ThemeTokens }) {
  return (
    <div style={{ marginTop: 36 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        {label}
      </div>
      {hint && (
        <p style={{ fontSize: 13, fontWeight: 300, color: t.text3, marginBottom: 14, lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, required, t }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; required?: boolean; t: ThemeTokens;
}) {
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 400, color: t.text3, marginBottom: 6 }}>{label}{required && <span style={{ color: t.accent }}> *</span>}</label>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
      />
    </div>
  );
}

function ColorPickerField({ label, color, onChange, isOpen, onToggle, t }: {
  label: string; color: string; onChange: (c: string) => void; isOpen: boolean; onToggle: () => void; t: ThemeTokens;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 400, color: t.text3, marginBottom: 6 }}>{label}</label>
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '10px 14px',
          borderRadius: 10,
          border: `1px solid ${isOpen ? t.borderFocus : t.inputBorder}`,
          background: t.inputBg,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ width: 24, height: 24, borderRadius: 6, background: color, border: `1px solid ${t.border}`, flexShrink: 0 }} />
        <span style={{ fontSize: 14, color: t.text2, fontFamily: 'monospace' }}>{color}</span>
      </button>
      {isOpen && (
        <div style={{ marginTop: 10 }}>
          <HexColorPicker color={color} onChange={onChange} style={{ width: '100%', height: 140 }} />
          <input
            value={color}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
            }}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: 14, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' as const, marginTop: 8, textAlign: 'center' as const }}
          />
        </div>
      )}
    </div>
  );
}

function ToggleRow({ icon, label, hint, enabled, onToggle, children, t }: {
  icon: React.ReactNode; label: string; hint: string; enabled: boolean; onToggle: () => void; children?: React.ReactNode; t: ThemeTokens;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: t.text3 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: t.text2 }}>{label}</div>
          <div style={{ fontSize: 11, color: t.text3 }}>{hint}</div>
        </div>
        <button
          onClick={onToggle}
          style={{
            width: 40,
            height: 22,
            borderRadius: 11,
            border: 'none',
            background: enabled ? t.accent : t.toggleOff,
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          <div style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: 3,
            left: enabled ? 21 : 3,
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          }} />
        </button>
      </div>
      {children && <div style={{ marginTop: 10, paddingLeft: 26 }}>{children}</div>}
    </div>
  );
}
