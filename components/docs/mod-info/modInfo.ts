import {
  ArchiveIcon, BiohazardIcon,
  BookIcon,
  BriefcaseIcon,
  BugIcon,
  BugOffIcon,
  CarrotIcon, CircuitBoardIcon,
  CompassIcon,
  DollarSignIcon,
  EarthIcon, FileQuestionIcon,
  Gamepad2Icon, GraduationCapIcon,
  HardDriveIcon,
  HouseIcon,
  MapIcon,
  MessageCircleIcon,
  PawPrint,
  PuzzleIcon,
  ServerIcon,
  ShirtIcon,
  SlidersVerticalIcon,
  SwordsIcon,
  TruckIcon,
  WandIcon,
  ZapIcon
} from "lucide-react";
import platforms, {ModAuthor, ModProject} from "@/lib/platforms";

const ARRNoLicense: string = 'LicenseRef-All-Rights-Reserved';
const ARR = 'All Rights Reserved';

export const ModCategories: { [key: string]: { name: string; icon: any } } = {
  // Modrinth tags
  adventure: { name: 'Adventure', icon: CompassIcon },
  cursed: { name: 'Cursed', icon: BugIcon },
  decoration: { name: 'Decoration', icon: HouseIcon },
  economy: { name: 'Economy', icon: DollarSignIcon },
  equipment: { name: 'Equipment', icon: SwordsIcon },
  food: { name: 'Food', icon: CarrotIcon },
  "game-mechanics": { name: 'Game Mechanics', icon: SlidersVerticalIcon },
  library: { name: 'Library', icon: BookIcon },
  magic: { name: 'Magic', icon: WandIcon },
  management: { name: 'Management', icon: ServerIcon },
  minigame: { name: 'Minigame', icon: Gamepad2Icon },
  mobs: { name: 'Mobs', icon: PawPrint },
  optimization: { name: 'Optimization', icon: ZapIcon },
  social: { name: 'Social', icon: MessageCircleIcon },
  storage: { name: 'Storage', icon: ArchiveIcon },
  technology: { name: 'Technology', icon: HardDriveIcon },
  transportation: { name: 'Transporation', icon: TruckIcon },
  utility: { name: 'Utility', icon: BriefcaseIcon },
  worldgen: { name: 'Worldgen', icon: EarthIcon },
  // CurseForge tags
  'server-utility': { name: 'Server Utility', icon: ServerIcon },
  'armor-weapons-tools': { name: 'Armor, Tools, and Weapons', icon: SwordsIcon },
  'library-api': { name: 'API and Library', icon: BookIcon },
  'adventure-rpg': { name: 'Adventure and RPG', icon: CompassIcon },
  'world-gen': { name: 'World Gen', icon: EarthIcon },
  cosmetic: { name: 'Cosmetic', icon: ShirtIcon },
  // 'magic'
  // 'storage'
  'mc-food': { name: 'Food', icon: CarrotIcon },
  performance: { name: 'Performance', icon: ZapIcon },
  'map-information': { name: 'Map and Information', icon: MapIcon },
  'bug-fixes': { name: 'Bug Fixes', icon: BugOffIcon },
  'mc-addons': { name: 'Addons', icon: PuzzleIcon },
  education: { name: 'Education', icon: GraduationCapIcon },
  // 'technology'
  'mc-miscellaneous': { name: 'Miscellaneous', icon: FileQuestionIcon },
  redstone: { name: 'Redstone', icon: CircuitBoardIcon },
  'utility-qol': { name: 'Utility & QoL', icon: BriefcaseIcon },
  'mc-creator': { name: 'MCreator', icon: BiohazardIcon }
}

export const ModTagIcons: { [key: string]: any } = {
  // Modrinth tags
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
  worldgen: EarthIcon,
  // CurseForge tags
  'server-utility': ServerIcon,
  'armor-weapons-tools': SwordsIcon,
  'library-api': BookIcon,
  'adventure-rpg': CompassIcon,
  'world-gen': EarthIcon,
  cosmetic: ShirtIcon,
  // 'magic'
  // 'storage'
  'mc-food': CarrotIcon,
  performance: ZapIcon,
  'map-information': MapIcon,
  'bug-fixes': BugOffIcon,
  'mc-addons': PuzzleIcon,
  education: GraduationCapIcon,
  // 'technology'
  'mc-miscellaneous': FileQuestionIcon,
  redstone: CircuitBoardIcon,
  'utility-qol': BriefcaseIcon,
  'mc-creator': BiohazardIcon
}

interface ModDisplayInformation {
  authors: ModAuthor[];
  latest_version: string;
  license: { name: string; url: string | null };
}

export function getLatestVersion(project: ModProject): string {
  return project.game_versions.length === 0 ? 'N/A' : project.game_versions[project.game_versions.length - 1];
}

export async function getModProjectInformation(project: ModProject): Promise<ModDisplayInformation> {
  const authors = await platforms.getProjectAuthors(project);

  const license = !project.license ? 'Unknown' : project.license.id === ARRNoLicense ? ARR : project.license.id.startsWith('LicenseRef') ? 'Custom' : project.license.id || 'Unknown';

  return {
    authors,
    latest_version: getLatestVersion(project),
    license: {name: license, url: project?.license?.url || null}
  };
}