"use client";

import { type AspectRatio, brands, getBrand } from "./backgroundData";

interface EditorControlsProps {
  brand: string;
  setBrand: (v: string) => void;
  backgroundId: string;
  setBackgroundId: (v: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (v: AspectRatio) => void;
  headline: string;
  setHeadline: (v: string) => void;
  subhead: string;
  setSubhead: (v: string) => void;
  bodyCopy: string;
  setBodyCopy: (v: string) => void;
  textPosition: "top" | "center" | "bottom";
  setTextPosition: (v: "top" | "center" | "bottom") => void;
  showLogo: boolean;
  setShowLogo: (v: boolean) => void;
  logoVariant: "auto" | "dark" | "white";
  setLogoVariant: (v: "auto" | "dark" | "white") => void;
  logoScale: number;
  setLogoScale: (v: number) => void;
  showUrl: boolean;
  setShowUrl: (v: boolean) => void;
  urlScale: number;
  setUrlScale: (v: number) => void;
  headlineFontSize: number;
  setHeadlineFontSize: (v: number) => void;
  headlineFontWeight: number;
  setHeadlineFontWeight: (v: number) => void;
  subheadFontSize: number;
  setSubheadFontSize: (v: number) => void;
  subheadFontWeight: number;
  setSubheadFontWeight: (v: number) => void;
  bodyFontSize: number;
  setBodyFontSize: (v: number) => void;
  bodyFontWeight: number;
  setBodyFontWeight: (v: number) => void;
  onDownload: () => void;
  onSave: () => void;
  onClear: () => void;
  downloading: boolean;
}

const RATIOS: AspectRatio[] = ["1:1", "16:9", "9:16", "4:5", "1.91:1"];
const RATIO_LABELS: Record<AspectRatio, string> = {
  "1:1": "1:1 Square",
  "16:9": "16:9 Landscape",
  "9:16": "9:16 Story",
  "4:5": "4:5 Portrait",
  "1.91:1": "1.91:1 Link",
};

const POSITIONS = ["top", "center", "bottom"] as const;
const LOGO_VARIANTS = ["auto", "dark", "white"] as const;
const WEIGHT_OPTIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-charcoal/40 mb-2">
      {children}
    </label>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-charcoal/40 w-10 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 accent-teal"
      />
      <span className="text-[11px] text-charcoal/40 w-12 text-right tabular-nums">
        {value}{suffix}
      </span>
    </div>
  );
}

function WeightSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="px-2 py-1 rounded border border-charcoal/10 bg-white text-charcoal text-[11px] focus:outline-none focus:border-teal/40 transition-all"
    >
      {WEIGHT_OPTIONS.map((w) => (
        <option key={w} value={w}>
          {w}
        </option>
      ))}
    </select>
  );
}

