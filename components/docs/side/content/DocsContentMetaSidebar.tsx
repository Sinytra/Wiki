import {cn} from "@/lib/utils";
import ScrollableDocsSidebarBase from "@/components/docs/side/ScrollableDocsSidebarBase";
import service, {Project} from "@/lib/service";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import {AssetLocation} from "@/lib/assets";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import EntryDetails from "@/components/docs/util/EntryDetails";
import MetadataGrid from "@/components/docs/util/MetadataGrid";
import MetadataRowKey from "@/components/docs/util/MetadataRowKey";

interface Props {
  title: string;
  project: Project;
  metadata: DocsEntryMetadata;
  version: string;
}

async function SidebarContent({project, metadata, version}: Props) {
  const iconUrl: AssetLocation | null = metadata.hide_icon === true || !metadata.icon && !metadata.id ? null : await service.getAsset(project.id, (metadata.icon || metadata.id)!, version);

  return (
    <>
      <div className="mb-6 border border-tertiary m-2 rounded-sm">
        <ImageWithFallback src={iconUrl?.src} width={112} height={112}
                           className="docsContentIcon m-4 mx-auto disable-blur"
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
    </>
  )
}

export default function DocsContentMetaSidebar(props: Props) {
  return (
    <ScrollableDocsSidebarBase
      type="right"
      title={props.title}
      className={cn(
        'shrink-0 right-0',
        'w-[96vw] sm:w-64'
      )}
      tagName="nav"
      innerClassName="overscroll-contain"
    >
      <SidebarContent {...props}/>
    </ScrollableDocsSidebarBase>
  )
}
