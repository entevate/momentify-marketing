"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import CanvasEditor from "./CanvasEditor";
import EditorControls from "./EditorControls";
import CaptionGenerator from "./CaptionGenerator";
import AssetLibrary, { type SavedAsset } from "./AssetLibrary";
import { type AspectRatio, getBrand, getBackground, ASPECT_DIMENSIONS } from "./backgroundData";

const STORAGE_KEY = "momentify_asset_library";
const THEME_KEY = "mk-theme";

/* Moon icon for dark mode toggle */
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
    </svg>
  );
}

/* Sun icon for light mode toggle */
function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

/* Back arrow icon */
function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2L4 7l5 5" />
    </svg>
  );
}

/* Dark/light theme tokens */
const darkTokens = {
  "--bk-bg": "#07081F",
  "--bk-surface": "#0F1035",
  "--bk-border": "rgba(12,244,223,0.12)",
  "--bk-text": "#FFFFFF",
  "--bk-text-muted": "rgba(255,255,255,0.45)",
  "--bk-accent": "#0CF4DF",
  "--bk-header-bg": "rgba(7,8,31,0.94)",
  "--bk-toggle-bg": "rgba(255,255,255,0.1)",
  "--bk-toggle-border": "rgba(255,255,255,0.18)",
  "--bk-toggle-text": "rgba(255,255,255,0.8)",
} as Record<string, string>;

const lightTokens = {
  "--bk-bg": "#F4F5FA",
  "--bk-surface": "#FFFFFF",
  "--bk-border": "rgba(31,51,149,0.12)",
  "--bk-text": "#0B0B3C",
  "--bk-text-muted": "rgba(11,11,60,0.48)",
  "--bk-accent": "#1F3395",
  "--bk-header-bg": "rgba(244,245,250,0.96)",
  "--bk-toggle-bg": "rgba(11,11,60,0.06)",
  "--bk-toggle-border": "rgba(11,11,60,0.14)",
  "--bk-toggle-text": "rgba(11,11,60,0.7)",
} as Record<string, string>;

