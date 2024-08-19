import {DevProject} from "@/lib/types/dev";
import platforms from "@/lib/platforms";
import {BookMarkedIcon, GitBranchIcon, GlobeIcon, ServerIcon} from "lucide-react";
import LinkTextButton from "@/components/ui/link-text-button";
import ProjectDeletion from "@/components/dev/ProjectDeletion";

function Property({icon: Icon, children}: { icon: any, children: any }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Icon className="w-4 h-4"/>
      <span className="text-foreground text-sm">{children}</span>
    </div>
  )
}

export default async function ProfileProject({mod}: { mod: DevProject }) {
  const project = await platforms.getProject(mod);

  return <>
    <div className="flex flex-col justify-between gap-3 py-3">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col gap-2">
          <p className="text-foreground font-medium text-lg">{project.name}</p>
          <p className="text-muted-foreground font-normal min-h-6">{project.summary}</p>
        </div>

        <img src={project.icon_url} alt="Project icon" width={96} height={96}/>
      </div>

      <hr/>

      <div className="inline-flex justify-between items-center">
        <div className="inline-flex gap-5">
          <Property icon={BookMarkedIcon}>{mod.source_repo}</Property>
          <Property icon={GitBranchIcon}>{mod.source_branch}</Property>
          <Property icon={ServerIcon}>{mod.platform === 'modrinth' ? 'Modrinth' : 'CurseForge'}</Property>
          <Property icon={GlobeIcon}>
            <LinkTextButton href={project.project_url}>{mod.slug}</LinkTextButton>
          </Property>
        </div>

        <ProjectDeletion id={mod.id} />
      </div>
    </div>
    <hr className="border-neutral-600"/>
  </>
}