import Link from "next/link";
import BlogHeader from "@/components/navigation/BlogHeader";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {useTranslations} from "next-intl";
import {setContextLocale} from "@/lib/locales/routing";

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
    <div className={cn('border px-3 py-2 rounded-sm', latest ? 'border-[var(--vp-c-brand-1)]' : 'border-neutral-600')}>
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row items-center w-fit gap-2">
          <Link href={`/blog/post/${id}`} className="text-lg !no-underline hover:!underline">
            {name}
          </Link>

          {latest &&
              <Badge variant="secondary" className="border-[var(--vp-c-brand-1)]">
                {t('latest')}
              </Badge>
          }
        </div>

        <span className="text-muted-foreground">{date}</span>
      </div>

      <span className="font-normal text-muted-foreground">{desc}</span>
    </div>
  )
}

export default async function Blog() {
  setContextLocale('en');

  return (
    <div className="flex flex-col">
      <BlogHeader/>

      <span className="text-xl mb-4 pb-1 border-b">Recent posts</span>

      <div className="flex flex-col gap-6">
        <BlogPost
          id="2024-10-27-search"
          name="The search & versions update"
          desc="Global search, versioned documentation and new customization options!"
          date="2024-10-27"
          latest
        />
        
        <BlogPost
          id="2024-10-05-community-docs"
          name="The community wiki update"
          desc="In the first major wiki update, we're introducing community docs and UI localization"
          date="2024-10-05"
        />

        <BlogPost
          id="2024-09-10-introduction"
          name="Introducing the Modded Minecraft Wiki!"
          desc="Sinytra is proud to present our latest project in the modding community"
          date="2024-09-10"
        />
      </div>
    </div>
  );
}
