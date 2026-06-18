import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep native sharp binary external so Vercel serverless can load libvips
  serverExternalPackages: ["sharp"],
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
