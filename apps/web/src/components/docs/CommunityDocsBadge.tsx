import {useTranslations} from "next-intl";
import {Badge} from "@repo/ui/components/badge";
import {UsersIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@repo/ui/components/tooltip";
import {cn} from "@repo/ui/lib/utils";

export default function CommunityDocsBadge({ bright, small }: { bright?: boolean; small?: boolean }) {
  const t = useTranslations('CommunityBadge');

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={bright ? 'secondary' : 'outline'} className={cn('cursor-default', !bright && 'text-secondary', small ? `
            p-1.5
          ` : `px-3 py-1`)}>
            <UsersIcon className={cn(small ? 'h-3.5 w-3.5' :  "mr-2 h-4 w-4")} strokeWidth={2.5} />
            {!small && t('title')}
          </Badge>    
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {t('desc')}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}