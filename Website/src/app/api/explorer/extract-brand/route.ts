import { NextResponse } from 'next/server';

/**
 * POST /api/explorer/extract-brand
 * Fetches a website (HTML + linked CSS) and extracts logo URLs + brand colors
 * from meta tags, <style> blocks, external stylesheets, and inline styles.
 */

// Normalize a hex color to uppercase 6-digit form
function normalizeHex(hex: string): string {
  let h = hex.replace('#', '').toUpperCase();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length === 8) h = h.slice(0, 6); // strip alpha
  return `#${h}`;
}

// Convert rgb/rgba to hex
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Check if a color is neutral (grayscale, near-black, near-white)
function isNeutral(hex: string): boolean {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);

  // Near-white or near-black
  const avg = (r + g + b) / 3;
  if (avg > 230 || avg < 25) return true;

  // Grayscale (all channels within 15 of each other)
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 15) return true;

  return false;
}

// Calculate color saturation (0-1)
function saturation(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

// Check if two colors are too similar (within threshold)
function colorDistance(a: string, b: string): number {
  const ha = a.replace('#', '');
  const hb = b.replace('#', '');
  const dr = parseInt(ha.slice(0, 2), 16) - parseInt(hb.slice(0, 2), 16);
  const dg = parseInt(ha.slice(2, 4), 16) - parseInt(hb.slice(2, 4), 16);
  const db = parseInt(ha.slice(4, 6), 16) - parseInt(hb.slice(4, 6), 16);
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

// Extract all hex and rgb colors from CSS text
function extractColorsFromCss(css: string): Map<string, number> {
  const counts = new Map<string, number>();

  // Hex colors
  const hexMatches = css.matchAll(/#([0-9a-fA-F]{3,8})\b/g);
  for (const m of hexMatches) {
    const raw = m[0];
    if (raw.length !== 4 && raw.length !== 7 && raw.length !== 9) continue;
    const norm = normalizeHex(raw);
    if (isNeutral(norm)) continue;
    counts.set(norm, (counts.get(norm) || 0) + 1);
  }

  // rgb/rgba colors
  const rgbMatches = css.matchAll(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g);
  for (const m of rgbMatches) {
    const hex = rgbToHex(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
    if (isNeutral(hex)) continue;
    counts.set(hex, (counts.get(hex) || 0) + 1);
  }

  // hsl colors -> approximate conversion
  const hslMatches = css.matchAll(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%/g);
  for (const m of hslMatches) {
    const h = parseInt(m[1]) / 360;
    const s = parseInt(m[2]) / 100;
    const l = parseInt(m[3]) / 100;
    if (s < 0.1) continue; // skip grays
    // HSL to RGB
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
    const hex = rgbToHex(r, g, b);
    if (!isNeutral(hex)) {
      counts.set(hex, (counts.get(hex) || 0) + 1);
    }
  }

  return counts;
}

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as { url: string };
    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    // Normalize URL
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }
    const origin = new URL(targetUrl).origin;

    // Fetch the page
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch: ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    // ── Extract Colors ──────────────────────────────

    // Priority 1: Explicit brand color declarations (meta tags)
    const priorityColors: string[] = [];

    // theme-color meta (either attribute order)
    const themeColor = html.match(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']theme-color["']/i);
    if (themeColor?.[1] && /^#[0-9a-fA-F]{3,8}$/.test(themeColor[1].trim())) {
      const norm = normalizeHex(themeColor[1].trim());
      if (!isNeutral(norm)) priorityColors.push(norm);
    }

    // msapplication-TileColor
    const tileColor = html.match(/<meta[^>]*name=["']msapplication-TileColor["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']msapplication-TileColor["']/i);
    if (tileColor?.[1] && /^#[0-9a-fA-F]{3,8}$/.test(tileColor[1].trim())) {
      const norm = normalizeHex(tileColor[1].trim());
      if (!isNeutral(norm) && !priorityColors.includes(norm)) priorityColors.push(norm);
    }

    // Priority 2: CSS custom properties with brand-like names
    const brandVarNames = /--(?:brand|primary|accent|main|theme|site|color-primary|color-accent|color-brand|wp--preset--color--primary|wp--preset--color--accent|c-brand|c-primary|c-accent|global-color-primary|global-color-accent)[-_]?(?:color)?/i;
    const cssVarPattern = new RegExp(
      `(${brandVarNames.source})[^:]*:\\s*(#[0-9a-fA-F]{3,8}|rgb[a]?\\([^)]+\\))`,
      'gi',
    );

    // Priority 3: Collect ALL color data from inline <style> blocks and the HTML
    const allCss: string[] = [];

    // Gather all <style> block content
    const styleBlocks = html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    for (const m of styleBlocks) {
      allCss.push(m[1]);
    }

    // Also gather inline style attributes
    const inlineStyles = html.matchAll(/style=["']([^"']+)["']/gi);
    for (const m of inlineStyles) {
      allCss.push(m[1]);
    }

    const combinedCss = allCss.join('\n');

    // Extract brand-named CSS vars first (high priority)
    const brandVarColors: string[] = [];
    const varMatches = combinedCss.matchAll(cssVarPattern);
    for (const m of varMatches) {
      const val = m[2].trim();
      let hex: string | null = null;
      if (val.startsWith('#')) {
        hex = normalizeHex(val);
      } else {
        const rgbMatch = val.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (rgbMatch) hex = rgbToHex(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3]));
      }
      if (hex && !isNeutral(hex) && !brandVarColors.includes(hex)) {
        brandVarColors.push(hex);
      }
    }

    // Priority 4: Fetch up to 3 external CSS files for deeper analysis
    const cssLinkPattern = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi;
    const cssLinks: string[] = [];
    let linkMatch;
    while ((linkMatch = cssLinkPattern.exec(html)) !== null) {
      const href = linkMatch[1];
      let cssUrl: string;
      if (href.startsWith('//')) cssUrl = `https:${href}`;
      else if (href.startsWith('http')) cssUrl = href;
      else if (href.startsWith('/')) cssUrl = `${origin}${href}`;
      else cssUrl = `${origin}/${href}`;
      cssLinks.push(cssUrl);
    }

    // Fetch external stylesheets (limit to first 3 to stay fast)
    const externalCss = await Promise.all(
      cssLinks.slice(0, 3).map(async (cssUrl) => {
        try {
          const r = await fetch(cssUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(5000),
          });
          if (!r.ok) return '';
          const text = await r.text();
          // Only take first 200KB to avoid huge files
          return text.slice(0, 200_000);
        } catch {
          return '';
        }
      }),
    );

    // Also check external CSS for brand variables
    for (const css of externalCss) {
      if (!css) continue;
      const extVarMatches = css.matchAll(cssVarPattern);
      for (const m of extVarMatches) {
        const val = m[2].trim();
        let hex: string | null = null;
        if (val.startsWith('#')) hex = normalizeHex(val);
        else {
          const rgbMatch = val.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
          if (rgbMatch) hex = rgbToHex(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3]));
        }
        if (hex && !isNeutral(hex) && !brandVarColors.includes(hex)) {
          brandVarColors.push(hex);
        }
      }
    }

    // Aggregate all color occurrences from all CSS sources
    const allColorCounts = extractColorsFromCss(combinedCss + '\n' + externalCss.join('\n'));

    // Score and rank colors:
    // - priorityColors (meta tags) get highest weight
    // - brandVarColors (named CSS vars) get second highest
    // - Most frequent non-neutral colors from CSS come next
    // - Boost for higher saturation (more "brand-like")

    const scored: { hex: string; score: number }[] = [];
    const seen = new Set<string>();

    // Add priority colors first
    for (const c of priorityColors) {
      scored.push({ hex: c, score: 1000 });
      seen.add(c);
    }

    // Add brand variable colors
    for (const c of brandVarColors) {
      if (seen.has(c)) {
        const existing = scored.find(s => s.hex === c);
        if (existing) existing.score += 500;
      } else {
        scored.push({ hex: c, score: 500 });
        seen.add(c);
      }
    }

    // Add frequent CSS colors
    const sorted = [...allColorCounts.entries()].sort((a, b) => b[1] - a[1]);
    for (const [hex, count] of sorted.slice(0, 30)) {
      const sat = saturation(hex);
      const freq = Math.min(count, 50); // cap frequency contribution
      const colorScore = freq * 2 + sat * 100;

      if (seen.has(hex)) {
        const existing = scored.find(s => s.hex === hex);
        if (existing) existing.score += colorScore;
      } else {
        scored.push({ hex, score: colorScore });
        seen.add(hex);
      }
    }

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Pick top colors, ensuring they're visually distinct from each other
    const finalColors: string[] = [];
    for (const { hex } of scored) {
      if (finalColors.length >= 6) break;
      const tooClose = finalColors.some(existing => colorDistance(existing, hex) < 40);
      if (!tooClose) {
        finalColors.push(hex);
      }
    }

    // ── Extract Logos ───────────────────────────────
    const logos: { url: string; type: string; size?: number }[] = [];

    const resolve = (href: string) => {
      if (!href) return '';
      if (href.startsWith('//')) return `https:${href}`;
      if (href.startsWith('http')) return href;
      if (href.startsWith('/')) return `${origin}${href}`;
      return `${origin}/${href}`;
    };

    // apple-touch-icon (usually highest quality square icon)
    const appleIcons = html.matchAll(/<link[^>]*rel=["']apple-touch-icon[^"']*["'][^>]*href=["']([^"']+)["']/gi);
    for (const m of appleIcons) {
      const sizeMatch = m[0].match(/sizes=["'](\d+)x\d+["']/);
      logos.push({ url: resolve(m[1]), type: 'icon', size: sizeMatch ? parseInt(sizeMatch[1]) : 180 });
    }
    // Also match href before rel
    const appleIcons2 = html.matchAll(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon[^"']*["']/gi);
    for (const m of appleIcons2) {
      const u = resolve(m[1]);
      if (!logos.some(l => l.url === u)) {
        logos.push({ url: u, type: 'icon', size: 180 });
      }
    }

    // og:image (often a good full logo)
    const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (ogImage?.[1]) {
      logos.push({ url: resolve(ogImage[1]), type: 'og' });
    }

    // Standard favicons
    const favicons = html.matchAll(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/gi);
    for (const m of favicons) {
      const sizeMatch = m[0].match(/sizes=["'](\d+)x\d+["']/);
      logos.push({ url: resolve(m[1]), type: 'favicon', size: sizeMatch ? parseInt(sizeMatch[1]) : 32 });
    }

    // Look for img tags with "logo" in src, class, alt, or id
    const logoImgs = html.matchAll(/<img[^>]*(?:src|class|alt|id)[^>]*logo[^>]*>/gi);
    for (const m of logoImgs) {
      const srcMatch = m[0].match(/src=["']([^"']+)["']/i);
      if (srcMatch?.[1]) {
        logos.push({ url: resolve(srcMatch[1]), type: 'img-logo' });
      }
    }

    // SVG with "logo" in src
    const svgLogos = html.matchAll(/<(?:img|source)[^>]*src=["']([^"']*logo[^"']*)["']/gi);
    for (const m of svgLogos) {
      const u = resolve(m[1]);
      if (!logos.some(l => l.url === u)) {
        logos.push({ url: u, type: 'svg-logo' });
      }
    }

    // Default favicon.ico fallback
    if (logos.length === 0) {
      logos.push({ url: `${origin}/favicon.ico`, type: 'favicon', size: 32 });
    }

    // Deduplicate by URL
    const seenUrls = new Set<string>();
    const uniqueLogos = logos.filter(l => {
      if (seenUrls.has(l.url)) return false;
      seenUrls.add(l.url);
      return true;
    });

    // Sort: prefer larger icons and logo images
    uniqueLogos.sort((a, b) => {
      const typeOrder: Record<string, number> = { 'img-logo': 0, 'svg-logo': 0, 'og': 1, 'icon': 2, 'favicon': 3 };
      const aOrder = typeOrder[a.type] ?? 4;
      const bOrder = typeOrder[b.type] ?? 4;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return (b.size ?? 0) - (a.size ?? 0);
    });

    // Pick best candidates
    const bestLogo = uniqueLogos.find(l => ['img-logo', 'svg-logo', 'og'].includes(l.type))?.url || uniqueLogos[0]?.url || null;
    const bestIcon = uniqueLogos.find(l => l.type === 'icon')?.url
      || uniqueLogos.find(l => l.type === 'favicon' && (l.size ?? 0) >= 64)?.url
      || uniqueLogos.find(l => l.type === 'favicon')?.url
      || null;

    return NextResponse.json({
      colors: finalColors,
      logos: {
        main: bestLogo,
        icon: bestIcon,
        all: uniqueLogos.slice(0, 8).map(l => ({ url: l.url, type: l.type })),
      },
      origin,
    });
  } catch (error) {
    console.error('Brand extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract brand info', details: String(error) },
      { status: 500 },
    );
  }
}
