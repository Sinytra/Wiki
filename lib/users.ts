import {auth} from "@/lib/auth";

function isWikiAdmin(username: string): boolean {
  const admins = (process.env.ADMIN_USERS || '').split(',').map(s => s.toLowerCase());
  return admins.includes(username.toLowerCase());
}

async function isCurrentUserWikiAdmin() {
  const session = await auth();
  if (session?.user?.name) {
    const admins = (process.env.ADMIN_USERS || '').split(',').map(s => s.toLowerCase());
    return admins.includes(session.user.name.toLowerCase());
  }
  return false;
}

const users = {
  isCurrentUserWikiAdmin,
  isWikiAdmin
};

export default users;