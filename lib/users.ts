function isWikiAdmin(username: string): boolean {
  const admins = (process.env.ADMIN_USERS || '').split(',').map(s => s.toLowerCase());
  return admins.includes(username.toLowerCase());
}

const users = {
  isWikiAdmin
};

export default users;