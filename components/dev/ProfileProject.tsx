import {DevProject} from "@/lib/types/dev";
import platforms from "@/lib/platforms";
import {BookMarkedIcon, ExternalLinkIcon, GitBranchIcon, GlobeIcon, ServerIcon, SettingsIcon} from "lucide-react";
import LinkTextButton from "@/components/ui/link-text-button";
import ProjectDeletion from "@/components/dev/ProjectDeletion";
import MutedLinkIconButton from "@/components/ui/muted-link-icon-button";
import ProjectSettings from "@/components/dev/ProjectSettings";
import ProjectRevalidateForm from "@/components/dev/ProjectRevalidateForm";

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

        <img className="rounded-md" src={project.icon_url} alt="Project icon" width={96} height={96}/>
      </div>

      <hr/>

      <div className="inline-flex justify-between items-center flex-wrap gap-4">
        <div className="inline-flex gap-5 flex-wrap">
          <Property icon={BookMarkedIcon}>{mod.source_repo}</Property>
          <Property icon={GitBranchIcon}>{mod.source_branch}</Property>
          <Property icon={ServerIcon}>{mod.platform === 'modrinth' ? 'Modrinth' : 'CurseForge'}</Property>
          <Property icon={GlobeIcon}>
            <LinkTextButton href={project.project_url}>{mod.slug}</LinkTextButton>
          </Property>
        </div>

        <div className="flex flex-row gap-4 items-center ml-auto sm:ml-0">
          <MutedLinkIconButton variant="outline" icon={ExternalLinkIcon} href={`/mod/${mod.id}`} />
          <ProjectRevalidateForm id={mod.id} />
          <ProjectSettings mod={mod} />
          <ProjectDeletion id={mod.id} />
        </div>
      </div>
    </div>
    <hr className="border-neutral-600"/>
  </>
}