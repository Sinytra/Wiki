import modrinth, {ModrinthProject} from "@/lib/modrinth";
import {
  ArchiveIcon,
  BookIcon, BriefcaseIcon,
  BugIcon,
  CarrotIcon,
  CompassIcon,
  DollarSignIcon, EarthIcon, Gamepad2Icon, HardDriveIcon,
  HouseIcon, MessageCircleIcon, PawPrint, ServerIcon,
  SlidersVerticalIcon,
  SwordsIcon, TruckIcon, WandIcon, ZapIcon
} from "lucide-react";

const ARRNoLicense: string = 'LicenseRef-All-Rights-Reserved';

export const ModTagIcons: { [key: string]: any } = {
  adventure: CompassIcon,
  cursed: BugIcon,
  decoration: HouseIcon,
  economy: DollarSignIcon,
  equipment: SwordsIcon,
  food: CarrotIcon,
  "game-mechanics": SlidersVerticalIcon,
  library: BookIcon,
  magic: WandIcon,
  management: ServerIcon,
  minigame: Gamepad2Icon,
  mobs: PawPrint,
  optimization: ZapIcon,
  social: MessageCircleIcon,
  storage: ArchiveIcon,
  technology: HardDriveIcon,
  transportation: TruckIcon,
  utility: BriefcaseIcon,
  worldgen: EarthIcon
}

interface ModAuthor {
  name: string;
  url: string;
}

interface ModDisplayInformation {
  authors: ModAuthor[];
  latest_version: string;
  license: { name: string; url: string | null };
}

export async function getModProjectInformation(project: ModrinthProject): Promise<ModDisplayInformation> {
  const latestVersion = project.game_versions.length === 0 ? 'N/A' : project.game_versions[project.game_versions.length - 1];
  const license = project.license.id === ARRNoLicense ? 'All Rights Reserved' : project.license.id.startsWith('LicenseRef') ? 'Custom' : project.license.id || 'Unknown';

  let authors: ModAuthor[];
  if (project.organization) {
    const org = await modrinth.getProjectOrganization(project.slug);
    authors = [{name: org.name, url: modrinth.getOrganizationURL(org)}];
  } else {
    const members = await modrinth.getProjectMembers(project.slug);
    authors = members.map(member => ({
      name: member.user.name,
      url: modrinth.getUserURL(member.user)
    }));
  }

  return {
    authors,
    latest_version: latestVersion,
    license: {name: license, url: project.license.url}
  };
}