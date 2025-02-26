import DocsSidebarBase from "@/components/docs/side/DocsSidebarBase";
import {cn} from "@/lib/utils";
import service, {Project} from "@/lib/service";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import {AssetLocation} from "@/lib/assets";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import EntryDetails from "@/components/docs/util/EntryDetails";
import MetadataRowKey from "@/components/docs/util/MetadataRowKey";
import MetadataGrid from "@/components/docs/util/MetadataGrid";
import {getTranslations} from "next-intl/server";

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
        'shrink-0 right-0 pl-8',
        'data-[open=false]:translate-x-full lg:data-[open=false]:translate-x-0',
        'border-l data-[open=false]:border-0 lg:data-[open=false]:border-l'
      )}
    >
      <div className="space-y-2 w-[96vw] sm:w-56">
        <div className="mb-6 border border-tertiary m-2 rounded-xs">
          <ImageWithFallback src={iconUrl?.src} width={128} height={128} className="docsContentIcon m-4 mx-auto disable-blur"
                             alt={!iconUrl ? undefined : iconUrl.id}/>
        </div>
        {metadata.title &&
          <h1 className="text-center text-lg text-primarys font-semibold">
            {metadata.title}
          </h1>
        }

        <EntryDetails className="pb-2 text-center">
          {metadata.id &&
            <code className="text-center text-secondary break-all">{metadata.id}</code>
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