import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @sparticuz/chromium-min and puppeteer-core must not be webpack-bundled
  // or server routes will fail at runtime. Mark them external so Next
  // leaves them resolved by Node at request time.
  serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],
};

export default nextConfig;
