"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import CanvasEditor from "./CanvasEditor";
import EditorControls from "./EditorControls";
import CaptionGenerator from "./CaptionGenerator";
import AssetLibrary, { type SavedAsset } from "./AssetLibrary";
import { type AspectRatio, getBrand, getBackground, ASPECT_DIMENSIONS } from "./backgroundData";

const STORAGE_KEY = "momentify_asset_library";

/* Theme tokens are provided by BrandNav via CSS variables on :root */

export default function SocialToolkitContent() {
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
        fontFamily: "'Inter', sans-serif",
      }}
    >
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
      <section style={{ padding: "48px 24px", background: "var(--surface)", transition: "background 0.22s ease" }}>
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
          <h2 style={{ fontSize: 20, fontWeight: 500, color: "var(--text)", marginBottom: 24 }}>
            Asset Library
          </h2>
          <AssetLibrary
            assets={assets}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </section>

    </div>
  );
}
