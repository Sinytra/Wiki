import {auth} from "@/lib/auth";
import modrinth from "@/lib/modrinth";

export default async function Dev() {
  const session = (await auth())!;

  const profile = await modrinth.getUserProfile(session.access_token)

  return (
    <div>
      Log in successful!

      <p>{profile.username}</p>
      <img src={profile.avatar_url} alt="Avatar" width={128} height={128} />
    </div>
  )
}