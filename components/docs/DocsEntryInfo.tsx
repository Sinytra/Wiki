import MetadataGrid from "@/components/docs/mod-metadata/MetadataGrid";
import MetadataRowKey from "@/components/docs/mod-metadata/MetadataRowKey";
import LinkTextButton from "@/components/ui/link-text-button";
import {DocsEntryMetadata, ModContentType} from "@/lib/docs/metadata";
import {BoxIcon} from "lucide-react";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import {ModProject} from "@/lib/platforms";
import assets, {AssetLocation, resourceLocationToString} from "@/lib/docs/assets";
import {DocumentationSource} from "@/lib/docs/sources";
import Image from "next/image";

interface Props {
  source: DocumentationSource;
  project: ModProject;
  metadata: DocsEntryMetadata;
}

const typeNames: { [key in ModContentType]: string } = {
  block: 'Block',
  item: 'Item',
  other: 'Other'
}

export default async function DocsEntryInfo({source, project, metadata}: Props) {
  const iconUrl: AssetLocation | null = metadata.hide_icon === true || !metadata.icon && !metadata.id ? null : await assets.getAssetResource((metadata.icon || metadata.id)!, source);

  return (
    <div className="flex flex-col mb-2">
      <DocsSidebarTitle>
        Information
      </DocsSidebarTitle>

      <div className="mb-6 border border-accent m-2 rounded-sm">
        {iconUrl
          ? <img src={iconUrl.src} alt={resourceLocationToString(iconUrl.id)} width={128} height={128}
                 className="m-4 mx-auto"/>
          : <BoxIcon strokeWidth={1} className="m-4 mx-auto text-muted-foreground opacity-20" width={128} height={128}/>
        }
      </div>

      <div className="mb-4">
        <MetadataGrid>
          <MetadataRowKey title="Name">{metadata.title || 'Unknown'}</MetadataRowKey>
          <MetadataRowKey title="Source Mod">
            <LinkTextButton href={`/mod/${project.slug}`}>{project.name}</LinkTextButton>
          </MetadataRowKey>
          <MetadataRowKey title="ID">
            {metadata.id ? <code>{metadata.id}</code> : 'Unknown'} 
          </MetadataRowKey>
          <MetadataRowKey
            title="Type">{metadata.type && typeNames[metadata.type] || typeNames['other']}</MetadataRowKey>
          {metadata.custom && Object.entries(metadata.custom).map(e => (
            <MetadataRowKey key={e[0]} title={e[0]}>{e[1]}</MetadataRowKey>
          ))}
        </MetadataGrid>
      </div>

      <hr/>
    </div>
  )
}