"use client";

import { forwardRef, useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  type AspectRatio,
  type BackgroundDef,
  ASPECT_DIMENSIONS,
  renderSvgPattern,
} from "./backgroundData";

type TextAlign = "left" | "center" | "right";

interface CanvasEditorProps {
  aspectRatio: AspectRatio;
  background: BackgroundDef;
  brandId: string;
  headline: string;
  subhead: string;
  bodyCopy: string;
  textPosition: "top" | "center" | "bottom";
  showLogo: boolean;
  logoVariant: "auto" | "dark" | "white" | "all-white";
  logoScale: number;
  showUrl: boolean;
  urlScale: number;
  headlineFontSize: number;
  headlineFontWeight: number;
  subheadFontSize: number;
  subheadFontWeight: number;
  bodyFontSize: number;
  bodyFontWeight: number;
  headlineAlign: TextAlign;
  subheadAlign: TextAlign;
  bodyAlign: TextAlign;
  layoutMargin: number;
}

const JUSTIFY_MAP = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
} as const;

type ZoomLevel = "fit" | number;

const ZOOM_OPTIONS: { label: string; value: ZoomLevel }[] = [
  { label: "Fit", value: "fit" },
  { label: "50%", value: 50 },
  { label: "75%", value: 75 },
  { label: "100%", value: 100 },
];

