import {auth} from "@/lib/auth";
import {ProjectRegisterForm} from "@/components/dev/ProjectRegisterForm";
import github from "@/lib/github/github";

interface ProfileProject {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

function Profile({name, desc, avatar_url, projects}: {
  name: string,
  desc?: string,
  avatar_url: string,
  projects: ProfileProject[]
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
        {projects.map(p => (
          <div className="flex flex-row justify-between items-center gap-4" key={p.id}>
            <div className="py-3 flex flex-col gap-2">
              <p className="text-foreground font-medium">{p.name}</p>
              <p className="text-muted-foreground font-normal min-h-6">{p.description}</p>
            </div>

            {/*{p.active*/}
            {/*  ?*/}
            {/*  <span className="text-muted-foreground select-none whitespace-nowrap">✅ Enabled</span>*/}
            {/*  :*/}
            {/*  <ProjectRegisterForm />*/}
            {/*}*/}
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function Dev({searchParams}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = (await auth())!;

  const profile = await github.getUserProfile(session.access_token);

  const state = searchParams['setup_action'] !== undefined && searchParams['state'] !== undefined
    ? JSON.parse(atob(searchParams['state'] as string))
    : undefined;
  const defaultValues = { owner: profile.login };

  const projects = [] as ProfileProject[];

  return (
    <div>
      <div className="flex flex-row justify-between">
        Project management dashboard

        <ProjectRegisterForm defaultValues={defaultValues} state={state} />
      </div>

      <hr className="my-2 border-neutral-600"/>

      <Profile name={profile.name} desc={profile.bio} avatar_url={profile.avatar_url} projects={projects}/>

      {projects.length > 0 && <hr className="my-2 border-neutral-600"/>}
    </div>
  )
}