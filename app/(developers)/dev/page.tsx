import {auth} from "@/lib/auth";
import modrinth, {ModrinthProject} from "@/lib/modrinth";
import database from "@/lib/database";
import ProfileSelect from "@/components/profile-select";
import {Session} from "next-auth";
import {ActiveDevProfile, AvailableProfiles, DevProfile, SelectableProfile} from "@/lib/types/dev";
import {revalidatePath} from "next/cache";
import {redirect, RedirectType} from "next/navigation";

function Profile({name, desc, avatar_url, projects, statuses}: {
  name: string,
  desc: string,
  avatar_url: string,
  projects: ModrinthProject[],
  statuses: string[]
}) {
  async function enableProject(slug: string) {
    'use server'

    const project = await modrinth.getProject(slug);

    // TODO Ensure project belongs to user

    await database.enableProject(slug, project.name);
    revalidatePath('/dev');
  }

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
          <div className="flex flex-row justify-between items-center gap-4" key={p.slug}>
            <div className="py-3 flex flex-col gap-2">
              <p className="text-foreground font-medium">{p.name}</p>
              <p className="text-muted-foreground font-normal">{p.summary}</p>
            </div>

            {statuses.includes(p.slug)
              ?
              <span className="text-muted-foreground select-none whitespace-nowrap">
                ✅ Enabled
              </span>
              :
              <form action={enableProject.bind(null, p.slug)}>
                {/*TODO Show loading state*/}
                <button type="submit">Enable</button>
              </form>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

async function getAvailableProfiles(session: Session): Promise<AvailableProfiles> {
  const rawUser = await modrinth.getUserProfile(session.access_token);
  const rawOrganizations = await modrinth.getUserOrganizations(session.user!.name!);

  const userProfile: DevProfile = {
    id: rawUser.username,
    name: rawUser.username,
    description: rawUser.bio,
    avatar_url: rawUser.avatar_url
  };
  const organizations: DevProfile[] = rawOrganizations.map(o => ({
    id: o.slug,
    name: o.name,
    description: o.description,
    avatar_url: o.icon_url
  }));

  return {
    userProfile,
    organizations
  };
}

async function selectProfile(profiles: AvailableProfiles, profileId: string | null): Promise<ActiveDevProfile> {
  if (profileId) {
    const selectedOrg = profiles.organizations.find(o => o.id === profileId);
    if (selectedOrg) {
      const projects = await modrinth.getOrganizationProjects(selectedOrg.id);
      return {...selectedOrg, projects};
    } else {
      redirect('/dev', RedirectType.replace);
    }
  }
  const projects = await modrinth.getUserProjects(profiles.userProfile.id);
  return {...profiles.userProfile, projects};
}

export default async function Dev({searchParams}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = (await auth())!;

  const availableProfiles = await getAvailableProfiles(session);
  const profileId = searchParams['profile'] as string | null;
  const profile = await selectProfile(availableProfiles, profileId);

  const selectableProfiles: SelectableProfile[] = [availableProfiles.userProfile, ...availableProfiles.organizations]
    .map(p => ({id: p.id, name: p.name}));
  const projects = profile.projects.sort((a, b) => a.name.localeCompare(b.name));

  const slugs = profile.projects.map(p => p.slug);
  const statuses = await database.getProjectStatuses(slugs);

  // TODO Stream data / show loading skeleton
  return (
    <div>
      <div className="flex flex-row justify-between">
        Project management dashboard

        <ProfileSelect value={profile.id} defaultValue={availableProfiles.userProfile.id} options={selectableProfiles}/>
      </div>

      <hr className="my-2 border-neutral-600"/>

      <Profile name={profile.name} desc={profile.description} avatar_url={profile.avatar_url} projects={projects}
               statuses={statuses}/>

      <hr className="my-2 border-neutral-600"/>
    </div>
  )
}