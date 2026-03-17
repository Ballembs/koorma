import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Allow large PDF uploads for admin textbook ingestion (67-143MB)
  serverExternalPackages: ['pdf-lib'],
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
};

export default nextConfig;
