import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import DocsBranchSelector from "@/components/docs/DocsBranchSelector";
import {DocumentationSource, RemoteDocumentationSource} from "@/lib/docs/sources";

interface Props {
  source?: DocumentationSource;
  children?: any;
  titleClassName?: string;
  version: string;
}

export default function DocsContentTitle({ source, children, titleClassName, version }: Props) {
  const t = useTranslations('Badges');

  const isLocal = source?.type === 'local';
  const isCommunity = source?.is_community;
  const hasBranches = source && (source as RemoteDocumentationSource).branches != undefined && Object.keys((source as RemoteDocumentationSource).branches!).length > 0;

  return (
    <div className="not-prose">
      <div className="flex flex-row justify-between items-end">
        <h1 className={cn("text-foreground text-2xl", titleClassName)}>
          {children}
        </h1>
        {isLocal && <Badge variant="destructive">{t('local')}</Badge>}
        {isCommunity && <CommunityDocsBadge />}
        {hasBranches && <DocsBranchSelector branch={version} branches={(source as RemoteDocumentationSource).branches} />}
      </div>
      <hr className="mt-3 mb-6 border-neutral-600"/>
    </div>
  )
}