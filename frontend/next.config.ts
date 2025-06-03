import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "backend",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "nginx",
      },

      // add CDN here
    ],
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
