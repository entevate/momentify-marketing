import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @sparticuz/chromium ships a binary; it must not be webpack-bundled or
  // server routes will fail at runtime. Mark both packages as external so
  // Next leaves them resolved by Node at request time.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
};

export default nextConfig;
