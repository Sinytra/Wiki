import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import DocsEntryTabs from "@/components/docs/tabs/DocsEntryTabs";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";
import {Project} from "@repo/shared/types/service";

interface Props {
  project?: Project;
  showHistory?: boolean;
  children?: any;
  titleClassName?: string;
  className?: string;
}

export default function DocsContentTitle({ project, children, titleClassName, showHistory, className }: Props) {
  const t = useTranslations('Badges');

  return (
    <div className={cn('mb-4 border-b border-secondary pb-2', className)}>
      <div className="flex flex-row flex-wrap justify-between gap-2 md:flex-nowrap md:items-center">
        <h1 className={cn("docsContentTitle text-2xl text-ellipsis text-primary md:overflow-hidden md:whitespace-nowrap", titleClassName)}>
          {children}
        </h1>
        <div className={cn('not-prose ml-auto flex shrink-0 flex-row items-center justify-between gap-3 md:ml-0')}>
          {project?.local && <Badge variant="destructive">{t('local')}</Badge>}
          {project?.is_community && <CommunityDocsBadge />}
          {showHistory &&
            <ClientLocaleProvider keys={['DocsEntryTabs']}>
                <DocsEntryTabs />
            </ClientLocaleProvider>
          }
        </div>
      </div>
    </div>
  )
}