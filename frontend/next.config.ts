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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "solair.com.sb",
      },
      {
        protocol: "http",
        hostname: "dev.solair.com.sb",
      },
      {
        protocol: "http",
        hostname: "test.solair.com.sb",
      },
      {
        protocol: "https",
        hostname: "test.solair.com.sb",
      },
      {
        protocol: "http",
        hostname: "20.188.237.9",
      },
      {
        protocol: "https",
        hostname: "staerocodetest.blob.core.windows.net",
      },
      {
        protocol: "http",
        hostname: "192.168.18.118",
      },

      // add CDN here
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
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
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@apollo/client', 'framer-motion'],
    optimizeCss: true,
  },
};

export default nextConfig;
