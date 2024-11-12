import MetadataGrid from "@/components/docs/mod-metadata/MetadataGrid";
import MetadataRowKey from "@/components/docs/mod-metadata/MetadataRowKey";
import LinkTextButton from "@/components/ui/link-text-button";
import {DocsEntryMetadata, ModContentType} from "@/lib/docs/metadata";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import {ModProject} from "@/lib/platforms";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {getTranslations} from "next-intl/server";
import {AssetLocation} from "@/lib/assets";
import service, {Mod} from "@/lib/service";

interface Props {
  mod: Mod;
  project: ModProject;
  metadata: DocsEntryMetadata;
  version: string;
}

const types: ModContentType[] = ['block', 'item', 'other'];

export default async function DocsEntryInfo({mod, project, metadata, version}: Props) {
  const iconUrl: AssetLocation | null = metadata.hide_icon === true || !metadata.icon && !metadata.id ? null : await service.getAsset(mod.id, (metadata.icon || metadata.id)!, version);
  const t = await getTranslations('DocsEntryInfo');

  return (
    <div className="flex flex-col mb-2">
      <DocsSidebarTitle>
        {t('title')}
      </DocsSidebarTitle>

      <div className="mb-6 border border-accent m-2 rounded-sm">
        <ImageWithFallback src={iconUrl?.src} width={128} height={128} className="docsContentIcon m-4 mx-auto"
                           alt={!iconUrl ? undefined : iconUrl.id}/>
      </div>

      <div className="mb-4">
        <MetadataGrid>
          {metadata.title && <MetadataRowKey title={t('name')}>{metadata.title}</MetadataRowKey>}
          <MetadataRowKey title={t('source')}>
            <LinkTextButton href={`/mod/${mod.id}`}>{project.name}</LinkTextButton>
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