import {useTranslations} from "next-intl";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@repo/ui/components/tooltip";
import {Button} from "@repo/ui/components/button";
import {FlagIcon} from "lucide-react";
import {cn} from "@repo/ui/lib/utils";
import * as React from "react";
import {ProjectReportType} from "@repo/shared/types/api/moderation";
import {serializeUrlParams} from "@repo/shared/util";
import {NavLink} from "@/components/navigation/link/NavLink";

function createReportLink(project: string, type: ProjectReportType, path: string | null) {
  const params = serializeUrlParams({ project, type, path });
  return `/report?${params}`;
}

export default function ReportPageButton({local, project, path, preview, full}: {
  local?: boolean;
  project: string;
  path?: string[];
  preview: boolean;
  full?: boolean;
}) {
  const t = useTranslations('PageEditControls');
  const reportLink = createReportLink(project, 'docs', path?.join('/') ?? null);

  const content = (
    <Button asChild variant="outline" size="sm"
            className="font-normal text-secondary hover:bg-transparent sm:h-fit sm:border-none sm:p-0">
      <NavLink href={reportLink}>
        <FlagIcon className={cn('mr-2 h-4 w-4', !full && 'sm:mr-0')}/>
        <span className={cn(!full && 'sm:hidden')}>
                {t('report_button')}
              </span>
      </NavLink>
    </Button>
  );

  return !preview && !local && project && path && (
    full
      ?
      content
      :
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent>
            {t('report')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
  )
}