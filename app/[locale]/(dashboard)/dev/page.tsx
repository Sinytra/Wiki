import {auth} from "@/lib/auth";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {NextIntlClientProvider, useMessages} from "next-intl";
import GetStartedButton from "@/components/dev/get-started/GetStartedButton";
import {pick} from "lodash";
import LinkTextButton from "@/components/ui/link-text-button";
import {Suspense} from "react";
import {GetHelpModal} from "@/components/dev/modal/GetHelpModal";
import {handleMigrateRepositoryForm, handleRegisterProjectForm} from "@/lib/forms/actions";
import {getMessages, getTranslations} from "next-intl/server";
import {Project} from "@/lib/service";
import {Skeleton} from "@/components/ui/skeleton";
import GetStartedContextProvider from "@/components/dev/get-started/GetStartedContextProvider";
import GetStartedModal from "@/components/dev/get-started/GetStartedModal";
import {cn, isWikiAdmin} from "@/lib/utils";
import platforms from "@/lib/platforms";
import {ProjectStatus} from "@/lib/types/serviceTypes";
import {BookMarkedIcon, CheckIcon, GitBranchIcon, HelpCircleIcon, LoaderCircleIcon, SettingsIcon} from "lucide-react";
import {Link} from "@/lib/locales/routing";
import {Button} from "@/components/ui/button";

function ProjectsListHeader({defaultValues, state, isAdmin}: {
  defaultValues?: any;
  state?: any;
  isAdmin: boolean;
}) {
  const messages = useMessages();

  return (
    <div className="w-full flex flex-col items-end">
      <NextIntlClientProvider
        messages={pick(messages, 'GetStartedModal', 'ProjectRegisterForm', 'FormActions', 'DevPageRefreshTransition')}>
        <GetStartedModal defaultValues={defaultValues} state={state?.id === undefined ? state : undefined}
                         isAdmin={isAdmin}
                         formAction={handleRegisterProjectForm}/>
      </NextIntlClientProvider>

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
      <span className="text-foreground align-bottom text-sm">{children}</span>
    </div>
  )
}

async function DevProjectsListEntry({project}: { project: Project }) {
  const platformProject = await platforms.getPlatformProject(project);
  const t = await getTranslations('DevProjectsListPage');
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
                {t('project.manage')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>
}

async function ProfileProjects({projects}: { projects: Project[] }) {
  const t = await getTranslations('DevProjectsListPage');
  const messages = await getMessages();

  const HelpModal = () => (
    <NextIntlClientProvider messages={pick(messages, 'GetHelpModal', 'MigrateRepositoryForm', 'FormActions')}>
      <GetHelpModal githubAppName={process.env.GITHUB_APP_NAME} migrateFormAction={handleMigrateRepositoryForm}/>
    </NextIntlClientProvider>
  );

  return (
    <>
      <div className="flex flex-col gap-3">
        {projects.map(p => (
          <Suspense key={p.id} fallback={<ProfileProjectSkeleton/>}>
            <DevProjectsListEntry project={p} />
          </Suspense>
        ))}
      </div>
      {projects.length === 0
        ?
        <div
          className="px-4 py-6 text-center w-full border border-accent flex flex-col justify-center items-center rounded-sm my-4 gap-4">
          <span className="text-foreground font-medium">{t('empty.primary')}</span>
          <span className="text-muted-foreground">
            {t.rich('empty.secondary', {
              guide: (chunks) => (
                <LinkTextButton className="!text-foreground !text-base !font-normal underline" href="/about/devs">
                  {chunks}
                </LinkTextButton>
              )
            })}
          </span>

          <NextIntlClientProvider messages={pick(messages, 'GetStartedButton')}>
            <GetStartedButton/>
          </NextIntlClientProvider>

          <HelpModal/>
        </div>
        :
        <div className="mt-4 border-none flex justify-center mx-auto">
          <HelpModal/>
        </div>
      }
    </>
  )
}

export default async function DevPage({searchParams}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = (await auth())!;

  const response = await remoteServiceApi.getUserDevProjects(session.access_token);
  if ('status' in response) {
    if (response.status === 401) {
      return redirect('/api/auth/refresh');
    }
    throw new Error("Unexpected response status: " + response.status);
  }

  const autoSubmit = searchParams['code'] !== undefined || searchParams['setup_action'] !== undefined;
  const state = autoSubmit && searchParams['state'] !== undefined
    ? JSON.parse(atob(searchParams['state'] as string))
    : undefined;
  let defaultValues: any = {owner: response.profile.login, repo: '', branch: '', path: ''};
  if (autoSubmit) {
    defaultValues.mr_code = searchParams['code'];
    if (state) {
      state.mr_code = searchParams['code'];
    }
  }

  const messages = await getMessages();
  const isAdmin = session.user?.name !== undefined && session.user.name !== null && isWikiAdmin(session.user.name);

  return (
    <GetStartedContextProvider>
      <div>
        <ProjectsListHeader state={state} defaultValues={defaultValues} isAdmin={isAdmin}/>

        <div>
          <NextIntlClientProvider messages={pick(messages, 'LoadingContent')}>
            <ProfileProjects projects={response.projects}/>
          </NextIntlClientProvider>
        </div>
      </div>
    </GetStartedContextProvider>
  )
}
