export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface UserProfile {
  name: string;
  username: string;
  avatar_url: string;
  modrinth_id: string | null;
  role: UserRole;
  created_at: string;
}
