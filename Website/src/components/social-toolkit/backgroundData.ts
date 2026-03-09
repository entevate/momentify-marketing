import React from "react";

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:5" | "1.91:1";

export const ASPECT_DIMENSIONS: Record<AspectRatio, { w: number; h: number }> = {
  "1:1": { w: 1200, h: 1200 },
  "16:9": { w: 1200, h: 675 },
  "9:16": { w: 675, h: 1200 },
  "4:5": { w: 1200, h: 1500 },
  "1.91:1": { w: 1200, h: 628 },
};

export interface BackgroundDef {
  id: string;
  label: string;
  gradient: string;
  isLight: boolean;
  colorBar?: string;
  /** SVG pattern type to render */
  pattern?: "geo" | "arc" | "grid" | "diamonds" | "bracket" | "dots" | "lines" | "crosses";
}

export interface BrandDef {
  id: string;
  label: string;
  color: string;
  backgrounds: BackgroundDef[];
}

// SVG pattern renderers keyed by pattern type + brand context
export function renderSvgPattern(
  pattern: string,
  brandId: string,
  isLight: boolean,
  viewBox: string = "0 0 600 500"
): React.ReactElement | null {
  const props = {
    viewBox,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: { position: "absolute" as const, inset: 0, width: "100%", height: "100%", pointerEvents: "none" as const, zIndex: 0 },
  };

  switch (pattern) {
    case "geo": {
      if (isLight) {
        const colors = getPatternColors(brandId);
        return React.createElement("svg", { ...props, "aria-hidden": true },
          React.createElement("path", { d: "M600 500 L600 150 L400 0 L180 0 L420 240 L420 500 Z", fill: colors.primary, fillOpacity: 0.06 }),
          React.createElement("path", { d: "M600 500 L600 310 L360 70 L160 70 L360 270 L360 500 Z", fill: colors.secondary, fillOpacity: 0.04 })
        );
      }
      return React.createElement("svg", { ...props, "aria-hidden": true },
        React.createElement("path", { d: "M600 500 L600 150 L400 0 L180 0 L420 240 L420 500 Z", fill: "white", fillOpacity: 0.05 }),
        React.createElement("path", { d: "M600 500 L600 310 L360 70 L160 70 L360 270 L360 500 Z", fill: "white", fillOpacity: 0.04 })
      );
    }
    case "arc": {
      if (isLight) {
        const colors = getPatternColors(brandId);
        return React.createElement("svg", { ...props, "aria-hidden": true },
          React.createElement("path", { d: "M 600 300 A 200 200 0 0 0 400 500", stroke: colors.primary, strokeOpacity: 0.18, strokeWidth: 1.6, fill: "none" }),
          React.createElement("path", { d: "M 600 150 A 350 350 0 0 0 250 500", stroke: colors.secondary, strokeOpacity: 0.12, strokeWidth: 1.2, fill: "none" }),
          React.createElement("path", { d: "M 600 0 A 500 500 0 0 0 100 500", stroke: colors.primary, strokeOpacity: 0.07, strokeWidth: 0.8, fill: "none" })
        );
      }
      return React.createElement("svg", { ...props, "aria-hidden": true },
        React.createElement("path", { d: "M 600 300 A 200 200 0 0 0 400 500", stroke: "white", strokeOpacity: 0.1, strokeWidth: 1.4, fill: "none" }),
        React.createElement("path", { d: "M 600 150 A 350 350 0 0 0 250 500", stroke: "white", strokeOpacity: 0.07, strokeWidth: 1, fill: "none" }),
        React.createElement("path", { d: "M 600 0 A 500 500 0 0 0 100 500", stroke: "white", strokeOpacity: 0.04, strokeWidth: 0.8, fill: "none" })
      );
    }
    case "grid": {
      const patternId = `dots-${brandId}-grid`;
      const dotColor = isLight ? "#1F3395" : "white";
      const dotOpacity = isLight ? 0.2 : 0.15;
      return React.createElement("svg", { ...props, "aria-hidden": true },
        React.createElement("defs", null,
          React.createElement("pattern", { id: patternId, patternUnits: "userSpaceOnUse", width: 36, height: 36 },
            React.createElement("circle", { cx: 18, cy: 18, r: 1.4, fill: dotColor, fillOpacity: dotOpacity })
          )
        ),
        React.createElement("rect", { width: 600, height: 500, fill: `url(#${patternId})` })
      );
    }
    case "diamonds": {
      return React.createElement("svg", { ...props, "aria-hidden": true },
        React.createElement("rect", { x: 470, y: 22, width: 86, height: 86, rx: 2, transform: "rotate(45 513 65)", stroke: "white", strokeOpacity: 0.1, strokeWidth: 1.2, fill: "none" }),
        React.createElement("rect", { x: 370, y: 90, width: 56, height: 56, rx: 2, transform: "rotate(45 398 118)", fill: "white", fillOpacity: 0.04 }),
        React.createElement("rect", { x: 510, y: 190, width: 44, height: 44, rx: 2, transform: "rotate(45 532 212)", stroke: "white", strokeOpacity: 0.08, strokeWidth: 1, fill: "none" }),
        React.createElement("rect", { x: 420, y: 310, width: 32, height: 32, rx: 2, transform: "rotate(45 436 326)", fill: "white", fillOpacity: 0.05 }),
        React.createElement("rect", { x: 320, y: 200, width: 24, height: 24, rx: 2, transform: "rotate(45 332 212)", stroke: "white", strokeOpacity: 0.05, strokeWidth: 0.8, fill: "none" })
      );
    }
    case "bracket": {
      const strokeColor = isLight ? getPatternColors(brandId).primary : "white";
      const opMul = isLight ? 1 : 1;
      return React.createElement("svg", { ...props, "aria-hidden": true },
        React.createElement("path", { d: "M 510 500 L 510 455 L 600 455", stroke: strokeColor, strokeOpacity: 0.15 * opMul, strokeWidth: 1.6, fill: "none", strokeLinecap: "round" }),
        React.createElement("path", { d: "M 430 500 L 430 380 L 600 380", stroke: strokeColor, strokeOpacity: 0.1 * opMul, strokeWidth: 1.2, fill: "none", strokeLinecap: "round" }),
        React.createElement("path", { d: "M 340 500 L 340 295 L 600 295", stroke: strokeColor, strokeOpacity: 0.06 * opMul, strokeWidth: 0.8, fill: "none", strokeLinecap: "round" }),
        React.createElement("path", { d: "M 480 0 L 480 44 L 600 44", stroke: strokeColor, strokeOpacity: 0.09 * opMul, strokeWidth: 1, fill: "none", strokeLinecap: "round" })
      );
    }
    case "dots": {
      const patternId = `dots-${brandId}`;
      const dotColor = isLight ? getPatternColors(brandId).primary : "white";
      const dotOpacity = isLight ? 0.2 : 0.15;
      return React.createElement("svg", { ...props, "aria-hidden": true },
        React.createElement("defs", null,
          React.createElement("pattern", { id: patternId, patternUnits: "userSpaceOnUse", width: 36, height: 36 },
            React.createElement("circle", { cx: 18, cy: 18, r: 1.4, fill: dotColor, fillOpacity: dotOpacity })
          )
        ),
        React.createElement("rect", { width: 600, height: 500, fill: `url(#${patternId})` })
      );
    }
    case "lines": {
      const patternId = `lines-${brandId}`;
      const lineColor = isLight ? getPatternColors(brandId).primary : "white";
      const lineOpacity = isLight ? 0.1 : 0.07;
      return React.createElement("svg", { ...props, "aria-hidden": true },
        React.createElement("defs", null,
          React.createElement("pattern", { id: patternId, patternUnits: "userSpaceOnUse", width: 20, height: 20 },
            React.createElement("line", { x1: 0, y1: 20, x2: 20, y2: 0, stroke: lineColor, strokeOpacity: lineOpacity, strokeWidth: 0.7 })
          )
        ),
        React.createElement("rect", { width: 600, height: 500, fill: `url(#${patternId})` })
      );
    }
    case "crosses": {
      const patternId = `crosses-${brandId}`;
      const crossColor = isLight ? getPatternColors(brandId).primary : "white";
      return React.createElement("svg", { ...props, "aria-hidden": true },
        React.createElement("defs", null,
          React.createElement("pattern", { id: patternId, patternUnits: "userSpaceOnUse", width: 80, height: 80 },
            React.createElement("line", { x1: 20, y1: 13, x2: 20, y2: 27, stroke: crossColor, strokeOpacity: 0.13, strokeWidth: 1.5, strokeLinecap: "round" }),
            React.createElement("line", { x1: 13, y1: 20, x2: 27, y2: 20, stroke: crossColor, strokeOpacity: 0.13, strokeWidth: 1.5, strokeLinecap: "round" }),
            React.createElement("line", { x1: 57, y1: 44, x2: 57, y2: 54, stroke: crossColor, strokeOpacity: 0.08, strokeWidth: 1, strokeLinecap: "round" }),
            React.createElement("line", { x1: 52, y1: 49, x2: 62, y2: 49, stroke: crossColor, strokeOpacity: 0.08, strokeWidth: 1, strokeLinecap: "round" }),
            React.createElement("line", { x1: 70, y1: 8, x2: 70, y2: 16, stroke: crossColor, strokeOpacity: 0.06, strokeWidth: 1, strokeLinecap: "round" }),
            React.createElement("line", { x1: 66, y1: 12, x2: 74, y2: 12, stroke: crossColor, strokeOpacity: 0.06, strokeWidth: 1, strokeLinecap: "round" }),
            React.createElement("line", { x1: 34, y1: 62, x2: 34, y2: 74, stroke: crossColor, strokeOpacity: 0.1, strokeWidth: 1.2, strokeLinecap: "round" }),
            React.createElement("line", { x1: 28, y1: 68, x2: 40, y2: 68, stroke: crossColor, strokeOpacity: 0.1, strokeWidth: 1.2, strokeLinecap: "round" })
          )
        ),
        React.createElement("rect", { width: 600, height: 500, fill: `url(#${patternId})` })
      );
    }
    default:
      return null;
  }
}

