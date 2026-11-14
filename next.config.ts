import type { NextConfig } from 'next';
const pages = process.env.DEPLOY_TARGET === 'pages';
const basePath = pages ? (process.env.PAGES_BASE_PATH ?? '/UVACO_Lecture') : '';
const config: NextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  ...(pages ? { output: 'export' as const, trailingSlash: true } : {}),
  basePath,
  // Static Pages builds exclude route.ts server handlers; Node builds retain them.
  pageExtensions: pages ? ['tsx', 'jsx'] : ['tsx', 'ts', 'jsx', 'js'],
  images: { unoptimized: pages },
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_STATIC_SITE: String(pages) },
  poweredByHeader: false,
  experimental: { cpus: 2 },
  ...(!pages ? { async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=(self)' },
    ] }];
  } } : {}),
};
export default config;
