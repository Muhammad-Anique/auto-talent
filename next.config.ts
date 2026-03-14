import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone', // Enable standalone mode for Docker deployment
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "img.freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https" as const,
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https" as const,
        hostname: "gxvrkmueqemyudmnonji.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    unoptimized: true, // Add this for local development
  },
};

export default withNextIntl(nextConfig);
