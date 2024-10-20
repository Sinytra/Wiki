import platforms from "@/lib/platforms";
import {BookMarkedIcon, ExternalLinkIcon, GitBranchIcon, GlobeIcon} from "lucide-react";
import LinkTextButton from "@/components/ui/link-text-button";
import ProjectDeletion from "@/components/dev/ProjectDeletion";
import MutedLinkIconButton from "@/components/ui/muted-link-icon-button";
import ProjectSettings from "@/components/dev/ProjectSettings";
import ProjectRevalidateForm from "@/components/dev/ProjectRevalidateForm";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import {cn} from "@/lib/utils";
import {getMessages} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";
import {pick} from "lodash";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import {Mod} from "@prisma/client";

function Property({icon: Icon, iconClass, children}: { icon: any, iconClass?: string, children: any }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Icon className={cn("w-4 h-4", iconClass)}/>
      <span className="text-foreground text-sm">{children}</span>
    </div>
  )
}

export default async function ProfileProject({mod}: { mod: Mod }) {
  const project = await platforms.getProject(mod);
  const messages = await getMessages();

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
          <Property icon={BookMarkedIcon}>
            <LinkTextButton href={`https://github.com/${mod.source_repo}`}>{mod.source_repo}</LinkTextButton>
          </Property>
          <Property icon={GitBranchIcon}>{mod.source_branch}</Property>
          {mod.platform === 'modrinth'
            ?
            <Property icon={ModrinthIcon} iconClass="text-[var(--modrinth-brand)]">Modrinth</Property>
            : 
            <Property icon={CurseForgeIcon} iconClass="text-[var(--curseforge-brand)]">CurseForge</Property>
          }
          <Property icon={GlobeIcon}>
            <LinkTextButton href={project.project_url}>{mod.slug}</LinkTextButton>
          </Property>
          {mod.is_community && <CommunityDocsBadge bright />}
        </div>

        <div className="flex flex-row gap-4 items-center ml-auto sm:ml-0">
          <MutedLinkIconButton variant="outline" icon={ExternalLinkIcon} href={`/mod/${mod.id}`} />
          <NextIntlClientProvider messages={pick(messages, 'ProjectRevalidateForm', 'FormActions')}>
            <ProjectRevalidateForm id={mod.id} />
          </NextIntlClientProvider>
          <NextIntlClientProvider messages={pick(messages, 'ProjectSettingsForm', 'ProjectRegisterForm', 'FormActions')}>
            <ProjectSettings mod={mod} />
          </NextIntlClientProvider>
          <NextIntlClientProvider messages={pick(messages, 'ProjectDeletionForm')}>
            <ProjectDeletion id={mod.id} />
          </NextIntlClientProvider>
        </div>
      </div>
    </div>
    <hr className="border-neutral-600"/>
  </>
}