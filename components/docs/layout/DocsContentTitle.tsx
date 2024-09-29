import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";

export default function DocsContentTitle({ isLocal, isCommunity, children, titleClassName }: { isLocal?: boolean, isCommunity?: boolean, children?: any, titleClassName?: string }) {
  const t = useTranslations('Badges');

  return (
    <div className="not-prose">
      <div className="flex flex-row justify-between items-end">
        <h1 className={cn("text-foreground text-2xl", titleClassName)}>
          {children}
        </h1>
        {isLocal && <Badge variant="destructive">{t('local')}</Badge>}
        {isCommunity && <CommunityDocsBadge />}
      </div>
      <hr className="mt-4 mb-6 border-neutral-600"/>
    </div>
  )
}