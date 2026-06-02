import { ItemProperties, ProjectContext } from '@repo/shared/types/service';
import { Frontmatter, Infobox, ProjectData } from '@sinytra/wiki-api-types';
import InfoboxTabs from './InfoboxTabs';
import InvSlotDisplay from './InvSlotDisplay';
import ContentProperties from '@/components/docs/side/content/ContentProperties';
import { ResolvedItemProperties } from '@/lib/project/game/properties';
import ProjectLink from '@/components/navigation/paths/ProjectLink';

export interface Props {
  project: ProjectData;
  frontmatter: Frontmatter;
  metadata: Infobox;
  ctx: ProjectContext;
  properties?: ItemProperties | null;
}

export default async function ContentInfobox({ project, frontmatter, metadata, ctx, properties }: Props) {
  const providedProps: ResolvedItemProperties = {
    source_mod: {
      type: 'single',
      value: <ProjectLink project={project} />
    }
  };
  if (frontmatter.type != null) {
    providedProps['type'] = {
      type: 'single',
      value: frontmatter.type
    };
  }
  if (frontmatter.id?.[0] && frontmatter.id.length === 1 && !properties?.['id']) {
    providedProps['id'] = {
      type: 'single',
      value: frontmatter.id[0]
    };
  }

  return (
    <div className="border border-tertiary">
      {/* Box title */}
      <div className="space-y-1 bg-secondary py-2">
        {metadata.title && <h1 className="text-primarys text-center text-lg font-semibold">{metadata.title}</h1>}
      </div>

      <div className="flex flex-col gap-2 p-1">
        {/* Tabs */}
        {metadata.tabs && <InfoboxTabs tabs={metadata.tabs} ctx={ctx} />}

        {/* Inventory */}
        <div className="mx-auto p-1 text-center">
          {metadata.inventory.map((id) => (
            <InvSlotDisplay key={id} id={id} ctx={ctx} />
          ))}
        </div>
      </div>

      {/* Item Properties */}
      {properties != null && <ContentProperties properties={properties} providedProps={providedProps} ctx={ctx} />}
    </div>
  );
}
