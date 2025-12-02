import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during the build process
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during the build process
  },
  devIndicators: false
};

export default nextConfig;
