import DocsSidebarBase from "@/components/docs/side/DocsSidebarBase";
import {cn} from "@/lib/utils";
import service from "@/lib/service";
import {DocsEntryMetadata} from "@repo/shared/types/metadata";
import {AssetLocation} from "@repo/shared/assets";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import EntryDetails from "@/components/docs/util/EntryDetails";
import MetadataRowKey from "@/components/docs/util/MetadataRowKey";
import MetadataGrid from "@/components/docs/util/MetadataGrid";
import {getTranslations} from "next-intl/server";
import {Project} from "@repo/shared/types/service";

interface ContentRightSidebarProps {
  project: Project;
  metadata: DocsEntryMetadata;
  version: string;
}

export default async function DocsGuideContentRightSidebar({ project, metadata, version }: ContentRightSidebarProps) {
  const t = await getTranslations('DocsContentRightSidebar');

  const iconUrl: AssetLocation | null = metadata.hide_icon === true || !metadata.icon && !metadata.id ? null : await service.getAsset(project.id, (metadata.icon || metadata.id)!, version);

  return (
    <DocsSidebarBase
      type="right"
      title={t('title')}
      className={cn(
        'right-0 shrink-0',
        'w-[96vw] sm:w-64'
      )}
    >
      <div className="space-y-2 sm:w-56">
        <div className="m-2 mb-6 rounded-xs border border-tertiary">
          <ImageWithFallback src={iconUrl?.src} width={128} height={128} className={`
            docsContentIcon disable-blur m-4 mx-auto
          `}
                             alt={!iconUrl ? undefined : iconUrl.id}/>
        </div>
        {metadata.title &&
          <h1 className="text-primarys text-center text-lg font-semibold">
            {metadata.title}
          </h1>
        }

        <EntryDetails className="pb-2 text-center">
          {metadata.id &&
            <code className="text-center break-all text-secondary">{metadata.id}</code>
          }
        </EntryDetails>

        <MetadataGrid>
          {metadata.custom && Object.entries(metadata.custom).map(e => (
            <MetadataRowKey key={e[0]} title={e[0]}>{e[1]}</MetadataRowKey>
          ))}
        </MetadataGrid>
      </div>
    </DocsSidebarBase>
  );
}