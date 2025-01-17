import {auth} from "@/lib/auth";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {NextIntlClientProvider, useMessages} from "next-intl";
import GetStartedButton from "@/components/dev/get-started/GetStartedButton";
import {pick} from "lodash";
import LinkTextButton from "@/components/ui/link-text-button";
import {Suspense} from "react";
import ProfileProject from "@/components/dev/ProfileProject";
import {GetHelpModal} from "@/components/dev/GetHelpModal";
import {handleMigrateRepositoryForm, handleRegisterProjectForm} from "@/lib/forms/actions";
import {getMessages, getTranslations} from "next-intl/server";
import {Project} from "@/lib/service";
import {Skeleton} from "@/components/ui/skeleton";
import DevPageProjectsList from "@/components/dev/DevPageProjectsList";
import GetStartedContextProvider from "@/components/dev/get-started/GetStartedContextProvider";
import GetStartedModal from "@/components/dev/get-started/GetStartedModal";
import {isWikiAdmin} from "@/lib/utils";

function ProjectsListHeader({defaultValues, state, isAdmin, autoSubmit}: {
  defaultValues?: any;
  state?: any;
  isAdmin: boolean;
  autoSubmit?: boolean
}) {
  const messages = useMessages();

  return (
    <div className="w-full flex flex-col items-end">
      <NextIntlClientProvider
        messages={pick(messages, 'GetStartedModal', 'ProjectRegisterForm', 'FormActions')}>
        <GetStartedModal defaultValues={defaultValues} state={state?.id === undefined ? state : undefined}
                         isAdmin={isAdmin} autoSubmit={state?.id === undefined && autoSubmit}
                         formAction={handleRegisterProjectForm}/>
      </NextIntlClientProvider>

      <hr className="w-full flex my-3 border-neutral-600"/>
    </div>
  )
}

function ProfileProjectSkeleton() {
  return (
    <div className="flex flex-col border border-none w-full py-3 gap-3">
      <div className="flex flex-row justify-between h-24 gap-3">
        <Skeleton className="w-full"/>
        <Skeleton className="w-24 flex-shrink-0"/>
      </div>
      <hr/>
      <Skeleton className="h-[40px]"/>
    </div>
  )
}

async function ProfileProjects({projects, state, autoSubmit}: {
  projects: Project[],
  state?: any,
  autoSubmit?: boolean
}) {
  const t = await getTranslations('DeveloperPortal');
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
            <ProfileProject project={p} state={state?.id === p.id ? state : undefined}
                            autoSubmit={state?.id === p.id && autoSubmit}/>
          </Suspense>
        ))}
      </div>
      {projects.length === 0
        ?
        <div
          className="px-4 py-6 text-center w-full border border-accent flex flex-col justify-center items-center rounded-sm my-4 gap-4">
          <span className="text-foreground font-medium">{t('projects.empty.primary')}</span>
          <span className="text-muted-foreground">
            {t.rich('projects.empty.secondary', {
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
  let defaultValues: any = {owner: response.profile.login};
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
        <ProjectsListHeader state={state} defaultValues={defaultValues} isAdmin={isAdmin} autoSubmit={autoSubmit}/>

        <div>
          <NextIntlClientProvider messages={pick(messages, 'LoadingContent')}>
            <DevPageProjectsList>
              <ProfileProjects state={state} autoSubmit={autoSubmit} projects={response.projects}/>
            </DevPageProjectsList>
          </NextIntlClientProvider>
        </div>
      </div>
    </GetStartedContextProvider>
  )
}
