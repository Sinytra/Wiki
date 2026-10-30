import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import blog from '@/lib/blog';
import { setContextLocale } from '@/lib/locales/routing';
import BlogHeader from '@/components/navigation/BlogHeader';
import SocialButtons from '@/components/util/SocialButtons';
import { useMDXComponents as getMDXComponents } from '@/mdx-components';
import Callout from '@/components/docs/shared/Callout';
import Asset from '@/components/docs/shared/asset/Asset';
import TooltipText from '@/components/docs/shared/util/TooltipText';
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/seo';

export const generateStaticParams = async () => (await blog.getAllPosts()).map((post) => ({ slug: post.slug }));

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
  const params = await props.params;

  const post = (await blog.getAllPosts()).find((post) => post.slug === params.slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url
    },
    openGraph: {
      siteName: SITE_NAME,
      type: 'article',
      url,
      publishedTime: post.date
    }
  };
};

function Embed({
  src,
  alt,
  fig,
  width,
  height
}: {
  src?: string;
  alt?: string;
  fig?: string;
  width?: any;
  height?: any;
}) {
  return (
    <figure className="not-prose mb-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        className="rounded-xs"
        style={{ border: '1px white solid' }}
        width={width || '85%'}
        src={src}
        alt={alt}
        height={height}
      />
      <figcaption className="mt-1 text-secondary">{fig}</figcaption>
    </figure>
  );
}

const BlogLayout = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  setContextLocale('en');

  const result = await blog.getPost(params.slug);
  if (!result) notFound();

  const { post, Content: MDXContent } = result;
  const components = getMDXComponents({ Embed, Callout, Asset, hint: TooltipText });

  return (
    <article className="mx-auto py-8">
      <BlogHeader hideSubtext={true} />

      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-xs text-tertiary">
          {format(parseISO(post.date), 'LLLL d, yyyy')}
        </time>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="mx-auto flex justify-center gap-4 text-center">
          <SocialButtons
            enableSharing={true}
            shareData={{
              url: `https://moddedmc.wiki/blog/${post.slug}`,
              title: post.title,
              text: `moddedmc.wiki Blog - ${post.title} - ${post.excerpt}`
            }}
          />
        </div>
      </div>
      <div className="mx-2 mt-8 flex min-h-[100vh] flex-1 pb-24">
        <div className="flex w-full flex-col items-center gap-4">
          <div
            className={`prose w-full max-w-4xl px-2 md:px-0 dark:prose-invert prose-h2:border-b prose-h2:border-b-secondary prose-h2:pb-1 prose-a:text-link prose-a:decoration-1 prose-a:underline-offset-4 prose-a:hover:text-link-hover prose-a:hover:underline`}
          >
            <MDXContent components={components} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogLayout;
