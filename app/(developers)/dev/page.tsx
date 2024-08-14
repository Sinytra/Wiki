import {auth} from "@/lib/auth";
import modrinth from "@/lib/modrinth";
import database from "@/lib/database";

export default async function Dev() {
  const session = (await auth())!;

  const profile = await modrinth.getUserProfile(session.access_token);
  const projects = await modrinth.getUserProjects(profile.username);

  const slugs = projects.map(p => p.slug);
  const statuses = await database.getProjectStatuses(slugs);

  async function enableProject(slug: string) {
    'use server'

    const project = await modrinth.getProject(slug);
    
    // TODO Ensure project belongs to user

    await database.enableProject(slug, project.title);
  }

  return (
    <div>
      Login successful!

      <hr className="my-2 border-neutral-600"/>

      <div className="my-5 flex flex-row justify-between w-full">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-2xl font-mono">{profile.username}</p>

          <p className="text-secondary">{profile.bio || 'No bio provided'}</p>
        </div>
        <img className="rounded-md" src={profile.avatar_url} alt="Avatar" width={96} height={96}/>
      </div>

      <p className="text-xl border-b border-neutral-400 pb-2">Projects</p>

      <div className="flex flex-col divide-y divide-neutral-600">
        {projects.map(p => (
          <div className="flex flex-row justify-between items-center">
            <div className="py-3 flex flex-col gap-2">
              <p className="text-primary font-medium">{p.title}</p>
              <p className="text-secondary font-normal">{p.description}</p>
            </div>

            {statuses.includes(p.slug)
              ?
              <span className="text-secondary select-none">
                ✅ Enabled
              </span>
              :
              <form action={enableProject.bind(null, p.slug)}>
                <button type="submit">Enable</button>
              </form>
            }
          </div>
        ))}
      </div>
    </div>
  )
}