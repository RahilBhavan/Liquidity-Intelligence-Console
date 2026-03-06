/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  // Tree-shake large packages (recharts) for smaller serverless bundles
  experimental: {
    optimizePackageImports: ["recharts"],
  },
};

module.exports = nextConfig;
