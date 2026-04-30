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
  // Keys are route file paths under app/, NOT URL paths. The tracer
  // matches against the source file location, so `/api/gtm/render-png`
  // (URL) won't match - it has to be `app/api/gtm/render-png/route` to
  // hit the App Router route file. Wildcards are also supported.
  outputFileTracingIncludes: {
    "app/api/gtm/**": [
      "./node_modules/@sparticuz/chromium/bin/**",
      "./node_modules/@sparticuz/chromium/build/**",
    ],
  },
};

export default nextConfig;
