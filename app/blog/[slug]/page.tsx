import { allBlogs } from "@/.contentlayer/generated"
import { notFound } from "next/navigation"
import { format, parseISO } from 'date-fns'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { useMDXComponents } from "mdx-components"
import { setContextLocale } from "@/lib/locales/routing";
import Header from "@/components/navigation/header"
import BlogHeader from "@/components/navigation/BlogHeader"
import SocialButtons from "@/components/ui/custom/SocialButtons"
import { Button } from "@/components/ui/button"

export const generateStaticParams = async () => allBlogs.map((blog) => ({ slug: blog._raw.flattenedPath }))

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
    const post = allBlogs.find((blog) => blog._raw.flattenedPath === params.slug)
    if (!post) return { notFound: true }
    return { title: post.title }
}

const BlogLayout = ({ params }: { params: { slug: string } }) => {
    setContextLocale('en');

    const post = allBlogs.find((blog) => blog._raw.flattenedPath === params.slug)
    if (!post) notFound();

    const MDXContent = useMDXComponent(post.body.code);
    const components = useMDXComponents({});

    return (
        <article className="mx-auto py-8">
            <BlogHeader hideSubtext={true} />

            <div className="mb-8 text-center">
                <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
                    {format(parseISO(post.date), 'LLLL d, yyyy')}
                </time>
                <h1 className="text-3xl font-bold">{post.title}</h1>
                <div className="mx-auto text-center flex justify-center gap-4">
                    <SocialButtons enableSharing={true} shareData={{
                        url: `https://moddedmc.wiki/blog/${post._raw.flattenedPath}`,
                        title: post.title,
                        text: `moddedmc.wiki Blog - ${post.title} - ${post.excerpt}`
                    }}/>
                </div>
            </div>
            <div className="flex flex-1 min-h-[100vh] mx-2 mt-8 pb-24">
                <div className="flex flex-col gap-4 w-full items-center">
                    <div
                        className="prose prose-h2:border-b prose-h2:border-b-neutral-700 prose-h2:pb-1 dark:prose-invert w-full max-w-4xl px-2 md:px-0">
                        <MDXContent components={components} />
                    </div>
                </div>
            </div>
        </article>
    )
}

export default BlogLayout