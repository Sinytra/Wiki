import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import {Project} from "@/lib/service";

interface Props {
  project?: Project;
  children?: any;
  titleClassName?: string;
}

export default function DocsContentTitle({ project, children, titleClassName }: Props) {
  const t = useTranslations('Badges');

  return (
    <div className="mb-6">
      <div className="flex flex-row flex-wrap md:flex-nowrap justify-between md:items-center gap-2">
        <h1 className={cn("docsContentTitle text-ellipsis md:overflow-hidden md:whitespace-nowrap text-primary text-2xl", titleClassName)}>
          {children}
        </h1>
        <div className={cn("not-prose shrink-0 flex flex-row justify-between gap-3 ml-auto md:ml-0", project?.versions ? 'items-center' : 'items-end')}>
          {project?.local && <Badge variant="destructive">{t('local')}</Badge>}
          {project?.is_community && <CommunityDocsBadge />}
        </div>
      </div>
    </div>
  )
}