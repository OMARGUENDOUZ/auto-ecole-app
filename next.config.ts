import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const imageHost = process.env.NEXT_PUBLIC_IMAGE_HOST;

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname)
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
