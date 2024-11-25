import {auth, signOut} from "@/lib/auth";
import * as React from "react";
import {Suspense} from "react";
import ProfileProject from "@/components/dev/ProfileProject";
import {Button} from "@/components/ui/button";
import {LogOutIcon} from "lucide-react";
import {redirect} from "next/navigation";
import {getMessages, getTranslations} from "next-intl/server";
import {NextIntlClientProvider, useTranslations} from "next-intl";
import {pick} from "lodash";
import {GetHelpModal} from "@/components/dev/GetHelpModal";
import GetStartedContextProvider from "@/components/dev/get-started/GetStartedContextProvider";
import {Skeleton} from "@/components/ui/skeleton";
import GetStartedModal from "@/components/dev/get-started/GetStartedModal";
import GetStartedButton from "@/components/dev/get-started/GetStartedButton";
import LinkTextButton from "@/components/ui/link-text-button";
import {isWikiAdmin} from "@/lib/utils";
import DevPageProjectsList from "@/components/dev/DevPageProjectsList";
import {handleRegisterProjectForm, handleMigrateRepositoryForm} from "@/lib/forms/actions";
import remoteServiceApi, {GitHubUserProfile} from "@/lib/service/remoteServiceApi";
import {Project} from "@/lib/service";

export const dynamic = 'force-dynamic';

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

async function ProfileProjects({projects, state, autoSubmit}: { projects: Project[], state?: any, autoSubmit?: boolean }) {
  const t = await getTranslations('DeveloperPortal');
  const messages = await getMessages();

  const HelpModal = () => (
      <NextIntlClientProvider messages={pick(messages, 'GetHelpModal', 'MigrateRepositoryForm', 'FormActions')}>
        <GetHelpModal githubAppName={process.env.GITHUB_APP_NAME} migrateFormAction={handleMigrateRepositoryForm}/>
      </NextIntlClientProvider>
  );

  return (
      <>
        {projects.map(p => (
            <Suspense key={p.id} fallback={<ProfileProjectSkeleton/>}>
              <ProfileProject project={p} state={state?.id === p.id ? state : undefined}
                              autoSubmit={state?.id === p.id && autoSubmit}/>
            </Suspense>
        ))}
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

function Profile({profile, children}: {
  profile: GitHubUserProfile;
  children?: any
}) {
  const t = useTranslations('DeveloperPortal');

  return (
      <div>
        <div className="my-5 flex flex-row justify-between w-full">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-2xl font-mono">{profile.name}</p>

            <p className="text-muted-foreground">{profile.bio || ''}</p>
          </div>
          <img className="rounded-md" src={profile.avatar_url} alt="Avatar" width={96} height={96}/>
        </div>

        <p className="text-xl border-b border-neutral-600 pb-2">{t('projects.title')}</p>

        <div className="flex flex-col divide-y divide-neutral-600 my-2">
          {children}
        </div>
      </div>
  )
}

export default async function Dev({searchParams}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = (await auth())!;

  const response = await remoteServiceApi.getUserDevProjects(session.access_token);
  if ('status' in response) {
    if (response.status === 401) {
      return redirect('/api/auth/refresh');
    }
    throw new Error("Unexpected response status: " + response.status);
  }

  const autoSubmit = searchParams['code'] !== undefined;
  const state = (searchParams['setup_action'] !== undefined || autoSubmit) && searchParams['state'] !== undefined
      ? JSON.parse(atob(searchParams['state'] as string))
      : undefined;
  let defaultValues: any = {owner: response.profile.login};
  if (autoSubmit) {
    defaultValues.mr_code = searchParams['code'];
    state.mr_code = searchParams['code'];
  }

  const t = await getTranslations('DeveloperPortal');
  const messages = await getMessages();
  const isAdmin = session.user?.name !== undefined && session.user.name !== null && isWikiAdmin(session.user.name);

  return (
      <GetStartedContextProvider>
        <div>
          <div className="flex flex-row justify-between">
          <span className="text-foreground text-lg">
            {t('title')}
          </span>

            <div className="flex flex-row items-center gap-2">
              <NextIntlClientProvider
                  messages={pick(messages, 'GetStartedModal', 'ProjectRegisterForm', 'FormActions')}>
                <GetStartedModal defaultValues={defaultValues} state={state?.id === undefined ? state : undefined}
                                 isAdmin={isAdmin} autoSubmit={state?.id === undefined && autoSubmit}
                                 formAction={handleRegisterProjectForm}/>
              </NextIntlClientProvider>

              <form
                  title={t('logout')}
                  action={async () => {
                    "use server"
                    await signOut({redirectTo: '/'});
                  }}
              >
                <Button type="submit" variant="outline" size="icon" className="h-9 w-9">
                  <LogOutIcon className="h-4 w-4"/>
                </Button>
              </form>
            </div>
          </div>

          <hr className="my-2 border-neutral-600"/>

          <Profile profile={response.profile}>
            <NextIntlClientProvider messages={pick(messages, 'LoadingContent')}>
              <DevPageProjectsList>
                <ProfileProjects state={state} autoSubmit={autoSubmit} projects={response.projects}/>
              </DevPageProjectsList>
            </NextIntlClientProvider>
          </Profile>
        </div>
      </GetStartedContextProvider>
  )
}