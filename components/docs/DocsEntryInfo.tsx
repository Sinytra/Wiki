import MetadataGrid from "@/components/docs/mod-metadata/MetadataGrid";
import MetadataRowKey from "@/components/docs/mod-metadata/MetadataRowKey";
import LinkTextButton from "@/components/ui/link-text-button";
import {DocsEntryMetadata, ModContentType} from "@/lib/docs/metadata";
import {BoxIcon} from "lucide-react";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import {ModProject} from "@/lib/platforms";

interface Props {
  project: ModProject;
  metadata: DocsEntryMetadata;
}

// TODO Localize
const typeNames: { [key in ModContentType]: string } = {
  block: 'Block',
  item: 'Item',
  other: 'Other'
}

export default function DocsEntryInfo({ project, metadata }: Props) {
  return (
    <div className="flex flex-col mb-2">
      <DocsSidebarTitle>
        Information
      </DocsSidebarTitle>

      <div className="mb-6 border border-accent m-2 rounded-sm">
        <BoxIcon strokeWidth={1} className="m-4 mx-auto text-muted-foreground opacity-20" width={128} height={128}/>
      </div>

      <div className="mb-4">
        <MetadataGrid>
          <MetadataRowKey title="Name">{metadata.title || 'Unknown'}</MetadataRowKey>
          <MetadataRowKey title="Source Mod">
            <LinkTextButton href={`/mod/${project.slug}`}>{project.name}</LinkTextButton>
          </MetadataRowKey>
          <MetadataRowKey title="ID">{metadata.id || 'Unknown'}</MetadataRowKey>
          <MetadataRowKey title="Type">{metadata.type && typeNames[metadata.type] || typeNames['other']}</MetadataRowKey>
        </MetadataGrid>
      </div>

      <hr/>
    </div>
  )
}