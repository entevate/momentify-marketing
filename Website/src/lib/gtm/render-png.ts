/**
 * Headless-Chromium PNG renderer for rendered template HTML.
 *
 * Two execution paths:
 *   - On Vercel (VERCEL=1): use the precompiled @sparticuz/chromium binary
 *     designed to fit serverless 50MB unzipped budgets.
 *   - Local dev: use a developer's system Chrome (Mac/Linux/Windows).
 *
 * Pages are rendered at 1080x1080 (DPR 1) by default. Templates are
 * 1080x1080 1:1 graphics; this matches the design viewport so we don't
 * scale-down or letterbox.
 */

import type { Browser, LaunchOptions } from "puppeteer-core"

const RENDER_WIDTH = 1080
const RENDER_HEIGHT = 1080

/**
 * Best-effort lookup of a local Chrome / Chromium / Edge binary for dev.
 * Returns the first path that exists, or null if none found.
 */
function localChromeExecutable(): string | null {
  // We only ever check candidates that are absolute, well-known paths,
  // so no traversal/escape risk here.
  const fs = eval("require")("fs") as typeof import("fs")
  const candidates = [
    // macOS
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    // Linux
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    // Windows (when run through WSL it's still nix-style above; native paths handled below)
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ]
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p
    } catch { /* ignore */ }
  }
  return null
}

/**
 * Launch a headless browser appropriate for the current environment.
 * Caller is responsible for `await browser.close()`.
 */
async function launchBrowser(): Promise<Browser> {
  const puppeteer = await import("puppeteer-core")
  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME

  if (isServerless) {
    // @sparticuz/chromium-min downloads the chromium binary from a CDN
    // at runtime instead of bundling it with the deployment. Avoids
    // Next.js outputFileTracing dropping the .so libraries that the
    // bundled binary depends on (libnss3.so etc.). Adds ~3-5s cold-
    // start latency for the download but is reliable.
    //
    // CRITICAL: chromium-min only sets up LD_LIBRARY_PATH (so the
    // chromium binary can find libnss3.so + friends) when its detection
    // logic identifies the host as AWS Lambda. That detection checks
    // AWS_EXECUTION_ENV / AWS_LAMBDA_JS_RUNTIME for "nodejs20.x" /
    // "nodejs22.x". Vercel does NOT set these vars, so without this
    // shim, every cold start fails with `libnss3.so: cannot open
    // shared object file`. Spoofing the var triggers the env setup
    // (setupLambdaEnvironment("/tmp/al2023/lib")) at module load.
    if (!process.env.AWS_EXECUTION_ENV && !process.env.AWS_LAMBDA_JS_RUNTIME) {
      process.env.AWS_LAMBDA_JS_RUNTIME = "nodejs22.x"
    }
    const chromiumMod = await import("@sparticuz/chromium-min")
    type ChromiumExport = {
      args: string[]
      defaultViewport: { width: number; height: number; deviceScaleFactor?: number } | null
      executablePath: (location?: string) => Promise<string>
      headless: boolean | "shell"
    }
    const chromium = (chromiumMod as { default?: ChromiumExport }).default ?? (chromiumMod as unknown as ChromiumExport)
    // Pin the chromium pack version. Must match the @sparticuz/chromium-min
    // package version we installed (131.0.1). If you bump that package,
    // bump this URL in lockstep.
    const CHROMIUM_PACK_URL =
      process.env.CHROMIUM_PACK_URL ||
      "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
    const launchOpts: LaunchOptions = {
      args: chromium.args,
      defaultViewport: { width: RENDER_WIDTH, height: RENDER_HEIGHT, deviceScaleFactor: 1 },
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      // Force boolean - puppeteer types don't accept "shell".
      headless: chromium.headless === false ? false : true,
    }
    return puppeteer.launch(launchOpts)
  }

  const exe = localChromeExecutable()
  if (!exe) {
    throw new Error(
      "PNG render requires Chrome locally. Install Google Chrome or set CHROME_PATH."
    )
  }
  return puppeteer.launch({
    executablePath: process.env.CHROME_PATH || exe,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: RENDER_WIDTH, height: RENDER_HEIGHT, deviceScaleFactor: 1 },
  })
}

/**
 * Render a single HTML string to a PNG buffer.
 *
 * The HTML is loaded via setContent (so no extra HTTP fetch is needed).
 * `networkidle0` ensures Google Fonts / external assets load before
 * screenshot. fullPage=false keeps the capture exactly viewport-sized.
 */
export async function renderHtmlToPng(html: string): Promise<Buffer> {
  const browser = await launchBrowser()
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: RENDER_WIDTH, height: RENDER_HEIGHT, deviceScaleFactor: 1 })
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 25_000 })
    const buf = await page.screenshot({
      type: "png",
      omitBackground: false,
      clip: { x: 0, y: 0, width: RENDER_WIDTH, height: RENDER_HEIGHT },
    })
    return Buffer.from(buf as Uint8Array)
  } finally {
    await browser.close().catch(() => { /* ignore */ })
  }
}

/**
 * Render a list of HTML strings to PNGs sequentially. Sequential keeps
 * memory bounded on Vercel (one Chromium tab at a time). Total time is
 * roughly N * single-render-time.
 */
export async function renderManyHtmlToPng(htmls: string[]): Promise<Buffer[]> {
  const browser = await launchBrowser()
  try {
    const out: Buffer[] = []
    for (const html of htmls) {
      const page = await browser.newPage()
      try {
        await page.setViewport({ width: RENDER_WIDTH, height: RENDER_HEIGHT, deviceScaleFactor: 1 })
        await page.setContent(html, { waitUntil: "networkidle0", timeout: 25_000 })
        const buf = await page.screenshot({
          type: "png",
          omitBackground: false,
          clip: { x: 0, y: 0, width: RENDER_WIDTH, height: RENDER_HEIGHT },
        })
        out.push(Buffer.from(buf as Uint8Array))
      } finally {
        await page.close().catch(() => { /* ignore */ })
      }
    }
    return out
  } finally {
    await browser.close().catch(() => { /* ignore */ })
  }
}

/**
 * Render a list of (html, width, height) jobs to PNGs sequentially. Used by
 * the backgrounds-export route which needs different aspect ratios per job.
 * Same memory profile as renderManyHtmlToPng (one tab at a time).
 */
export async function renderSizedHtmlBatch(
  jobs: Array<{ html: string; width: number; height: number }>
): Promise<Buffer[]> {
  const browser = await launchBrowser()
  try {
    const out: Buffer[] = []
    for (const job of jobs) {
      const page = await browser.newPage()
      try {
        await page.setViewport({ width: job.width, height: job.height, deviceScaleFactor: 1 })
        await page.setContent(job.html, { waitUntil: "networkidle0", timeout: 25_000 })
        const buf = await page.screenshot({
          type: "png",
          omitBackground: false,
          clip: { x: 0, y: 0, width: job.width, height: job.height },
        })
        out.push(Buffer.from(buf as Uint8Array))
      } finally {
        await page.close().catch(() => { /* ignore */ })
      }
    }
    return out
  } finally {
    await browser.close().catch(() => { /* ignore */ })
  }
}
