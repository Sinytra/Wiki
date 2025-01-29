import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';
import available from "./lib/locales/available.js";
import remarkGfm from 'remark-gfm';
import rehypeSlug from "rehype-slug";
import { withContentlayer } from "next-contentlayer";
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx";

const withNextIntl = createNextIntlPlugin(
    './components/i18n/request.tsx'
);

const intlMatcher = available.getLanguagePaths().join('|');

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    images: {
      remotePatterns: [{ hostname: 'media.forgecdn.net' }, { hostname: 'cdn.modrinth.com' }]
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
    experimental: {
        optimizePackageImports: ['shiki']
    }
};

const chConfig = {
    components: { code: "CodeHikeCode" },
}

const withMDX = createMDX({
    options: {
        remarkPlugins: [remarkGfm, [remarkCodeHike, chConfig]],
        rehypePlugins: [rehypeSlug],
        recmaPlugins: [[recmaCodeHike, chConfig]]
    }
})

export default withContentlayer(withNextIntl(withMDX(nextConfig)));
