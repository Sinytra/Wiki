import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import DocsBranchSelector from "@/components/docs/DocsBranchSelector";
import {Project} from "@/lib/service";

interface Props {
  project?: Project;
  children?: any;
  titleClassName?: string;
  version?: string;
}

export default function DocsContentTitle({ project, children, titleClassName, version }: Props) {
  const t = useTranslations('Badges');

  return (
    <div className="not-prose">
      <div className="flex flex-row flex-wrap md:flex-nowrap justify-between md:items-end gap-2">
        <h1 className={cn("docsContentTitle text-ellipsis md:overflow-hidden md:whitespace-nowrap text-foreground text-2xl", titleClassName)}>
          {children}
        </h1>
        <div className={cn("flex-shrink-0 flex flex-row justify-between gap-3 ml-auto md:ml-0", project?.versions ? 'items-center' : 'items-end')}>
          {project?.local && <Badge variant="destructive">{t('local')}</Badge>}
          {project?.is_community && <CommunityDocsBadge />}
          <div className="hidden md:block">
            {project?.versions && <DocsBranchSelector branch={version} branches={project?.versions} />}
          </div>
        </div>
      </div>
      <hr className="mt-4 mb-6 border-neutral-600"/>
    </div>
  )
}