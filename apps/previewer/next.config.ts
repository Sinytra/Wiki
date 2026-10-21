import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';
import { type CodeHikeConfig } from 'codehike/mdx';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/components/i18n/request.tsx');

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [{ hostname: 'media.forgecdn.net' }, { hostname: 'cdn.modrinth.com' }]
  },
  // Backwards compatibility only
  async redirects() {
    return [
      {
        source: '/:lang/mod/:project',
        destination: '/:lang/project/:project/latest',
        permanent: true
      },
      {
        source: '/:lang/project/:project',
        destination: '/:lang/project/:project/latest',
        permanent: true
      },
      {
        source: '/:lang/mod/:project/docs/:path*',
        destination: '/:lang/project/:project/latest/docs/:path*',
        permanent: true
      },
      {
        source: '/:lang/project/:project/docs/:path*',
        destination: '/:lang/project/:project/latest/docs/:path*',
        permanent: true
      }
    ];
  },
  env: {
    NEXT_PUBLIC_DISABLE_COOKIE_CONSENT: 'true',
    NEXT_PUBLIC_ENABLE_LOCAL_PREVIEW: 'true',
    NEXT_PUBLIC_BUILTIN_ASSET_SOURCES: 'https://r2.sinytra.org/'
  },
  transpilePackages: ['@repo/ui'],
  serverExternalPackages: ['@sinytra/wiki-wasm'],
  experimental: {
    optimizePackageImports: ['shiki']
  },
  assetPrefix: process.env.STATIC_ASSETS_URL,
  output: 'standalone'
};

const chConfig: CodeHikeConfig = {
  components: { code: 'CodeHikeCode' }
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm'], ['remark-codehike', chConfig]],
    rehypePlugins: [['rehype-slug']],
    // @ts-expect-error package names
    recmaPlugins: [['recma-codehike', chConfig]]
  }
});

export default withNextIntl(withMDX(nextConfig));
