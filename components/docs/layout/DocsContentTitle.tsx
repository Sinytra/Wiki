import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import {Project} from "@/lib/service";
import DocsEntryTabs from "@/components/docs/tabs/DocsEntryTabs";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

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
    <div className={cn('mb-4 pb-2 border-b border-secondary', className)}>
      <div className="flex flex-row flex-wrap md:flex-nowrap justify-between md:items-center gap-2">
        <h1 className={cn("docsContentTitle text-ellipsis md:overflow-hidden md:whitespace-nowrap text-primary text-2xl", titleClassName)}>
          {children}
        </h1>
        <div className={cn('not-prose shrink-0 flex flex-row justify-between gap-3 ml-auto md:ml-0 items-center')}>
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