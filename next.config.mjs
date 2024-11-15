import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';
import available from "./lib/locales/available.js";
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

const withNextIntl = createNextIntlPlugin(
    './components/i18n/request.tsx'
);

const intlMatcher = available.getLanguagePaths().join('|');

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    async headers() {
        return [
            {
                source: `/((?:${intlMatcher})/)?(mod|about)/:path*`,
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
    }
};

const withMDX = createMDX({
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            [rehypePrettyCode, {theme: 'plastic'}],
            rehypeSlug
        ]
    }
})

export default withNextIntl(withMDX(nextConfig));
