import { use } from "react";
import {allBlogs} from "@/.contentlayer/generated"
import {notFound} from "next/navigation"
import {format, parseISO} from 'date-fns'
import {useMDXComponent} from 'next-contentlayer2/hooks'
import {setContextLocale} from "@/lib/locales/routing";
import BlogHeader from "@/components/navigation/BlogHeader"
import SocialButtons from "@/components/util/SocialButtons"
import {useMDXComponents} from "@/mdx-components";

export const generateStaticParams = async () => allBlogs.map((blog) => ({ slug: blog._raw.flattenedPath }))

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }) => {
    const params = await props.params;
    const post = allBlogs.find((blog) => blog._raw.flattenedPath === params.slug)
    if (!post) return { notFound: true }
    return { title: post.title }
}

function Embed({src, alt, fig, width, height}: { src?: string; alt?: string; fig?: string; width?: any; height?: any }) {
    return (
      <figure style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img className="rounded-xs" style={{border: '1px white solid' }} width={width || '85%'}
               src={src} alt={alt} height={height} />
          <figcaption>{fig}</figcaption>
      </figure>
    )
}

const BlogLayout = (props: { params: Promise<{ slug: string }> }) => {
    const params = use(props.params);
    setContextLocale('en');

    const post = allBlogs.find((blog) => blog._raw.flattenedPath === params.slug)
    if (!post) notFound();

    const MDXContent = useMDXComponent(post.body.code);
    const components = useMDXComponents({Embed});

    return (
        <article className="mx-auto py-8">
            <BlogHeader hideSubtext={true} />

            <div className="mb-8 text-center">
                <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
                    {format(parseISO(post.date), 'LLLL d, yyyy')}
                </time>
                <h1 className="text-3xl font-bold">{post.title}</h1>
                <div className="mx-auto flex justify-center gap-4 text-center">
                    <SocialButtons enableSharing={true} shareData={{
                        url: `https://moddedmc.wiki/blog/${post._raw.flattenedPath}`,
                        title: post.title,
                        text: `moddedmc.wiki Blog - ${post.title} - ${post.excerpt}`
                    }}/>
                </div>
            </div>
            <div className="mx-2 mt-8 flex min-h-[100vh] flex-1 pb-24">
                <div className="flex w-full flex-col items-center gap-4">
                    <div
                        className={`
                          prose w-full max-w-4xl px-2 md:px-0 dark:prose-invert prose-h2:border-b
                          prose-h2:border-b-neutral-700 prose-h2:pb-1 prose-a:text-link prose-a:decoration-1
                          prose-a:underline-offset-4 prose-a:hover:text-link-hover prose-a:hover:underline
                        `}>
                        <MDXContent components={components} />
                    </div>
                </div>
            </div>
        </article>
    )
}

export default BlogLayout