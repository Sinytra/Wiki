import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {NextIntlClientProvider, useMessages} from "next-intl";
import GetStartedButton from "@/components/dev/get-started/GetStartedButton";
import {pick} from "lodash";
import LinkTextButton from "@/components/ui/link-text-button";
import {Suspense} from "react";
import {handleRegisterProjectForm} from "@/lib/forms/actions";
import {getMessages, getTranslations} from "next-intl/server";
import {DevProject} from "@/lib/service";
import {Skeleton} from "@/components/ui/skeleton";
import GetStartedContextProvider from "@/components/dev/get-started/GetStartedContextProvider";
import GetStartedModal from "@/components/dev/get-started/GetStartedModal";
import {cn} from "@/lib/utils";
import platforms, {PlatformProject} from "@/lib/platforms";
import {ProjectStatus} from "@/lib/types/serviceTypes";
import {
  BookMarkedIcon,
  CheckIcon,
  CircleCheckIcon,
  GitBranchIcon,
  HelpCircleIcon,
  LoaderCircleIcon,
  SettingsIcon
} from "lucide-react";
import {Link} from "@/lib/locales/routing";
import {Button} from "@/components/ui/button";
import {SidebarTrigger} from "@/components/ui/sidebar";
import authSession from "@/lib/authSession";

export const dynamic = 'force-dynamic';

function getProjectLink(id: string) {
  return `/dev/project/${id}`;
}

function ProjectsListHeader({defaultValues, isAdmin}: {
  defaultValues?: any;
  isAdmin: boolean;
}) {
  const messages = useMessages();

  return (
    <div className="w-full flex flex-col mb-2">
      <div className="flex flex-row items-center justify-end">
        <SidebarTrigger className="-ml-1 mr-auto md:hidden text-primary"/>

        <NextIntlClientProvider
          messages={pick(messages, 'GetStartedModal', 'ProjectRegisterForm', 'FormActions', 'DevPageRefreshTransition')}>
          <GetStartedModal defaultValues={defaultValues} isAdmin={isAdmin} formAction={handleRegisterProjectForm}/>
        </NextIntlClientProvider>
      </div>

      <hr className="w-full flex my-3 border-neutral-600"/>
    </div>
  )
}

function ProfileProjectSkeleton() {
  return (
    <Skeleton className="w-full h-[118px]"/>
  )
}

function Property({icon: Icon, iconClass, children}: { icon: any, iconClass?: string, children: any }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Icon className={cn("w-4 h-4", iconClass)}/>
      <span className="text-primary align-bottom text-sm">{children}</span>
    </div>
  )
}

function MobileProjectHeader({id, project}: { id: string; project: PlatformProject; }) {
  return (
    <div className="sm:hidden flex flex-row gap-4">
      <div className="flex shrink-0 w-12 h-12 sm:w-24 sm:h-24">
        <img className="rounded-md" src={project.icon_url} alt="Project icon"/>
      </div>
      <div className="flex flex-col">
        <div>
          <LinkTextButton className="w-fit! text-primary! font-medium! text-lg!" href={getProjectLink(id)}>
            {project.name}
          </LinkTextButton>
        </div>
        <p className="text-secondary font-normal text-ellipsis overflow-x-hidden max-w-5xl">
          {project.summary.length > 50 ? `${project.summary.substring(0, 50)}...` : project.summary}
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
    <div className="flex flex-col sm:flex-row gap-4 w-full justify-between p-3 border border-tertiary rounded-md bg-primary-alt">
      <MobileProjectHeader id={project.id} project={platformProject} />

      <div className="hidden sm:block shrink-0">
        <img className="rounded-md size-20 lg:size-22" src={platformProject.icon_url} alt="Project icon"/>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="hidden sm:flex flex-col">
          <div>
            <LinkTextButton className="w-fit! text-primary! font-medium! text-lg!" href={getProjectLink(project.id)}>
              {platformProject.name}
            </LinkTextButton>
          </div>
          <p className="text-secondary font-normal">
            {platformProject.summary.length > 100 ? `${platformProject.summary.substring(0, 100)}...` : platformProject.summary}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full flex-wrap sm:flex-row">
          <div className="flex flex-row flex-wrap gap-4 gap-y-2 sm:gap-5">
            <Property
              iconClass={project.status === ProjectStatus.LOADING ? 'text-yellow-500 animate-spin' : project.status === ProjectStatus.LOADED ? 'text-green-400/70' : 'text-secondary '}
              icon={project.status === ProjectStatus.LOADED ? CircleCheckIcon : project.status === ProjectStatus.LOADING ? LoaderCircleIcon : HelpCircleIcon}>
              {u(project.status || ProjectStatus.UNKNOWN)}
            </Property>
            <Property icon={BookMarkedIcon}>
              <LinkTextButton className="font-normal! align-bottom!" href={project.source_repo!}>{project.source_repo}</LinkTextButton>
            </Property>
            <Property icon={GitBranchIcon}>{project.source_branch}</Property>
          </div>

          <div className="ml-auto">
            <Link href={getProjectLink(project.id)}>
              <Button className="h-8 border border-neutral-700" variant="ghost" size="sm">
                <SettingsIcon className="mr-2 w-4 h-4"/>
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
  const messages = await getMessages();

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
          className="px-4 py-6 text-center w-full border border-tertiary flex flex-col justify-center items-center rounded-xs gap-4">
          <span className="text-primary font-medium">{t('empty.primary')}</span>
          <span className="text-secondary">
            {t.rich('empty.secondary', {
              guide: (chunks) => (
                <LinkTextButton className="text-primary! text-base! font-normal! underline" href="/about/devs">
                  {chunks}
                </LinkTextButton>
              )
            })}
          </span>

          <NextIntlClientProvider messages={pick(messages, 'GetStartedButton')}>
            <GetStartedButton/>
          </NextIntlClientProvider>
        </div>
      }
    </>
  )
}

export default async function DevPage() {
  const response = await remoteServiceApi.getUserDevProjects();
  if ('status' in response) {
    if (response.status === 401) {
      return authSession.refresh();
    }
    throw new Error("Unexpected response status: " + response.status);
  }

  const defaultValues = {owner: response.profile.username, repo: '', branch: '', path: ''};

  const messages = await getMessages();
  // const isAdmin = session.user?.name !== undefined && session.user.name !== null && isWikiAdmin(session.user.name);
  const isAdmin = false; // TODO Store in session

  return (
    <GetStartedContextProvider>
      <div>
        <ProjectsListHeader defaultValues={defaultValues} isAdmin={isAdmin}/>

        <div>
          <NextIntlClientProvider messages={pick(messages, 'LoadingContent')}>
            <ProfileProjects projects={response.projects}/>
          </NextIntlClientProvider>
        </div>
      </div>
    </GetStartedContextProvider>
  )
}
