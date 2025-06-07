import remoteServiceApi from "@/lib/service/remoteServiceApi";
import GetStartedButton from "@/components/dev/get-started/GetStartedButton";
import LinkTextButton from "@/components/ui/link-text-button";
import {Suspense} from "react";
import {handleRegisterProjectForm} from "@/lib/forms/actions";
import {getTranslations} from "next-intl/server";
import {DevProject} from "@/lib/service";
import {Skeleton} from "@/components/ui/skeleton";
import GetStartedContextProvider from "@/components/dev/get-started/GetStartedContextProvider";
import GetStartedModal from "@/components/dev/get-started/GetStartedModal";
import {cn, trimText} from "@/lib/utils";
import platforms, {PlatformProject} from "@/lib/platforms";
import {ProjectStatus} from "@/lib/types/serviceTypes";
import {CircleCheckIcon, HelpCircleIcon, LoaderCircleIcon, SettingsIcon} from "lucide-react";
import {Link, setContextLocale} from "@/lib/locales/routing";
import {Button} from "@/components/ui/button";
import {SidebarTrigger} from "@/components/ui/sidebar";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";
import {UserRole} from "@/lib/service/types";
import {handleApiResponse} from "@/lib/service/serviceUtil";

export const dynamic = 'force-dynamic';

function getProjectLink(id: string) {
  return `/dev/project/${id}`;
}

function ProjectsListHeader({defaultValues, isAdmin}: {
  defaultValues?: any;
  isAdmin: boolean;
}) {
  return (
    <div className="mb-2 flex w-full flex-col">
      <div className="flex flex-row items-center justify-end">
        <SidebarTrigger className="mr-auto -ml-1 text-primary md:hidden"/>

        <ClientLocaleProvider keys={['GetStartedModal', 'ProjectRegisterForm', 'FormActions', 'DevPageRefreshTransition']}>
          <GetStartedModal defaultValues={defaultValues} isAdmin={isAdmin} formAction={handleRegisterProjectForm}/>
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

function Property({icon: Icon, iconClass, children}: { icon: any, iconClass?: string, children: any }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Icon className={cn("h-4 w-4", iconClass)}/>
      <span className="align-bottom text-sm text-primary">{children}</span>
    </div>
  )
}

function MobileProjectHeader({id, project}: { id: string; project: PlatformProject; }) {
  return (
    <div className="flex flex-row gap-4 sm:hidden">
      <div className="flex h-12 w-12 shrink-0 sm:h-24 sm:w-24">
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

  return (
    <div className={`
      flex w-full flex-col justify-between gap-2 rounded-md border border-tertiary bg-primary-dim p-3 sm:flex-row
      sm:gap-4
    `}>
      <MobileProjectHeader id={project.id} project={platformProject} />

      <div className="my-auto hidden shrink-0 sm:block">
        <img className="size-20 rounded-md" src={platformProject.icon_url} alt="Project icon"/>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="hidden flex-col sm:flex">
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
            <Property
              iconClass={project.status === ProjectStatus.LOADING ? 'text-yellow-500 animate-spin' : project.status === ProjectStatus.LOADED ? 'text-green-400/70' : 'text-secondary '}
              icon={project.status === ProjectStatus.LOADED ? CircleCheckIcon : project.status === ProjectStatus.LOADING ? LoaderCircleIcon : HelpCircleIcon}>
              {u(project.status || ProjectStatus.UNKNOWN)}
            </Property>
            {/*<Property icon={BookMarkedIcon}>*/}
            {/*  <LinkTextButton className="font-normal! align-bottom!" href={project.source_repo!}>{project.source_repo}</LinkTextButton>*/}
            {/*</Property>*/}
            {/*<Property icon={GitBranchIcon}>{project.source_branch}</Property>*/}
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
          <span className="font-medium text-primary">{t('empty.primary')}</span>
          <span className="text-secondary">
            {t.rich('empty.secondary', {
              guide: (chunks) => (
                <LinkTextButton className="text-base! font-normal! text-primary! underline" href="/about/devs">
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

export default async function DevPage({params}: { params: { locale: string; } }) {
  setContextLocale(params.locale);
  const response = handleApiResponse(await remoteServiceApi.getUserDevProjects());

  const defaultValues = {owner: response.profile.username, repo: '', branch: '', path: ''};
  const isAdmin = response.profile.role === UserRole.ADMIN;

  return (
    <GetStartedContextProvider>
      <div>
        <ProjectsListHeader defaultValues={defaultValues} isAdmin={isAdmin}/>

        <div>
          <ClientLocaleProvider keys={['LoadingContent']}>
            <ProfileProjects projects={response.projects}/>
          </ClientLocaleProvider>
        </div>
      </div>
    </GetStartedContextProvider>
  )
}
