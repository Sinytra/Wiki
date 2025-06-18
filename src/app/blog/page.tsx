import Link from "next/link";
import BlogHeader from "@/components/navigation/BlogHeader";
import {cn} from "@/lib/utils";
import {Badge} from "@repo/ui/components/badge";
import {useTranslations} from "next-intl";
import {setContextLocale} from "@/lib/locales/routing";
import {allBlogs} from "@/.contentlayer/generated";
import {compareDesc, formatDistanceStrict} from "date-fns";

export const dynamic = 'force-static';

function BlogPost({id, name, desc, date, latest}: {
  id: string,
  name: string,
  desc: string,
  date: string,
  latest?: boolean
}) {
  const t = useTranslations('Badges');

  return (
    <div className={cn('rounded-sm border px-3 py-2', latest ? 'border-[var(--vp-c-brand-1)]' : 'border-neutral-600')}>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex w-fit flex-row items-center gap-2">
          <Link href={`/blog/${id.replace(".mdx", "")}`} className="text-lg no-underline! hover:underline!">
            {name}
          </Link>

          {latest &&
            <Badge variant="secondary" className="border-[var(--vp-c-brand-1)]">
              {t('latest')}
            </Badge>
          }
        </div>

        <span className="text-secondary">{formatDistanceStrict(date, new Date(), { addSuffix: true })}</span>
      </div>

      <span className="text-secondary font-normal">{desc}</span>
    </div>
  )
}

export default async function Blog() {
  setContextLocale('en');

  const blogPosts = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <div className="flex flex-col">
      <BlogHeader hideSubtext={false} />

      <span className="border-tertiary mb-4 border-b pb-1 text-xl">Recent posts</span>

      <div className="flex flex-col gap-6">
        {...blogPosts.map((post, index) => (
          <BlogPost key={post._id} id={post._id} name={post.title} desc={post.excerpt} date={post.date}
                    latest={index === 0}/>
        ))}
      </div>
    </div>
  );
}
