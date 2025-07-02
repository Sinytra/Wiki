import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import {withContentlayer} from 'next-contentlayer2';
import {remarkCodeHike, recmaCodeHike, type CodeHikeConfig} from 'codehike/mdx';
import locales from '@repo/shared/lang/locales';
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
      }
    ]
  },
  transpilePackages: ['@repo/ui'],
  experimental: {
    optimizePackageImports: ['shiki']
  }
};

const chConfig: CodeHikeConfig = {
  components: {code: 'CodeHikeCode'},
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, [remarkCodeHike, chConfig]],
    rehypePlugins: [rehypeSlug],
    recmaPlugins: [[recmaCodeHike, chConfig]]
  }
})

export default withContentlayer(withNextIntl(withMDX(nextConfig)));