const CanvasEditor = forwardRef<HTMLDivElement, CanvasEditorProps>(
  ({ aspectRatio, background, brandId, headline, subhead, bodyCopy, textPosition, showLogo, logoVariant = "auto", logoScale = 100, showUrl = true, urlScale = 100, headlineFontSize = 64, headlineFontWeight = 500, subheadFontSize = 32, subheadFontWeight = 300, bodyFontSize = 20, bodyFontWeight = 300, headlineAlign = "left", subheadAlign = "left", bodyAlign = "left", layoutMargin = 60 }, ref) => {
    const dims = ASPECT_DIMENSIONS[aspectRatio];
    const isLight = background.isLight;
    const textColor = isLight ? "#0B0B3C" : "#FFFFFF";
    const mutedColor = isLight ? "rgba(11,11,60,0.4)" : "rgba(255,255,255,0.4)";
    const logoSrc = logoVariant === "auto"
      ? (isLight ? "/Momentify-Logo.svg" : "/Momentify-Logo_Reverse.svg")
      : logoVariant === "dark"
        ? "/Momentify-Logo.svg"
        : logoVariant === "all-white"
          ? "/Momentify-Logo_White.svg"
          : "/Momentify-Logo_Reverse.svg";

    // Zoom state
    const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("fit");

    // Responsive scaling: measure container width + viewport height
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800);
    const [availableHeight, setAvailableHeight] = useState(600);

    const updateSize = useCallback(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      // Available height = viewport minus header (60px) + zoom bar (~40px) + padding (~80px)
      setAvailableHeight(window.innerHeight - 180);
    }, []);

    useEffect(() => {
      updateSize();
      const el = containerRef.current;
      if (!el) return;
      const ro = new ResizeObserver(updateSize);
      ro.observe(el);
      window.addEventListener("resize", updateSize);
      return () => { ro.disconnect(); window.removeEventListener("resize", updateSize); };
    }, [updateSize]);

    // Calculate scale based on zoom level
    const fitScale = Math.min(containerWidth / dims.w, availableHeight / dims.h);
    const scale = zoomLevel === "fit" ? fitScale : (zoomLevel as number) / 100;
    const canvasW = dims.w * scale;
    const canvasH = dims.h * scale;
    const overflows = canvasW > containerWidth || canvasH > availableHeight;

    const svgPattern = useMemo(() => {
      if (!background.pattern) return null;
      return renderSvgPattern(background.pattern, brandId, isLight);
    }, [background.pattern, brandId, isLight]);

    // Font sizes scale with canvas width
    const baseFontScale = dims.w / 1200;
    const headlineSize = Math.round(headlineFontSize * baseFontScale);
    const subheadSize = Math.round(subheadFontSize * baseFontScale);
    const bodySize = Math.round(bodyFontSize * baseFontScale);
    const logoWidth = Math.round(240 * baseFontScale * (logoScale / 100));
    const padding = Math.round(layoutMargin * baseFontScale);
    const urlSize = Math.round(14 * baseFontScale * (urlScale / 100));

    return (
      <div ref={containerRef} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Zoom controls */}
        <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
          {ZOOM_OPTIONS.map((opt) => {
            const isActive = zoomLevel === opt.value;
            return (
              <button
                key={String(opt.value)}
                onClick={() => setZoomLevel(opt.value)}
                style={{
                  padding: "4px 14px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "var(--font-inter), sans-serif",
                  border: "none",
                  cursor: "pointer",
                  background: isActive ? "var(--accent, #0CF4DF)" : "transparent",
                  color: isActive ? "#07081F" : "inherit",
                  opacity: isActive ? 1 : 0.4,
                  transition: "all 0.15s",
                  letterSpacing: "0.02em",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Canvas wrapper - scrollable when zoomed past fit, centered */}
        <div
          style={{
            maxHeight: overflows ? availableHeight : undefined,
            overflow: overflows ? "auto" : "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: canvasW,
              height: canvasH,
              overflow: "hidden",
              borderRadius: 8,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}
          >
            <div
              ref={ref}
              style={{
                width: dims.w,
                height: dims.h,
                background: background.gradient,
                position: "relative",
                overflow: "hidden",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              {/* Top color bar (hidden when logo is off) */}
              {background.colorBar && showLogo && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: background.colorBar,
                    zIndex: 2,
                  }}
                />
              )}

              {/* Bottom color bar (hidden when URL watermark is off) */}
              {background.colorBar && showUrl && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: background.colorBar,
                    zIndex: 2,
                  }}
                />
              )}

              {/* SVG decoration layer */}
              {svgPattern}

              {/* Content layer */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: JUSTIFY_MAP[textPosition],
                  height: "100%",
                  padding,
                  gap: padding * 0.3,
                }}
              >
                {/* Logo */}
                {showLogo && (
                  <div style={{ position: "absolute", top: padding, left: padding }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoSrc}
                      alt="Momentify"
                      style={{ width: logoWidth, height: "auto", display: "block" }}
                      crossOrigin="anonymous"
                    />
                  </div>
                )}

                {/* Text block */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: Math.round(12 * baseFontScale),
                    marginTop: showLogo && textPosition === "top" ? logoWidth * 0.35 : 0,
                  }}
                >
                  {headline && (
                    <div
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: headlineFontWeight,
                        fontSize: headlineSize,
                        lineHeight: 1.1,
                        color: textColor,
                        letterSpacing: "-0.02em",
                        textAlign: headlineAlign,
                        textWrap: "balance" as React.CSSProperties["textWrap"],
                        widows: 2,
                        orphans: 2,
                      }}
                    >
                      {headline}
                    </div>
                  )}
                  {subhead && (
                    <div
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: subheadFontWeight,
                        fontSize: subheadSize,
                        lineHeight: 1.35,
                        color: textColor,
                        opacity: 0.85,
                        textAlign: subheadAlign,
                        textWrap: "pretty" as React.CSSProperties["textWrap"],
                        widows: 2,
                        orphans: 2,
                      }}
                    >
                      {subhead}
                    </div>
                  )}
                  {bodyCopy && (
                    <div
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: bodyFontWeight,
                        fontSize: bodySize,
                        lineHeight: 1.5,
                        color: textColor,
                        opacity: 0.7,
                        maxWidth: "80%",
                        textAlign: bodyAlign,
                        marginLeft: bodyAlign === "right" ? "auto" : undefined,
                        marginRight: bodyAlign === "left" ? "auto" : undefined,
                      }}
                    >
                      {bodyCopy}
                    </div>
                  )}
                </div>

                {/* URL watermark */}
                {showUrl && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: padding * 0.6,
                      right: padding,
                      fontSize: urlSize,
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 400,
                      color: mutedColor,
                      letterSpacing: "0.02em",
                    }}
                  >
                    momentifyapp.com
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CanvasEditor.displayName = "CanvasEditor";
export default CanvasEditor;
