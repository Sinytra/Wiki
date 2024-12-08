import {BookMarkedIcon, ExternalLinkIcon, GitBranchIcon} from "lucide-react";
import LinkTextButton from "@/components/ui/link-text-button";
import ProjectDeletion from "@/components/dev/ProjectDeletion";
import MutedLinkIconButton from "@/components/ui/muted-link-icon-button";
import ProjectRevalidateForm from "@/components/dev/ProjectRevalidateForm";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import {cn} from "@/lib/utils";
import {getMessages} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";
import {pick} from "lodash";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import platforms from "@/lib/platforms";
import {handleDeleteProjectForm, handleEditProjectForm, handleRevalidateDocs} from "@/lib/forms/actions";
import {Project} from "@/lib/service";
import ProjectSettingsForm from "@/components/dev/ProjectSettingsForm";

function Property({icon: Icon, iconClass, children}: { icon: any, iconClass?: string, children: any }) {
  return (
      <div className="inline-flex items-center gap-2">
        <Icon className={cn("w-4 h-4", iconClass)}/>
        <span className="text-foreground text-sm">{children}</span>
      </div>
  )
}

export default async function ProfileProject({project, state, autoSubmit}: {
  project: Project,
  state?: any,
  autoSubmit?: boolean
}) {
  const platformProject = await platforms.getPlatformProject(project);
  const messages = await getMessages();

  return <>
    <div className="flex flex-col justify-between gap-3 py-3">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col gap-2">
          <p className="text-foreground font-medium text-lg">{platformProject.name}</p>
          <p className="text-muted-foreground font-normal min-h-6">{platformProject.summary}</p>
        </div>

        <img className="rounded-md" src={platformProject.icon_url} alt="Project icon" width={96} height={96}/>
      </div>

      <hr/>

      <div className="inline-flex justify-between items-center flex-wrap gap-4">
        <div className="inline-flex gap-5 flex-wrap">
          <Property icon={BookMarkedIcon}>
            <LinkTextButton href={`https://github.com/${project.source_repo}`}>{project.source_repo}</LinkTextButton>
          </Property>
          <Property icon={GitBranchIcon}>{project.source_branch}</Property>
          {project.platforms.curseforge &&
              <Property icon={CurseForgeIcon} iconClass="text-[var(--curseforge-brand)]">
                  <LinkTextButton href={platforms.getProjectURL('curseforge', project.platforms.curseforge)} target="_blank">
                    {project.platforms.curseforge}
                  </LinkTextButton>
              </Property>
          }
          {project.platforms.modrinth &&
              <Property icon={ModrinthIcon} iconClass="text-[var(--modrinth-brand)]">
                  <LinkTextButton href={platforms.getProjectURL('modrinth', project.platforms.modrinth)} target="_blank">
                    {project.platforms.modrinth}
                  </LinkTextButton>
              </Property>
          }
          {project.is_community && <CommunityDocsBadge bright/>}
        </div>

        <div className="flex flex-row gap-4 items-center ml-auto sm:ml-0">
          <MutedLinkIconButton variant="outline" icon={ExternalLinkIcon} href={`/project/${project.id}`}/>
          <NextIntlClientProvider messages={pick(messages, 'ProjectRevalidateForm', 'FormActions')}>
            <ProjectRevalidateForm action={handleRevalidateDocs.bind(null, project.id)}/>
          </NextIntlClientProvider>
          <NextIntlClientProvider
              messages={pick(messages, 'ProjectSettingsForm', 'ProjectRegisterForm', 'FormActions')}>
            <ProjectSettingsForm mod={project} formAction={handleEditProjectForm} state={state}
                                 autoSubmit={autoSubmit}/>
          </NextIntlClientProvider>
          <NextIntlClientProvider messages={pick(messages, 'ProjectDeletionForm')}>
            <ProjectDeletion action={handleDeleteProjectForm.bind(null, project.id)}/>
          </NextIntlClientProvider>
        </div>
      </div>
    </div>
    <hr className="border-neutral-600"/>
  </>
}