function getPatternColors(brandId: string): { primary: string; secondary: string } {
  switch (brandId) {
    case "momentify": return { primary: "#254FE5", secondary: "#1F3395" };
    case "trade-shows": return { primary: "#7B3FD4", secondary: "#9B5FE8" };
    case "recruiting": return { primary: "#00BBA5", secondary: "#1A8A76" };
    case "field-sales": return { primary: "#C48A00", secondary: "#F2B33D" };
    case "facilities": return { primary: "#5B4499", secondary: "#3A2073" };
    case "venues": return { primary: "#8F200A", secondary: "#F25E3D" };
    default: return { primary: "#254FE5", secondary: "#1F3395" };
  }
}

export const brands: BrandDef[] = [
  {
    id: "momentify",
    label: "Momentify",
    color: "#0CF4DF",
    backgrounds: [
      { id: "main-minimal", label: "Depth", gradient: "linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)", isLight: false, pattern: "geo" },
      { id: "main-light", label: "White", gradient: "#FFFFFF", isLight: true },
      { id: "main-midnight", label: "Midnight", gradient: "#07081F", isLight: false },
      { id: "main-frost", label: "Frost", gradient: "linear-gradient(145deg, #EEF2FF 0%, #F5F7FF 100%)", isLight: true, colorBar: "linear-gradient(90deg, #0CF4DF, #254FE5)", pattern: "geo" },
      { id: "main-arc", label: "Arc", gradient: "linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)", isLight: false, pattern: "arc" },
      { id: "main-grid", label: "Grid", gradient: "linear-gradient(145deg, #EEF2FF 0%, #F5F7FF 100%)", isLight: true, colorBar: "linear-gradient(90deg, #0CF4DF, #254FE5)", pattern: "grid" },
    ],
  },
  {
    id: "trade-shows",
    label: "Trade Shows & Exhibits",
    color: "#6B21D4",
    backgrounds: [
      { id: "violet-minimal", label: "Violet", gradient: "linear-gradient(135deg, #2D0770 0%, #4A0FA8 55%, #9B5FE8 100%)", isLight: false, pattern: "geo" },
      { id: "violet-light", label: "Violet Light", gradient: "linear-gradient(145deg, #F8F4FF 0%, #EDE6FF 100%)", isLight: true, colorBar: "linear-gradient(90deg, #9B5FE8, #6B21D4)", pattern: "geo" },
      { id: "violet-diamonds", label: "Diamonds", gradient: "linear-gradient(135deg, #2D0770 0%, #4A0FA8 55%, #9B5FE8 100%)", isLight: false, pattern: "diamonds" },
      { id: "violet-bracket", label: "Bracket", gradient: "linear-gradient(145deg, #F8F4FF 0%, #EDE6FF 100%)", isLight: true, colorBar: "linear-gradient(90deg, #9B5FE8, #6B21D4)", pattern: "bracket" },
    ],
  },
  {
    id: "recruiting",
    label: "Technical Recruiting",
    color: "#5FD9C2",
    backgrounds: [
      { id: "teal-minimal", label: "Teal", gradient: "linear-gradient(135deg, #040E28 0%, #1A8A76 55%, #5FD9C2 100%)", isLight: false, pattern: "geo" },
      { id: "teal-light", label: "Teal Light", gradient: "linear-gradient(145deg, #E8FDF8 0%, #F0FFFC 100%)", isLight: true, colorBar: "linear-gradient(90deg, #00BBA5, #5FD9C2)", pattern: "geo" },
      { id: "teal-dots", label: "Dots", gradient: "linear-gradient(135deg, #040E28 0%, #1A8A76 55%, #5FD9C2 100%)", isLight: false, pattern: "dots" },
      { id: "teal-lines", label: "Lines", gradient: "linear-gradient(145deg, #E8FDF8 0%, #F0FFFC 100%)", isLight: true, colorBar: "linear-gradient(90deg, #00BBA5, #5FD9C2)", pattern: "lines" },
    ],
  },
  {
    id: "field-sales",
    label: "Field Sales Enablement",
    color: "#F2B33D",
    backgrounds: [
      { id: "amber-minimal", label: "Amber", gradient: "linear-gradient(135deg, #1A1000 0%, #8A5E00 55%, #F2B33D 100%)", isLight: false, pattern: "geo" },
      { id: "amber-light", label: "Amber Light", gradient: "linear-gradient(145deg, #FFFAEE 0%, #FFF5E0 100%)", isLight: true, colorBar: "linear-gradient(90deg, #F2B33D, #C48A00)", pattern: "geo" },
      { id: "amber-dots", label: "Dots", gradient: "linear-gradient(135deg, #1A1000 0%, #8A5E00 55%, #F2B33D 100%)", isLight: false, pattern: "dots" },
      { id: "amber-crosses", label: "Crosses", gradient: "linear-gradient(145deg, #FFFAEE 0%, #FFF5E0 100%)", isLight: true, colorBar: "linear-gradient(90deg, #F2B33D, #C48A00)", pattern: "crosses" },
    ],
  },
  {
    id: "facilities",
    label: "Facilities",
    color: "#3A2073",
    backgrounds: [
      { id: "indigo-minimal", label: "Indigo", gradient: "linear-gradient(135deg, #0D0820 0%, #3A2073 55%, #5B4499 100%)", isLight: false, pattern: "geo" },
      { id: "indigo-light", label: "Indigo Light", gradient: "linear-gradient(145deg, #EEF0FF 0%, #F4F5FF 100%)", isLight: true, colorBar: "linear-gradient(90deg, #5B4499, #3A2073)", pattern: "geo" },
      { id: "indigo-bracket", label: "Bracket", gradient: "linear-gradient(135deg, #0D0820 0%, #3A2073 55%, #5B4499 100%)", isLight: false, pattern: "bracket" },
      { id: "indigo-arc", label: "Arc", gradient: "linear-gradient(145deg, #EEF0FF 0%, #F4F5FF 100%)", isLight: true, colorBar: "linear-gradient(90deg, #5B4499, #3A2073)", pattern: "arc" },
    ],
  },
  {
    id: "venues",
    label: "Venues & Events",
    color: "#F25E3D",
    backgrounds: [
      { id: "crimson-minimal", label: "Crimson", gradient: "linear-gradient(135deg, #1A0400 0%, #8F200A 55%, #F25E3D 100%)", isLight: false, pattern: "geo" },
      { id: "crimson-light", label: "Crimson Light", gradient: "linear-gradient(145deg, #FFF2EE 0%, #FFF7F5 100%)", isLight: true, colorBar: "linear-gradient(90deg, #F25E3D, #8F200A)", pattern: "geo" },
      { id: "crimson-lines", label: "Lines", gradient: "linear-gradient(135deg, #1A0400 0%, #8F200A 55%, #F25E3D 100%)", isLight: false, pattern: "lines" },
      { id: "crimson-crosses", label: "Crosses", gradient: "linear-gradient(145deg, #FFF2EE 0%, #FFF7F5 100%)", isLight: true, colorBar: "linear-gradient(90deg, #F25E3D, #8F200A)", pattern: "crosses" },
    ],
  },
];

export function getBrand(id: string): BrandDef {
  return brands.find((b) => b.id === id) || brands[0];
}

export function getBackground(brandId: string, bgId: string): BackgroundDef {
  const brand = getBrand(brandId);
  return brand.backgrounds.find((b) => b.id === bgId) || brand.backgrounds[0];
}
