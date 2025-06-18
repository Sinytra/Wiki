import {useTranslations} from "next-intl";
import {cn} from "@/lib/utils";
import * as React from "react";
import {GitCommitHorizontalIcon} from "lucide-react";
import LocalDateTime from "@/components/util/LocalDateTime";


import {ProjectRevision} from "@repo/shared/types/api/project";

function LinkWithFallback({className, href, children}: { className?: string, href?: string; children?: any }) {
  return (
    href ?
      <a href={href} target="_blank" className={cn(className, 'hover:underline hover:underline-offset-4')}>
        {children}
      </a>
      :
      <span className={className}>
        {children}
      </span>
  );
}

export default function ProjectGitRevision({revision, loading, current}: {
  revision: ProjectRevision | null;
  loading: boolean;
  current?: boolean;
}) {
  const t = useTranslations('ProjectGitRevision');

  return (
    <div className="border-tertiary bg-primary-dim flex flex-col gap-2 rounded-sm border p-3">
      <div className="flex flex-row items-center gap-2">
        <span>
          {t(current ? 'title_current' : 'title')}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex w-full flex-row items-center gap-2">
          <GitCommitHorizontalIcon className="size-5"/>
          {revision ?
            <div className="flex w-full flex-row flex-wrap items-start gap-4 text-sm sm:flex-nowrap">
              <LinkWithFallback href={revision.url} className="text-secondary shrink-0 font-mono">
                {revision.hash}
              </LinkWithFallback>
              <span className="text-secondary" title={revision.authorEmail}>
                {revision.authorName}
              </span>
              <LinkWithFallback href={revision.url}>
                {revision.message}
              </LinkWithFallback>
              <span className="text-secondary ml-auto shrink-0 text-sm">
                <LocalDateTime dateTime={new Date(revision.date)}/>
              </span>
            </div>
            :
            (loading ?
                <div className="text-secondary text-sm">
                  {t('loading')}
                </div>
                :
                <div className="text-secondary text-sm">
                  {t('not_found')}
                </div>
            )
          }
        </div>
      </div>
    </div>
  )
}