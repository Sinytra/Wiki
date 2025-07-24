import {AssetLocation} from "@repo/shared/assets";
import service from "@/lib/service";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import ContentProperties from "@/components/docs/side/content/ContentProperties";
import {ItemProperties, Project, ProjectContext} from "@repo/shared/types/service";
import {DocsEntryMetadata} from "@repo/shared/types/metadata";
import ProjectLink from "@/components/navigation/paths/ProjectLink";

export interface Props {
  title: string;
  project: Project;
  metadata: DocsEntryMetadata;
  ctx: ProjectContext;
  properties?: ItemProperties | null;
}

export default async function DocsContentMetaSidebarBody({project, metadata, ctx, properties}: Props) {
  const iconUrl: AssetLocation | null = metadata.hide_icon === true || !metadata.icon && !metadata.id ? null
    : await service.getAsset((metadata.icon || metadata.id)!, ctx);

  const providedProps = {
    id: metadata.id,
    type: metadata.type,
    ...metadata.custom,
    source_mod: (
      <ProjectLink project={project.id}>
        {project.name}
      </ProjectLink>
    ),
    ...(properties ?? {})
  };

  return (
    <div className="border border-tertiary">
      <div className="space-y-1 bg-secondary py-2">
        {metadata.title &&
          <h1 className="text-primarys text-center text-lg font-semibold">
            {metadata.title}
          </h1>
        }
      </div>

      {!metadata.hide_icon &&
        <div className="my-2 p-4">
            <ImageWithFallback src={iconUrl?.src} width={128} height={128}
                               className="docsContentIcon disable-blur mx-auto"
                               alt={!iconUrl ? undefined : iconUrl.id}/>
        </div>
      }

      {!metadata.hide_meta &&
        <ContentProperties properties={providedProps} ctx={ctx}/>
      }
    </div>
  )
}