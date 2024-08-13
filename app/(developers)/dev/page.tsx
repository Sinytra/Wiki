import {auth} from "@/lib/auth";
import modrinth from "@/lib/modrinth";

export default async function Dev() {
  const session = (await auth())!;

  const profile = await modrinth.getUserProfile(session.access_token);
  const projects = await modrinth.getUserProjects(profile.username);

  return (
    <div>
      Login successful!

      <hr className="my-2 border-neutral-600" />

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
          <div className="py-3 flex flex-col gap-2">
            <p className="text-primary font-medium">{p.title}</p>
            <p className="text-secondary font-normal">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}