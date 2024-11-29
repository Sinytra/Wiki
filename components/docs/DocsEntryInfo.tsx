import MetadataGrid from "@/components/docs/project-metadata/MetadataGrid";
import MetadataRowKey from "@/components/docs/project-metadata/MetadataRowKey";
import LinkTextButton from "@/components/ui/link-text-button";
import {DocsEntryMetadata, GameContentType} from "@/lib/docs/metadata";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import {PlatformProject} from "@/lib/platforms";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {getTranslations} from "next-intl/server";
import {AssetLocation} from "@/lib/assets";
import service, {Project} from "@/lib/service";

interface Props {
  project: Project;
  platformProject: PlatformProject;
  metadata: DocsEntryMetadata;
  version: string;
}

const types: GameContentType[] = ['block', 'item', 'other'];

export default async function DocsEntryInfo({project, platformProject, metadata, version}: Props) {
  const iconUrl: AssetLocation | null = metadata.hide_icon === true || !metadata.icon && !metadata.id ? null : await service.getAsset(project.id, (metadata.icon || metadata.id)!, version);
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
            <LinkTextButton href={`/project/${project.id}`}>{platformProject.name}</LinkTextButton>
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