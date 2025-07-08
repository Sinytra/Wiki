import PageLink from "@/components/docs/PageLink";
import navigation from "@/lib/navigation";

export default function ProjectLink({ project, children }: { project: string; children: any }) {
  return (
    <PageLink href={navigation.getProjectLink(project)}>
      {children}
    </PageLink>
  )
}