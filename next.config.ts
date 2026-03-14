import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === 'true';
const repoName = process.env.NEXT_PUBLIC_REPO_NAME || process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const basePath = isStaticExport && repoName ? `/${repoName}` : '';

const nextConfig: NextConfig = {
  output: isStaticExport ? 'export' : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.bleepingcomputer.com',
      },
      {
        protocol: 'https',
        hostname: '*.krebsonsecurity.com',
      },
      {
        protocol: 'https',
        hostname: '*.therecord.media',
      },
      {
        protocol: 'https',
        hostname: '*.thehackernews.com',
      },
      {
        protocol: 'https',
        hostname: '*.securityweek.com',
      },
      {
        protocol: 'https',
        hostname: '*.zdnet.com',
      },
      {
        protocol: 'https',
        hostname: '*.csoonline.com',
      },
      {
        protocol: 'https',
        hostname: '*.darkreading.com',
      },
      {
        protocol: 'https',
        hostname: '*.mitre.org',
      },
      {
        protocol: 'https',
        hostname: '*.nist.gov',
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.akamaihd.net',
      },
      {
        protocol: 'https',
        hostname: '*.staticflickr.com',
      },
      {
        protocol: 'https',
        hostname: '*.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '*.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '*.twimg.com',
      },
      {
        protocol: 'https',
        hostname: '*.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
