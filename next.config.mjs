import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect specific Vercel domains to canonical domain
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'freegenie3-bxsv-rockyandtoms-projects.vercel.app',
          },
        ],
        destination: 'https://freegenie3.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'freegenie3-bxsv-git-main-rockyandtoms-projects.vercel.app',
          },
        ],
        destination: 'https://freegenie3.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'freegenie3-bxsv-hqupl82mb-rockyandtoms-projects.vercel.app',
          },
        ],
        destination: 'https://freegenie3.com/:path*',
        permanent: true,
      },
      // Redirect any other Vercel domains to canonical domain
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(.*)\\.vercel\\.app',
          },
        ],
        destination: 'https://freegenie3.com/:path*',
        permanent: true,
      },
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.freegenie3.com',
          },
        ],
        destination: 'https://freegenie3.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
  experimental: {
    mdxRs: true,
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));