import {Mod} from "@prisma/client";
import {Octokit} from "octokit";

async function verifyProjectOwnership(mod: Mod, access_token: string): Promise<boolean> {
  const octokit = new Octokit({ auth: access_token });

  const parts = mod.source_repo.split('/');
  try {
    const user = (await octokit.rest.users.getAuthenticated()).data;
    const data = (await octokit.rest.repos.getCollaboratorPermissionLevel({ owner: parts[0], repo: parts[1], username: user.login })).data;
    return data.user?.permissions?.admin === true || data.user?.permissions?.maintain === true;
  } catch (e) {
    // No-op
  }

  return false;
} 

const verification = {
  verifyProjectOwnership
};

export default verification;