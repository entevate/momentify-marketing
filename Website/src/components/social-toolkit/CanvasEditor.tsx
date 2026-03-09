"use client";

import { forwardRef, useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  type AspectRatio,
  type BackgroundDef,
  ASPECT_DIMENSIONS,
  renderSvgPattern,
} from "./backgroundData";

interface CanvasEditorProps {
  aspectRatio: AspectRatio;
  background: BackgroundDef;
  brandId: string;
  headline: string;
  subhead: string;
  bodyCopy: string;
  textPosition: "top" | "center" | "bottom";
  showLogo: boolean;
  logoVariant: "auto" | "dark" | "white";
  logoScale: number;
  showUrl: boolean;
  urlScale: number;
  headlineFontSize: number;
  headlineFontWeight: number;
  subheadFontSize: number;
  subheadFontWeight: number;
  bodyFontSize: number;
  bodyFontWeight: number;
}

const JUSTIFY_MAP = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
} as const;

const MAX_DISPLAY_WIDTH = 600;

const CanvasEditor = forwardRef<HTMLDivElement, CanvasEditorProps>(
  ({ aspectRatio, background, brandId, headline, subhead, bodyCopy, textPosition, showLogo, logoVariant = "auto", logoScale = 100, showUrl = true, urlScale = 100, headlineFontSize = 64, headlineFontWeight = 500, subheadFontSize = 32, subheadFontWeight = 300, bodyFontSize = 20, bodyFontWeight = 300 }, ref) => {
    const dims = ASPECT_DIMENSIONS[aspectRatio];
    const isLight = background.isLight;
    const textColor = isLight ? "#0B0B3C" : "#FFFFFF";
    const mutedColor = isLight ? "rgba(11,11,60,0.4)" : "rgba(255,255,255,0.4)";
    const logoSrc = logoVariant === "auto"
      ? (isLight ? "/Momentify-Logo.svg" : "/Momentify-Logo_Reverse.svg")
      : logoVariant === "dark"
        ? "/Momentify-Logo.svg"
        : "/Momentify-Logo_Reverse.svg";

    // Responsive scaling: measure container width
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(MAX_DISPLAY_WIDTH);

    const updateWidth = useCallback(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }, []);

    useEffect(() => {
      updateWidth();
      const el = containerRef.current;
      if (!el) return;
      const ro = new ResizeObserver(updateWidth);
      ro.observe(el);
      return () => ro.disconnect();
    }, [updateWidth]);

    const displayWidth = Math.min(containerWidth, MAX_DISPLAY_WIDTH);
    const scale = displayWidth / dims.w;

    const svgPattern = useMemo(() => {
      if (!background.pattern) return null;
      return renderSvgPattern(background.pattern, brandId, isLight);
    }, [background.pattern, brandId, isLight]);

    // Font sizes scale with canvas width
    const baseFontScale = dims.w / 1200;
    const headlineSize = Math.round(headlineFontSize * baseFontScale);
    const subheadSize = Math.round(subheadFontSize * baseFontScale);
    const bodySize = Math.round(bodyFontSize * baseFontScale);
    const logoWidth = Math.round(160 * baseFontScale * (logoScale / 100));
    const padding = Math.round(60 * baseFontScale);
    const urlSize = Math.round(14 * baseFontScale * (urlScale / 100));

    return (
      <div ref={containerRef} style={{ width: "100%", maxWidth: MAX_DISPLAY_WIDTH }}>
        <div
          style={{
            width: dims.w * scale,
            height: dims.h * scale,
            overflow: "hidden",
            borderRadius: 8,
            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
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
            {/* Color bar for light backgrounds */}
            {background.colorBar && (
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
    );
  }
);

CanvasEditor.displayName = "CanvasEditor";
export default CanvasEditor;
