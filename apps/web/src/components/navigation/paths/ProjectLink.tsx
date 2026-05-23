import PageLink from '@/components/docs/PageLink';
import navigation from '@/lib/navigation';
import {ProjectData} from '@sinytra/wiki-api-types';

export default function ProjectLink({project, children}: { project: ProjectData; children?: any }) {
  return (
    <PageLink href={navigation.getProjectLink(project.id)}>
      {children ?? project.name}
    </PageLink>
  );
}