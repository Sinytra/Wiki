export interface SelectableProfile {
  id: string;
  name: string;
}

export interface DevProfile {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
}

export interface ActiveDevProfile extends DevProfile {
  
}

export interface AvailableProfiles {
  userProfile: DevProfile;
  organizations: DevProfile[];
}