export default function EditorControls({
  brand,
  setBrand,
  backgroundId,
  setBackgroundId,
  aspectRatio,
  setAspectRatio,
  headline,
  setHeadline,
  subhead,
  setSubhead,
  bodyCopy,
  setBodyCopy,
  textPosition,
  setTextPosition,
  showLogo,
  setShowLogo,
  logoVariant,
  setLogoVariant,
  logoScale,
  setLogoScale,
  showUrl,
  setShowUrl,
  urlScale,
  setUrlScale,
  headlineFontSize,
  setHeadlineFontSize,
  headlineFontWeight,
  setHeadlineFontWeight,
  subheadFontSize,
  setSubheadFontSize,
  subheadFontWeight,
  setSubheadFontWeight,
  bodyFontSize,
  setBodyFontSize,
  bodyFontWeight,
  setBodyFontWeight,
  onDownload,
  onSave,
  onClear,
  downloading,
}: EditorControlsProps) {
  const currentBrand = getBrand(brand);

  return (
    <div className="space-y-6">
      {/* Aspect Ratio */}
      <div>
        <SectionLabel>Aspect Ratio</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {RATIOS.map((r) => (
            <button
              key={r}
              onClick={() => setAspectRatio(r)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                aspectRatio === r
                  ? "bg-teal text-white"
                  : "bg-charcoal/[0.04] text-charcoal/50 hover:bg-charcoal/[0.08]"
              }`}
            >
              {RATIO_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Selector */}
      <div>
        <SectionLabel>Brand</SectionLabel>
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            const newBrand = getBrand(e.target.value);
            setBackgroundId(newBrand.backgrounds[0].id);
          }}
          className="w-full px-3 py-2 rounded-lg border border-charcoal/10 bg-white text-charcoal text-[13px] font-medium focus:outline-none focus:border-teal/40 focus:ring-2 focus:ring-teal/10 transition-all"
        >
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {/* Background Picker */}
      <div>
        <SectionLabel>Background</SectionLabel>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {currentBrand.backgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => setBackgroundId(bg.id)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg relative overflow-hidden transition-all ${
                backgroundId === bg.id
                  ? "ring-2 ring-teal ring-offset-2"
                  : "ring-1 ring-charcoal/10 hover:ring-charcoal/25"
              }`}
              title={bg.label}
            >
              <div
                className="absolute inset-0"
                style={{ background: bg.gradient }}
              />
              {bg.colorBar && (
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: bg.colorBar }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Headline */}
      <div>
        <SectionLabel>Headline</SectionLabel>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Your headline here"
          className="w-full px-3 py-2 rounded-lg border border-charcoal/10 bg-white text-charcoal text-[14px] placeholder:text-charcoal/25 focus:outline-none focus:border-teal/40 focus:ring-2 focus:ring-teal/10 transition-all"
        />
        <div className="mt-2 space-y-1.5">
          <SliderRow label="Size" value={headlineFontSize} min={24} max={128} step={2} onChange={setHeadlineFontSize} suffix="px" />
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-charcoal/40 w-10 shrink-0">Weight</span>
            <WeightSelect value={headlineFontWeight} onChange={setHeadlineFontWeight} />
          </div>
        </div>
      </div>

      {/* Subhead */}
      <div>
        <SectionLabel>Subhead</SectionLabel>
        <input
          type="text"
          value={subhead}
          onChange={(e) => setSubhead(e.target.value)}
          placeholder="Supporting text"
          className="w-full px-3 py-2 rounded-lg border border-charcoal/10 bg-white text-charcoal text-[14px] placeholder:text-charcoal/25 focus:outline-none focus:border-teal/40 focus:ring-2 focus:ring-teal/10 transition-all"
        />
        <div className="mt-2 space-y-1.5">
          <SliderRow label="Size" value={subheadFontSize} min={14} max={64} step={1} onChange={setSubheadFontSize} suffix="px" />
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-charcoal/40 w-10 shrink-0">Weight</span>
            <WeightSelect value={subheadFontWeight} onChange={setSubheadFontWeight} />
          </div>
        </div>
      </div>

      {/* Body Copy */}
      <div>
        <SectionLabel>Body Copy</SectionLabel>
        <textarea
          value={bodyCopy}
          onChange={(e) => setBodyCopy(e.target.value)}
          placeholder="Additional details or call to action"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-charcoal/10 bg-white text-charcoal text-[14px] placeholder:text-charcoal/25 focus:outline-none focus:border-teal/40 focus:ring-2 focus:ring-teal/10 transition-all resize-none"
        />
        <div className="mt-2 space-y-1.5">
          <SliderRow label="Size" value={bodyFontSize} min={10} max={40} step={1} onChange={setBodyFontSize} suffix="px" />
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-charcoal/40 w-10 shrink-0">Weight</span>
            <WeightSelect value={bodyFontWeight} onChange={setBodyFontWeight} />
          </div>
        </div>
      </div>

      {/* Text Position */}
      <div>
        <SectionLabel>Text Position</SectionLabel>
        <div className="flex gap-1.5">
          {POSITIONS.map((p) => (
            <button
              key={p}
              onClick={() => setTextPosition(p)}
              className={`flex-1 px-3 py-1.5 rounded-md text-[12px] font-medium capitalize transition-all ${
                textPosition === p
                  ? "bg-teal text-white"
                  : "bg-charcoal/[0.04] text-charcoal/50 hover:bg-charcoal/[0.08]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Logo Controls */}
      <div>
        <SectionLabel>Logo</SectionLabel>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogo(!showLogo)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                showLogo ? "bg-teal" : "bg-charcoal/15"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  showLogo ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
            <span className="text-[13px] text-charcoal/60 font-medium">Show logo</span>
          </div>
          {showLogo && (
            <>
              <div className="flex gap-1.5">
                {LOGO_VARIANTS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setLogoVariant(v)}
                    className={`flex-1 px-3 py-1.5 rounded-md text-[12px] font-medium capitalize transition-all ${
                      logoVariant === v
                        ? "bg-teal text-white"
                        : "bg-charcoal/[0.04] text-charcoal/50 hover:bg-charcoal/[0.08]"
                    }`}
                  >
                    {v === "auto" ? "Auto" : v === "dark" ? "Dark" : "White"}
                  </button>
                ))}
              </div>
              <SliderRow label="Size" value={logoScale} min={30} max={250} step={5} onChange={setLogoScale} suffix="%" />
            </>
          )}
        </div>
      </div>

      {/* URL Controls */}
      <div>
        <SectionLabel>URL Watermark</SectionLabel>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUrl(!showUrl)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                showUrl ? "bg-teal" : "bg-charcoal/15"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  showUrl ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
            <span className="text-[13px] text-charcoal/60 font-medium">Show URL</span>
          </div>
          {showUrl && (
            <SliderRow label="Size" value={urlScale} min={30} max={250} step={5} onChange={setUrlScale} suffix="%" />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <div className="flex gap-3">
          <button
            onClick={onDownload}
            disabled={downloading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-action-gradient text-white text-[13px] font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
          >
            {downloading ? "Exporting..." : "Download PNG"}
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2.5 rounded-lg border border-charcoal/10 text-charcoal/60 text-[13px] font-medium hover:bg-charcoal/[0.04] transition-all"
          >
            Save to Library
          </button>
        </div>
        <button
          onClick={onClear}
          className="w-full px-4 py-2 rounded-lg text-charcoal/30 text-[12px] font-medium hover:text-charcoal/50 hover:bg-charcoal/[0.04] transition-all"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
