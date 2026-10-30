import { withSentryConfig } from '@sentry/nextjs/config';
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
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:locale/project/:slug/:version/docs.md',
          destination: '/api/raw/:locale/:slug/:version/docs'
        },
        {
          source: '/:locale/project/:slug/:version/docs/:path(.*)\\.md',
          destination: '/api/raw/:locale/:slug/:version/docs/:path'
        },
        {
          source: '/:locale/project/:slug/:version/content/:id.md',
          destination: '/api/raw/:locale/:slug/:version/content/:id'
        }
      ],
      afterFiles: [],
      fallback: []
    };
  },
  // Backwards compatibility only
  async redirects() {
    return [
      {
        source: '/blog/post/:path',
        destination: '/blog/:path',
        permanent: true
      },
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
      },
      ...JSON.parse(process.env.REDIRECTS || '[]')
    ];
  },
  transpilePackages: ['@repo/ui', '@sinytra/wiki-api-types'],
  outputFileTracingIncludes: {
    '/\\[locale\\]': ['../../blogs/*.mdx'],
    '/blog': ['../../blogs/*.mdx'],
    '/blog/\\[slug\\]': ['../../blogs/*.mdx']
  },
  experimental: {
    optimizePackageImports: ['shiki']
  },
  assetPrefix: process.env.STATIC_ASSETS_URL,
  agentRules: false
};

const chConfig: CodeHikeConfig = {
  components: { code: 'CodeHikeCode' }
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm'], ['remark-codehike', chConfig]],
    rehypePlugins: [['rehype-slug']],
    recmaPlugins: [['recma-codehike', chConfig]]
  }
});

export default withSentryConfig(withNextIntl(withMDX(nextConfig)), {
  silent: !process.env.CI,
  widenClientFileUpload: true,
  telemetry: false,
  applicationKey: 'moddedwiki',
  bundleSizeOptimizations: {
    excludeDebugStatements: process.env.NODE_ENV === 'production'
  }
});
