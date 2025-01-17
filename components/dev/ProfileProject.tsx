import {BookMarkedIcon, CheckIcon, GitBranchIcon, HelpCircleIcon, LoaderCircleIcon, SettingsIcon} from "lucide-react";
import LinkTextButton from "@/components/ui/link-text-button";
import {cn} from "@/lib/utils";
import {getMessages, getTranslations} from "next-intl/server";
import platforms from "@/lib/platforms";
import {Project} from "@/lib/service";
import {Button} from "@/components/ui/button";
import {Link} from "@/lib/locales/routing";
import {ProjectStatus} from "@/lib/types/serviceTypes";

function Property({icon: Icon, iconClass, children}: { icon: any, iconClass?: string, children: any }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Icon className={cn("w-4 h-4", iconClass)}/>
      <span className="text-foreground align-bottom text-sm">{children}</span>
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
  const u = await getTranslations('ProjectStatus');

  return <>
    <div className="flex flex-row gap-4 w-full justify-between p-3 border border-[hsl(var(--sidebar-border))] rounded-md bg-[hsl(var(--sidebar-background))]">
      <div>
        <img className="rounded-md" src={platformProject.icon_url} alt="Project icon" width={96} height={96}/>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col">
          <div>
            <LinkTextButton className="!w-fit !text-foreground !font-medium !text-lg" href={`/dev/${project.id}`}>
              {platformProject.name}
            </LinkTextButton>
          </div>
          <p className="text-muted-foreground font-normal whitespace-nowrap text-ellipsis overflow-x-hidden max-w-5xl">
            {platformProject.summary}
          </p>
        </div>

        <div className="flex flex-row">
          <div className="inline-flex gap-5">
            <Property
              iconClass={project.status === ProjectStatus.LOADING ? 'text-yellow-500 animate-spin' : project.status === ProjectStatus.LOADED ? 'text-green-500' : 'text-muted-foreground '}
              icon={project.status === ProjectStatus.LOADED ? CheckIcon : project.status === ProjectStatus.LOADING ? LoaderCircleIcon : HelpCircleIcon}>
              {u(project.status || ProjectStatus.UNKNOWN)}
            </Property>
            <Property icon={BookMarkedIcon}>
              <LinkTextButton className="!font-normal !align-bottom"
                              href={`https://github.com/${project.source_repo}`}>{project.source_repo}</LinkTextButton>
            </Property>
            <Property icon={GitBranchIcon}>{project.source_branch}</Property>
          </div>

          <div className="ml-auto">
            <Link href={`/dev/${project.id}`}>
              <Button className="h-8 border border-neutral-700" variant="ghost" size="sm">
                <SettingsIcon className="mr-2 w-4 h-4"/>
                Manage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>
}