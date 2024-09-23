import {auth, signOut} from "@/lib/auth";
import github, {GitHubUserProfile} from "@/lib/github/github";
import githubApp from "@/lib/github/githubApp";
import database from "@/lib/database";
import {Suspense} from "react";
import ProfileProject from "@/components/dev/ProfileProject";
import ProjectRegisterForm from "@/components/dev/ProjectRegisterForm";
import {Button} from "@/components/ui/button";
import {LogOutIcon} from "lucide-react";
import {Session} from "next-auth";
import {redirect} from "next/navigation";

export const dynamic = 'force-dynamic';

async function ProfileProjects({owner, access_token}: { owner: string; access_token: string }) {
  const repos = await githubApp.getAvailableRepositories(owner, access_token);
  const projects = await database.getProjects(repos.map(r => r.full_name));

  return (
    <>
      {projects.map(p => (
        <Suspense key={p.id} fallback={<p>Loading profile...</p>}>
          <ProfileProject mod={p}/>
        </Suspense>
      ))}
      {projects.length === 0 &&
          <div
              className="w-full border border-accent flex flex-col justify-center items-center rounded-sm my-4 h-48 gap-3">
              <span className="text-foreground font-medium">Looks like you haven't registered any projects yet</span>
              <span className="text-muted-foreground">Start by adding a project from the top bar</span>
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
  return (
    <div>
      <div className="my-5 flex flex-row justify-between w-full">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-2xl font-mono">{name}</p>

          <p className="text-muted-foreground">{desc || ''}</p>
        </div>
        <img className="rounded-md" src={avatar_url} alt="Avatar" width={96} height={96}/>
      </div>

      <p className="text-xl border-b border-neutral-400 pb-2">Projects</p>

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

  return (
    <div>
      <div className="flex flex-row justify-between">
        Project management dashboard

        <div className="flex flex-row items-center gap-2">
          <ProjectRegisterForm defaultValues={defaultValues} state={state}/>

          <form
            title="Logout"
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
        <Suspense fallback={(<div>Loading profile projects...</div>)}>
          <ProfileProjects owner={profile.login} access_token={session.access_token}/>
        </Suspense>
      </Profile>
    </div>
  )
}