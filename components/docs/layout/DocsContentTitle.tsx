import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import DocsBranchSelector from "@/components/docs/DocsBranchSelector";
import {Mod} from "@/lib/service";

interface Props {
  mod?: Mod;
  children?: any;
  titleClassName?: string;
  version?: string;
}

export default function DocsContentTitle({ mod, children, titleClassName, version }: Props) {
  const t = useTranslations('Badges');

  return (
    <div className="not-prose">
      <div className="flex flex-row flex-wrap md:flex-nowrap justify-between md:items-end gap-2">
        <h1 className={cn("docsContentTitle text-ellipsis md:overflow-hidden md:whitespace-nowrap text-foreground text-2xl", titleClassName)}>
          {children}
        </h1>
        <div className={cn("flex-shrink-0 flex flex-row justify-between gap-3 ml-auto md:ml-0", mod?.branches ? 'items-center' : 'items-end')}>
          {mod?.local && <Badge variant="destructive">{t('local')}</Badge>}
          {mod?.is_community && <CommunityDocsBadge />}
          {mod?.branches && <DocsBranchSelector branch={version} branches={mod?.branches} />}
        </div>
      </div>
      <hr className="mt-4 mb-6 border-neutral-600"/>
    </div>
  )
}