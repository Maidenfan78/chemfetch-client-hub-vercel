import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/client_hub',
  assetPrefix: '/client_hub',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
