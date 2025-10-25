import PageLink from "@/components/docs/PageLink";
import navigation from "@/lib/navigation";
import {BaseProject} from "@repo/shared/types/service";

export default function ProjectLink({ project, children }: { project: BaseProject; children?: any }) {
  return (
    <PageLink href={navigation.getProjectLink(project.id)}>
      {children ?? project.name}
    </PageLink>
  )
}