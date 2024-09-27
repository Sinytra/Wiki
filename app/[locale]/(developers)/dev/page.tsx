import {auth, signOut} from "@/lib/auth";
import github, {GitHubUserProfile} from "@/lib/github/github";
import githubApp from "@/lib/github/githubApp";
import database from "@/lib/database";
import {Suspense} from "react";
import ProfileProject from "@/components/dev/ProfileProject";
import ProjectRegisterForm from "@/components/dev/ProjectRegisterForm";
import {Button} from "@/components/ui/button";
import {LogOutIcon} from "lucide-react";
import {redirect} from "next/navigation";
import {getMessages, getTranslations} from "next-intl/server";
import {NextIntlClientProvider, useTranslations} from "next-intl";
import {pick} from "lodash";
import {GetHelpModal} from "@/components/dev/GetHelpModal";

export const dynamic = 'force-dynamic';

async function ProfileProjects({owner, access_token}: { owner: string; access_token: string }) {
  const repos = await githubApp.getAvailableRepositories(owner, access_token);
  const projects = await database.getProjects(repos.map(r => r.full_name));

  const t = await getTranslations('DeveloperPortal');
  const messages = await getMessages();

  const HelpModal = () => (
    <NextIntlClientProvider messages={pick(messages, 'GetHelpModal', 'MigrateRepositoryForm', 'FormActions')}>
      <GetHelpModal githubAppName={process.env.GITHUB_APP_NAME}/>
    </NextIntlClientProvider>
  );

  return (
    <>
      {projects.map(p => (
        <Suspense key={p.id} fallback={<p>{t('projects.loading')}</p>}>
          <ProfileProject mod={p}/>
        </Suspense>
      ))}
      {projects.length === 0
        ?
        <div
          className="w-full border border-accent flex flex-col justify-center items-center rounded-sm my-4 h-48 gap-3">
          <span className="text-foreground font-medium">{t('projects.empty.primary')}</span>
          <span className="text-muted-foreground">{t('projects.empty.secondary')}</span>
          <HelpModal />
        </div>
        :
        <div className="my-2 border-none flex justify-center mx-auto">
          <HelpModal />
        </div>
      }
    </>
  )
}

function Profile({name, desc, avatar_url, children}: {
  name: string,
  desc?: string,
  avatar_url: string,
  children?: any
}) {
  const t = useTranslations('DeveloperPortal');

  return (
    <div>
      <div className="my-5 flex flex-row justify-between w-full">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-2xl font-mono">{name}</p>

          <p className="text-muted-foreground">{desc || ''}</p>
        </div>
        <img className="rounded-md" src={avatar_url} alt="Avatar" width={96} height={96}/>
      </div>

      <p className="text-xl border-b border-neutral-400 pb-2">{t('projects.title')}</p>

      <div className="flex flex-col divide-y divide-neutral-600">
        {children}
      </div>
    </div>
  )
}

export default async function Dev({searchParams}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = (await auth())!;

  let profile: GitHubUserProfile;
  try {
    profile = await github.getUserProfile(session.access_token);
  } catch (e: any) {
    if (e.status === 401) {
      return redirect('/api/auth/refresh');
    }
    throw e;
  }

  const state = searchParams['setup_action'] !== undefined && searchParams['state'] !== undefined
    ? JSON.parse(atob(searchParams['state'] as string))
    : undefined;
  const defaultValues = {owner: profile.login};

  const t = await getTranslations('DeveloperPortal');
  const messages = await getMessages();

  return (
    <div>
      <div className="flex flex-row justify-between">
        {t('title')}

        <div className="flex flex-row items-center gap-2">
          <NextIntlClientProvider messages={pick(messages, 'ProjectRegisterForm', 'FormActions')}>
            <ProjectRegisterForm defaultValues={defaultValues} state={state}/>
          </NextIntlClientProvider>

          <form
            title={t('logout')}
            action={async () => {
              "use server"
              await signOut({redirectTo: '/'});
            }}
          >
            <Button type="submit" variant="outline" size="icon" className="h-6 w-6 sm:h-9 sm:w-9">
              <LogOutIcon className="h-4 w-4"/>
            </Button>
          </form>
        </div>
      </div>

      <hr className="my-2 border-neutral-600"/>

      <Profile name={profile.name} desc={profile.bio} avatar_url={profile.avatar_url}>
        <Suspense fallback={(<div>{t('projects.loading_all')}</div>)}>
          <ProfileProjects owner={profile.login} access_token={session.access_token}/>
        </Suspense>
      </Profile>
    </div>
  )
}