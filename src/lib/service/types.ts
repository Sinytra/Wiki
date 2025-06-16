export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface UserProfile {
  username: string;
  avatar_url: string;
  modrinth_id: string | null;
  role: UserRole;
  created_at: string;
}