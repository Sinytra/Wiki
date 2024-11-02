import MetadataGrid from "@/components/docs/mod-metadata/MetadataGrid";
import MetadataRowKey from "@/components/docs/mod-metadata/MetadataRowKey";
import LinkTextButton from "@/components/ui/link-text-button";
import {DocsEntryMetadata, ModContentType} from "@/lib/docs/metadata";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import {ModProject} from "@/lib/facade/platformsFacade";
import {DocumentationSource} from "@/lib/docs/sources";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {getTranslations} from "next-intl/server";
import {AssetLocation} from "@/lib/base/assets";
import assetsFacade from "@/lib/facade/assetsFacade";
import resourceLocation from "@/lib/base/resourceLocation";

interface Props {
  source: DocumentationSource;
  project: ModProject;
  metadata: DocsEntryMetadata;
}

const types: ModContentType[] = ['block', 'item', 'other'];

export default async function DocsEntryInfo({source, project, metadata}: Props) {
  const iconUrl: AssetLocation | null = metadata.hide_icon === true || !metadata.icon && !metadata.id ? null : await assetsFacade.getAssetResource((metadata.icon || metadata.id)!, source);
  const t = await getTranslations('DocsEntryInfo');

  return (
    <div className="flex flex-col mb-2">
      <DocsSidebarTitle>
        {t('title')}
      </DocsSidebarTitle>

      <div className="mb-6 border border-accent m-2 rounded-sm">
        <ImageWithFallback src={iconUrl?.src} width={128} height={128} className="docsContentIcon m-4 mx-auto"
                           alt={!iconUrl ? undefined : resourceLocation.toString(iconUrl.id)}/>
      </div>

      <div className="mb-4">
        <MetadataGrid>
          {metadata.title && <MetadataRowKey title={t('name')}>{metadata.title}</MetadataRowKey>}
          <MetadataRowKey title={t('source')}>
            <LinkTextButton href={`/mod/${source.id}`}>{project.name}</LinkTextButton>
          </MetadataRowKey>
          {metadata.id && <MetadataRowKey title={t('id')}>{metadata.id}</MetadataRowKey>}
          <MetadataRowKey title={t('tags')}>
            {t(`type.${metadata.type && metadata.type in types ? metadata.type : 'other'}`)}
          </MetadataRowKey>
          {metadata.custom && Object.entries(metadata.custom).map(e => (
            <MetadataRowKey key={e[0]} title={e[0]}>{e[1]}</MetadataRowKey>
          ))}
        </MetadataGrid>
      </div>

      <hr className="my-3"/>
    </div>
  )
}