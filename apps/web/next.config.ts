import {withSentryConfig} from '@sentry/nextjs';
import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';
import {withContentlayer} from 'next-contentlayer2';
import {type CodeHikeConfig} from 'codehike/mdx';
import locales from '@repo/shared/locales';
import type {NextConfig} from 'next';

const withNextIntl = createNextIntlPlugin(
  './src/components/i18n/request.tsx'
);

const intlMatcher = locales.getLanguagePaths().join('|');

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [{hostname: 'media.forgecdn.net'}, {hostname: 'cdn.modrinth.com'}]
  },
  async headers() {
    return [
      {
        source: `/((?:${intlMatcher})/)?(mod|project|about)/:path*`,
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=604800, stale-while-revalidate=86400',
          },
          {
            key: 'CDN-Cache-Control',
            value: 's-maxage=31536000, stale-while-revalidate=86400',
          }
        ]
      },
      ...(process.env.STATIC_ASSETS_URL ? [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: `default-src 'self'; script-src 'self' ${process.env.STATIC_ASSETS_URL} 'unsafe-inline'; style-src 'self' ${process.env.STATIC_ASSETS_URL} 'unsafe-inline'; img-src 'self' ${process.env.STATIC_ASSETS_URL}; font-src 'self' ${process.env.STATIC_ASSETS_URL};`,
            },
          ],
        }
      ] : [])
    ]
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
  transpilePackages: ['@repo/ui'],
  experimental: {
    optimizePackageImports: ['shiki']
  },
  assetPrefix: process.env.STATIC_ASSETS_URL
};

const chConfig: CodeHikeConfig = {
  components: {code: 'CodeHikeCode'},
}

const withMDX = createMDX({
  options: {
    // @ts-expect-error package names
    remarkPlugins: [['remark-gfm'], ['remark-codehike', chConfig]],
    // @ts-expect-error package names
    rehypePlugins: [['rehype-slug']],
    // @ts-expect-error package names
    recmaPlugins: [['recma-codehike', chConfig]]
  }
})

export default withSentryConfig(withContentlayer(withNextIntl(withMDX(nextConfig))), {
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  telemetry: false
});