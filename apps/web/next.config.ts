import {withSentryConfig} from '@sentry/nextjs';
import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';
import {withContentlayer} from 'next-contentlayer2';
import {type CodeHikeConfig} from 'codehike/mdx';
import type {NextConfig} from 'next';

const withNextIntl = createNextIntlPlugin(
  './src/components/i18n/request.tsx'
);

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [{hostname: 'media.forgecdn.net'}, {hostname: 'cdn.modrinth.com'}]
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