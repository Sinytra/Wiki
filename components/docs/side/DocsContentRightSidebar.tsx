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

export default async function DocsContentRightSidebar({ project, metadata, version }: ContentRightSidebarProps) {
  const t = await getTranslations('DocsContentRightSidebar');

  const iconUrl: AssetLocation | null = metadata.hide_icon === true || !metadata.icon && !metadata.id ? null : await service.getAsset(project.id, (metadata.icon || metadata.id)!, version);

  return (
    <DocsSidebarBase
      type="right"
      title={t('title')}
      className={cn(
        'flex-shrink-0 right-0',
        'w-[96vw] sm:w-64 data-[open=false]:translate-x-full data-[open=false]:lg:translate-x-0',
        'border-l data-[open=false]:border-0 data-[open=false]:lg:border-l'
      )}
    >
      <div className="mb-6 border border-accent m-2 rounded-sm">
        <ImageWithFallback src={iconUrl?.src} width={128} height={128} className="docsContentIcon m-4 mx-auto"
                           alt={!iconUrl ? undefined : iconUrl.id}/>
      </div>
      {metadata.title &&
        <h1 className="text-center text-lg text-foregrounds font-semibold">
          {metadata.title}
        </h1>
      }

      <EntryDetails className="pb-2 text-center">
        {metadata.id &&
          <code className="text-center text-muted-foreground">{metadata.id}</code>
        }
      </EntryDetails>

      <MetadataGrid>
        {metadata.custom && Object.entries(metadata.custom).map(e => (
          <MetadataRowKey key={e[0]} title={e[0]}>{e[1]}</MetadataRowKey>
        ))}
      </MetadataGrid>

    </DocsSidebarBase>
  );
}