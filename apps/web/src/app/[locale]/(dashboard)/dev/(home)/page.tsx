import GetStartedButton from "@/components/dashboard/dev/get-started/GetStartedButton";
import LinkTextButton from "@/components/navigation/link/LinkTextButton";
import * as React from "react";
import {Suspense} from "react";
import {getTranslations} from "next-intl/server";
import {Skeleton} from "@repo/ui/components/skeleton";
import GetStartedContextProvider from "@/components/dashboard/dev/get-started/GetStartedContextProvider";
import {trimText} from "@/lib/utils";
import {cn} from "@repo/ui/lib/utils";
import platforms, {PlatformProject} from "@repo/shared/platforms";
import {AlertCircleIcon, CircleCheckIcon, HelpCircleIcon, LoaderCircleIcon, SettingsIcon, XIcon} from "lucide-react";
import {Link, setContextLocale} from "@/lib/locales/routing";
import {Button} from "@repo/ui/components/button";
import {SidebarTrigger} from "@repo/ui/components/sidebar";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {handleApiCall} from "@/lib/service/serviceUtil";
import {DevProject} from "@repo/shared/types/service";
import ProjectRegisterForm from "@/components/dashboard/dev/modal/ProjectRegisterForm";
import {UserRole} from "@repo/shared/types/api/auth";
import devProjectApi from "@/lib/service/api/devProjectApi";
import {ProjectStatus} from "@repo/shared/types/api/project";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {WIKI_DOCS_URL} from "@repo/shared/constants";

export const dynamic = 'force-dynamic';

function getProjectLink(id: string) {
  return `/dev/project/${id}`;
}

function ProjectsListHeader({isAdmin}: {
  isAdmin: boolean;
}) {
  return (
    <div className="mb-2 flex w-full flex-col">
      <div className="flex flex-row items-center justify-end">
        <SidebarTrigger className="mr-auto -ml-1 text-primary md:hidden"/>

        <ClientLocaleProvider keys={['ProjectRegisterForm', 'FormActions']}>
          <ProjectRegisterForm isAdmin={isAdmin}
                               redirectToProject
          />
        </ClientLocaleProvider>
      </div>

      <hr className="my-3 flex w-full border-neutral-600"/>
    </div>
  )
}

function ProfileProjectSkeleton() {
  return (
    <Skeleton className="h-[118px] w-full"/>
  )
}

function Property({icon: Icon, textClass, iconClass, children}: {
  textClass: string;
  icon: any,
  iconClass?: string,
  children: any
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <Icon className={cn("h-4 w-4", iconClass)}/>
      <span className={cn('align-bottom text-sm', textClass)}>{children}</span>
    </div>
  )
}

function MobileProjectHeader({id, project}: { id: string; project: PlatformProject; }) {
  return (
    <div className="flex flex-row gap-4 sm:hidden">
      <div className="flex size-12 shrink-0 sm:size-24">
        <img className="rounded-md" src={project.icon_url} alt="Project icon"/>
      </div>
      <div className="flex flex-col">
        <div>
          <LinkTextButton className="w-fit! text-lg! font-medium! text-primary!" href={getProjectLink(id)}>
            {project.name}
          </LinkTextButton>
        </div>
        <p className="max-w-5xl overflow-x-hidden font-normal text-ellipsis text-secondary">
          {trimText(project.summary, 50)}
        </p>
      </div>
    </div>
  )
}

