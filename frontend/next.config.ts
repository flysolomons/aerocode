import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["127.0.0.1"], // Add localhost
  },
  // Ignore ESLint and TypeScript errors during builds as requested
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  productionBrowserSourceMaps: false,
  // Explicitly disable source maps in development
  // devtool: false,
};

export default nextConfig;
