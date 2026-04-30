import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @sparticuz/chromium ships a binary; it must not be webpack-bundled or
  // server routes will fail at runtime. Mark both packages as external so
  // Next leaves them resolved by Node at request time.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],

  // Vercel's serverless function bundler tracks file usage statically and
  // strips files it can't see being imported. The Chromium binary AND its
  // bundled .so libraries (libnss3, libnssutil3, libsmime3, libplc4, ...)
  // are loaded at runtime via dlopen from the binary itself, not via JS
  // imports - so the tracer prunes them. The puppeteer launch then dies
  // with `libnss3.so: cannot open shared object file`.
  //
  // outputFileTracingIncludes forces the bundler to ship the entire
  // @sparticuz/chromium package contents alongside any route that uses
  // it. Patterns are relative to the project root.
  outputFileTracingIncludes: {
    "/api/gtm/render-png": ["./node_modules/@sparticuz/chromium/**"],
    "/api/gtm/carousel-download": ["./node_modules/@sparticuz/chromium/**"],
    "/api/gtm/backgrounds-export": ["./node_modules/@sparticuz/chromium/**"],
    "/api/gtm/brand-backgrounds-export": ["./node_modules/@sparticuz/chromium/**"],
  },
};

export default nextConfig;