export default function SocialToolkitContent() {
  // Theme state
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Read saved theme from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") setTheme(saved);
    } catch { /* ignore */ }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const tokens = theme === "dark" ? darkTokens : lightTokens;

  // Editor state
  const [brand, setBrand] = useState("momentify");
  const [backgroundId, setBackgroundId] = useState("main-minimal");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [headline, setHeadline] = useState("");
  const [subhead, setSubhead] = useState("");
  const [bodyCopy, setBodyCopy] = useState("");
  const [textPosition, setTextPosition] = useState<"top" | "center" | "bottom">("center");
  const [showLogo, setShowLogo] = useState(true);
  const [logoVariant, setLogoVariant] = useState<"auto" | "dark" | "white" | "all-white">("auto");
  const [logoScale, setLogoScale] = useState(100);
  const [showUrl, setShowUrl] = useState(true);
  const [urlScale, setUrlScale] = useState(100);
  const [headlineFontSize, setHeadlineFontSize] = useState(64);
  const [headlineFontWeight, setHeadlineFontWeight] = useState(500);
  const [subheadFontSize, setSubheadFontSize] = useState(32);
  const [subheadFontWeight, setSubheadFontWeight] = useState(300);
  const [bodyFontSize, setBodyFontSize] = useState(20);
  const [bodyFontWeight, setBodyFontWeight] = useState(300);
  const [headlineAlign, setHeadlineAlign] = useState<"left" | "center" | "right">("left");
  const [subheadAlign, setSubheadAlign] = useState<"left" | "center" | "right">("left");
  const [bodyAlign, setBodyAlign] = useState<"left" | "center" | "right">("left");
  const [layoutMargin, setLayoutMargin] = useState(60);
  const [downloading, setDownloading] = useState(false);

  // Caption state
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  // Library state
  const [assets, setAssets] = useState<SavedAsset[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Load assets from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setAssets(JSON.parse(stored));
    } catch {
      // Ignore corrupt data
    }
  }, []);

  // Persist assets to localStorage
  const persistAssets = useCallback((newAssets: SavedAsset[]) => {
    setAssets(newAssets);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAssets));
    } catch {
      // localStorage quota exceeded
    }
  }, []);

  const currentBrand = getBrand(brand);
  const currentBg = getBackground(brand, backgroundId);
  const dims = ASPECT_DIMENSIONS[aspectRatio];

  // Download PNG
  const handleDownload = useCallback(async () => {
    const el = canvasRef.current;
    if (!el) return;
    setDownloading(true);
    try {
      await document.fonts.ready;

      // Temporarily remove CSS transform/scale so html2canvas captures at full size
      const prevTransform = el.style.transform;
      const prevTransformOrigin = el.style.transformOrigin;
      el.style.transform = "none";
      el.style.transformOrigin = "";

      // Also temporarily neutralize site-wide zoom on <html>
      const htmlEl = document.documentElement;
      const prevZoom = htmlEl.style.zoom;
      htmlEl.style.zoom = "1";

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        width: dims.w,
        height: dims.h,
      });

      // Restore transform and zoom
      el.style.transform = prevTransform;
      el.style.transformOrigin = prevTransformOrigin;
      htmlEl.style.zoom = prevZoom;

      const link = document.createElement("a");
      const slug = (headline || "momentify").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
      link.download = `momentify-${slug}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  }, [dims, headline]);

  // Save to library
  const handleSave = useCallback(async () => {
    const el = canvasRef.current;
    if (!el) return;
    try {
      await document.fonts.ready;

      // Temporarily remove CSS transform/scale so html2canvas captures correctly
      const prevTransform = el.style.transform;
      const prevTransformOrigin = el.style.transformOrigin;
      el.style.transform = "none";
      el.style.transformOrigin = "";
      const htmlEl = document.documentElement;
      const prevZoom = htmlEl.style.zoom;
      htmlEl.style.zoom = "1";

      const canvas = await html2canvas(el, {
        scale: 0.25,
        useCORS: true,
        backgroundColor: null,
        width: dims.w,
        height: dims.h,
      });
      const thumbnail = canvas.toDataURL("image/jpeg", 0.6);
      const now = new Date().toISOString();
      const newAsset: SavedAsset = {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        thumbnail,
        brand,
        backgroundId,
        aspectRatio,
        headline,
        subhead,
        bodyCopy,
        textPosition,
        showLogo,
        logoVariant,
        logoScale,
        showUrl,
        urlScale,
        headlineFontSize,
        headlineFontWeight,
        subheadFontSize,
        subheadFontWeight,
        bodyFontSize,
        bodyFontWeight,
        headlineAlign,
        subheadAlign,
        bodyAlign,
        layoutMargin,
        caption: caption || undefined,
        hashtags: hashtags.length ? hashtags : undefined,
      };
      // Restore transform and zoom
      el.style.transform = prevTransform;
      el.style.transformOrigin = prevTransformOrigin;
      htmlEl.style.zoom = prevZoom;

      persistAssets([newAsset, ...assets]);
    } catch (err) {
      console.error("Save failed:", err);
    }
  }, [dims, brand, backgroundId, aspectRatio, headline, subhead, bodyCopy, textPosition, showLogo, logoVariant, logoScale, showUrl, urlScale, headlineFontSize, headlineFontWeight, subheadFontSize, subheadFontWeight, bodyFontSize, bodyFontWeight, headlineAlign, subheadAlign, bodyAlign, layoutMargin, caption, hashtags, assets, persistAssets]);

  // Clear all fields to defaults
  const handleClear = useCallback(() => {
    setBrand("momentify");
    setBackgroundId("main-minimal");
    setAspectRatio("1:1");
    setHeadline("");
    setSubhead("");
    setBodyCopy("");
    setTextPosition("center");
    setShowLogo(true);
    setLogoVariant("auto");
    setLogoScale(100);
    setShowUrl(true);
    setUrlScale(100);
    setHeadlineFontSize(64);
    setHeadlineFontWeight(500);
    setSubheadFontSize(32);
    setSubheadFontWeight(300);
    setBodyFontSize(20);
    setBodyFontWeight(300);
    setHeadlineAlign("left");
    setSubheadAlign("left");
    setBodyAlign("left");
    setLayoutMargin(60);
    setCaption("");
    setHashtags([]);
  }, []);

  // Edit asset from library
  const handleEdit = useCallback(
    (id: string) => {
      const asset = assets.find((a) => a.id === id);
      if (!asset) return;
      setBrand(asset.brand);
      setBackgroundId(asset.backgroundId);
      setAspectRatio(asset.aspectRatio as AspectRatio);
      setHeadline(asset.headline);
      setSubhead(asset.subhead);
      setBodyCopy(asset.bodyCopy);
      setTextPosition(asset.textPosition);
      setShowLogo(asset.showLogo);
      setLogoVariant(asset.logoVariant || "auto");
      setLogoScale(asset.logoScale ?? 100);
      setShowUrl(asset.showUrl ?? true);
      setUrlScale(asset.urlScale ?? 100);
      setHeadlineFontSize(asset.headlineFontSize ?? 64);
      setHeadlineFontWeight(asset.headlineFontWeight ?? 500);
      setSubheadFontSize(asset.subheadFontSize ?? 32);
      setSubheadFontWeight(asset.subheadFontWeight ?? 300);
      setBodyFontSize(asset.bodyFontSize ?? 20);
      setBodyFontWeight(asset.bodyFontWeight ?? 300);
      setHeadlineAlign(asset.headlineAlign ?? "left");
      setSubheadAlign(asset.subheadAlign ?? "left");
      setBodyAlign(asset.bodyAlign ?? "left");
      setLayoutMargin(asset.layoutMargin ?? 60);
      if (asset.caption) setCaption(asset.caption);
      if (asset.hashtags) setHashtags(asset.hashtags);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [assets]
  );

  // Delete asset
  const handleDelete = useCallback(
    (id: string) => {
      persistAssets(assets.filter((a) => a.id !== id));
    },
    [assets, persistAssets]
  );

  return (
    <div
      style={{
        ...tokens,
        background: "var(--bk-bg)",
        color: "var(--bk-text)",
        minHeight: "100vh",
        transition: "background 0.22s ease, color 0.22s ease",
        fontFamily: "'Inter', sans-serif",
      } as React.CSSProperties}
    >
      {/* Sticky Page Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--bk-header-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--bk-border)",
          transition: "background 0.22s ease, border-color 0.22s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 32px",
            height: 60,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <a
            href="/brand/index.html"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--bk-text-muted)",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            <BackIcon />
            Brand Kit
          </a>
          <div style={{ width: 1, height: 20, background: "var(--bk-border)", flexShrink: 0 }} />
          <nav style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, minWidth: 0 }}>
            <a
              href="/brand/backgrounds.html"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--bk-text-muted)",
                textDecoration: "none",
                padding: "6px 10px",
                borderRadius: 6,
                whiteSpace: "nowrap",
              }}
            >
              Backgrounds
            </a>
            <a
              href="/brand/design-system.html"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--bk-text-muted)",
                textDecoration: "none",
                padding: "6px 10px",
                borderRadius: 6,
                whiteSpace: "nowrap",
              }}
            >
              Design System
            </a>
            <a
              href="/social-toolkit"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--bk-accent)",
                textDecoration: "none",
                padding: "6px 10px",
                borderRadius: 6,
                whiteSpace: "nowrap",
              }}
            >
              Social Toolkit
            </a>
          </nav>
          <button
            onClick={toggleTheme}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "var(--bk-toggle-bg)",
              border: "1px solid var(--bk-toggle-border)",
              borderRadius: 100,
              padding: "7px 16px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--bk-toggle-text)",
              fontFamily: "'Inter', sans-serif",
              whiteSpace: "nowrap",
              transition: "background 0.15s, border-color 0.15s, color 0.15s",
            }}
          >
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      {/* Editor section */}
      <section style={{ padding: "48px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Canvas */}
            <div className="flex justify-center">
              <CanvasEditor
                ref={canvasRef}
                aspectRatio={aspectRatio}
                background={currentBg}
                brandId={brand}
                headline={headline}
                subhead={subhead}
                bodyCopy={bodyCopy}
                textPosition={textPosition}
                showLogo={showLogo}
                logoVariant={logoVariant}
                logoScale={logoScale}
                showUrl={showUrl}
                urlScale={urlScale}
                headlineFontSize={headlineFontSize}
                headlineFontWeight={headlineFontWeight}
                subheadFontSize={subheadFontSize}
                subheadFontWeight={subheadFontWeight}
                bodyFontSize={bodyFontSize}
                bodyFontWeight={bodyFontWeight}
                headlineAlign={headlineAlign}
                subheadAlign={subheadAlign}
                bodyAlign={bodyAlign}
                layoutMargin={layoutMargin}
              />
            </div>

            {/* Controls - always white card, sticky + scrollable */}
            <div className="bg-white rounded-2xl border border-charcoal/[0.06] p-6 shadow-sm lg:sticky lg:top-[84px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto">
              <EditorControls
                brand={brand}
                setBrand={setBrand}
                backgroundId={backgroundId}
                setBackgroundId={setBackgroundId}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                headline={headline}
                setHeadline={setHeadline}
                subhead={subhead}
                setSubhead={setSubhead}
                bodyCopy={bodyCopy}
                setBodyCopy={setBodyCopy}
                textPosition={textPosition}
                setTextPosition={setTextPosition}
                showLogo={showLogo}
                setShowLogo={setShowLogo}
                logoVariant={logoVariant}
                setLogoVariant={setLogoVariant}
                logoScale={logoScale}
                setLogoScale={setLogoScale}
                showUrl={showUrl}
                setShowUrl={setShowUrl}
                urlScale={urlScale}
                setUrlScale={setUrlScale}
                headlineFontSize={headlineFontSize}
                setHeadlineFontSize={setHeadlineFontSize}
                headlineFontWeight={headlineFontWeight}
                setHeadlineFontWeight={setHeadlineFontWeight}
                subheadFontSize={subheadFontSize}
                setSubheadFontSize={setSubheadFontSize}
                subheadFontWeight={subheadFontWeight}
                setSubheadFontWeight={setSubheadFontWeight}
                bodyFontSize={bodyFontSize}
                setBodyFontSize={setBodyFontSize}
                bodyFontWeight={bodyFontWeight}
                setBodyFontWeight={setBodyFontWeight}
                headlineAlign={headlineAlign}
                setHeadlineAlign={setHeadlineAlign}
                subheadAlign={subheadAlign}
                setSubheadAlign={setSubheadAlign}
                bodyAlign={bodyAlign}
                setBodyAlign={setBodyAlign}
                layoutMargin={layoutMargin}
                setLayoutMargin={setLayoutMargin}
                onDownload={handleDownload}
                onSave={handleSave}
                onClear={handleClear}
                downloading={downloading}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Caption generator section */}
      <section style={{ padding: "48px 24px", background: "var(--bk-surface)", transition: "background 0.22s ease" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="bg-white rounded-2xl border border-charcoal/[0.06] p-6 shadow-sm">
            <CaptionGenerator
              headline={headline}
              subhead={subhead}
              bodyCopy={bodyCopy}
              brandLabel={currentBrand.label}
              caption={caption}
              setCaption={setCaption}
              hashtags={hashtags}
              setHashtags={setHashtags}
            />
          </div>
        </div>
      </section>

      {/* Asset library section */}
      <section style={{ padding: "48px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, color: "var(--bk-text)", marginBottom: 24 }}>
            Asset Library
          </h2>
          <AssetLibrary
            assets={assets}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </section>

      {/* Brand Kit Footer */}
      <footer
        style={{
          background: "var(--bk-surface)",
          borderTop: "1px solid var(--bk-border)",
          padding: "32px 0",
          transition: "background 0.22s ease, border-color 0.22s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={theme === "dark" ? "/Momentify-Logo_Reverse.svg" : "/Momentify-Logo.svg"}
            alt="Momentify"
            style={{ height: 22, opacity: 0.5 }}
          />
          <nav style={{ display: "flex", gap: 16, fontSize: 12 }}>
            <a href="/brand/index.html" style={{ color: "var(--bk-text-muted)", textDecoration: "none" }}>Brand Kit</a>
            <a href="/brand/backgrounds.html" style={{ color: "var(--bk-text-muted)", textDecoration: "none" }}>Backgrounds</a>
            <a href="/brand/design-system.html" style={{ color: "var(--bk-text-muted)", textDecoration: "none" }}>Design System</a>
            <a href="/social-toolkit" style={{ color: "var(--bk-accent)", textDecoration: "none" }}>Social Toolkit</a>
          </nav>
          <span style={{ fontSize: 12, color: "var(--bk-text-muted)" }}>
            &copy; 2026 Momentify. All brand assets are proprietary and confidential.
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--bk-accent)",
              opacity: 0.7,
            }}
          >
            Brand Kit v1.0
          </span>
        </div>
      </footer>
    </div>
  );
}