async function DevProjectsListEntry({project}: { project: DevProject }) {
  const platformProject = await platforms.getPlatformProject(project);
  const t = await getTranslations('DevProjectsListPage');
  const u = await getTranslations('ProjectStatus');

  const statuses: { [key in ProjectStatus]: { text: string; icon: any, iconClass?: string; } } = {
    [ProjectStatus.HEALTHY]: {text: 'text-secondary', iconClass: 'text-green-400/70', icon: CircleCheckIcon},
    [ProjectStatus.AT_RISK]: {text: 'text-destructive', iconClass: 'text-destructive', icon: AlertCircleIcon},
    [ProjectStatus.LOADING]: {text: 'text-warning', iconClass: 'text-warning animate-spin', icon: LoaderCircleIcon},
    [ProjectStatus.ERROR]: {text: 'text-destructive', iconClass: 'text-destructive', icon: XIcon},
    [ProjectStatus.UNKNOWN]: {text: 'text-secondary', iconClass: 'text-secondary', icon: HelpCircleIcon}
  };
  const status = statuses[project.status || ProjectStatus.UNKNOWN];

  return (
    <div className={`
      flex w-full flex-col justify-between gap-2 rounded-md border border-tertiary bg-primary-dim p-3 sm:flex-row
      sm:gap-4
    `}>
      <MobileProjectHeader id={project.id} project={platformProject}/>

      <div className="my-auto hidden size-20 shrink-0 sm:flex [&>div]:m-auto">
        <ImageWithFallback className="rounded-md" src={platformProject.icon_url} alt="Project icon"
                           width={80} height={80} fbWidth={64} fbHeight={64}
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="hidden grow flex-col sm:flex">
          <div>
            <LinkTextButton className="w-fit! text-lg font-normal! text-primary!" href={getProjectLink(project.id)}>
              {platformProject.name}
            </LinkTextButton>
          </div>
          <p className="text-sm font-normal text-secondary">
            {trimText(platformProject.summary, 100)}
          </p>
        </div>

        <div className="flex w-full flex-row flex-wrap gap-3">
          <div className="flex flex-row flex-wrap gap-4 gap-y-2 sm:gap-5">
            <Property textClass={status.text} iconClass={status.iconClass} icon={status.icon}>
              {u(project.status || ProjectStatus.UNKNOWN)}
            </Property>
          </div>

          <div className="ml-auto">
            <Link href={getProjectLink(project.id)}>
              <Button className="h-8 border border-neutral-700" variant="ghost" size="sm">
                <SettingsIcon className="mr-2 h-4 w-4"/>
                {t('project.manage')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

async function ProfileProjects({projects}: { projects: DevProject[] }) {
  const t = await getTranslations('DevProjectsListPage');

  return (
    <>
      <div className="flex flex-col gap-3">
        {projects.map(p => (
          <Suspense key={p.id} fallback={<ProfileProjectSkeleton/>}>
            <DevProjectsListEntry project={p}/>
          </Suspense>
        ))}
      </div>
      {projects.length === 0 &&
        <div
          className={`
            flex w-full flex-col items-center justify-center gap-4 rounded-xs border border-tertiary px-4 py-6
            text-center
          `}>
            <span className="font-medium text-primary">
              {t('empty.primary')}
            </span>
            <span className="text-secondary">
            {t.rich('empty.secondary', {
              guide: (chunks: any) => (
                <LinkTextButton className="text-base! font-normal! text-primary! underline" href={WIKI_DOCS_URL}>
                  {chunks}
                </LinkTextButton>
              )
            })}
          </span>

            <ClientLocaleProvider keys={['GetStartedButton']}>
                <GetStartedButton/>
            </ClientLocaleProvider>
        </div>
      }
    </>
  )
}

export default async function DevPage(props: { params: Promise<{ locale: string; }> }) {
  const params = await props.params;
  setContextLocale(params.locale);
  const projects = handleApiCall(await devProjectApi.getProjects());

  const isAdmin = projects.profile.role === UserRole.ADMIN;

  return (
    <GetStartedContextProvider>
      <div>
        <ProjectsListHeader isAdmin={isAdmin}/>

        <div>
          <ClientLocaleProvider keys={['LoadingContent']}>
            <ProfileProjects projects={projects.projects}/>
          </ClientLocaleProvider>
        </div>
      </div>
    </GetStartedContextProvider>
  )
}
