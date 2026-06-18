import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundle sharp native binaries into serverless functions (Vercel linux-x64).
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/sharp/**/*",
      "./node_modules/@img/**/*",
    ],
  },
  experimental: {
    serverActions: {
      // Cover + gallery images (4 MB each) and videos (up to 50 MB)
      bodySizeLimit: "52mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
