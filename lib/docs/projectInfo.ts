import {
  ArchiveIcon,
  BiohazardIcon,
  BookIcon,
  BoxIcon,
  BracesIcon,
  BriefcaseIcon,
  BugIcon,
  BugOffIcon,
  CarrotIcon,
  CircuitBoardIcon,
  CompassIcon,
  DollarSignIcon,
  EarthIcon,
  FileQuestionIcon,
  Gamepad2Icon,
  GraduationCapIcon,
  HardDriveIcon,
  HouseIcon,
  MapIcon,
  MessageCircleIcon,
  PackageOpenIcon,
  PaintbrushIcon,
  PawPrint,
  PuzzleIcon,
  ServerIcon,
  ShirtIcon,
  SlidersVerticalIcon,
  SwatchBookIcon,
  SwordsIcon,
  TruckIcon,
  UnplugIcon,
  WandIcon,
  ZapIcon
} from "lucide-react";
import platforms, {PlatformProject, PlatformProjectAuthor, ProjectPlatform} from "@/lib/platforms";
import {getTranslations} from "next-intl/server";
import {ProjectType} from "@/lib/service/types";
import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import {ElementType} from "react";

export const ARRNoLicense: string = 'LicenseRef-All-Rights-Reserved';

export const ProjectHostingPlatforms: { [key in ProjectPlatform]: { name: string; icon: ElementType } } = {
  curseforge: {name: 'CurseForge', icon: CurseForgeIcon},
  modrinth: {name: 'Modrinth', icon: ModrinthIcon}
};

export const ProjectCategories: { [key: string]: any } = {
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
  'mc-creator': BiohazardIcon,
}

export const ProjectTypeIcons: { [key in ProjectType]: any } = {
  [ProjectType.MOD]: BoxIcon,
  [ProjectType.MODPACK]: PackageOpenIcon,
  [ProjectType.RESOURCEPACK]: PaintbrushIcon,
  [ProjectType.DATAPACK]: BracesIcon,
  [ProjectType.SHADER]: SwatchBookIcon,
  [ProjectType.PLUGIN]: UnplugIcon
}

export interface ProjectDisplayInformation {
  authors: PlatformProjectAuthor[];
  latest_version: string;
  license: { name: string; url: string | null };
}

export function getLatestVersion(project: PlatformProject): string | undefined {
  return project.game_versions.length === 0 ? undefined : project.game_versions[project.game_versions.length - 1];
}

export async function getPlatformProjectInformation(project: PlatformProject): Promise<ProjectDisplayInformation> {
  const authors = await platforms.getProjectAuthors(project);
  const t = await getTranslations('DocsProjectInfo');

  const license = !project.license ? t('license.unknown') : project.license.id === ARRNoLicense ? t('license.arr') : project.license.id.startsWith('LicenseRef') ? t('license.custom') : project.license.id || t('license.unknown');

  return {
    authors,
    latest_version: getLatestVersion(project) || t('latest.unknown'),
    license: {name: license, url: project?.license?.url || null}
  };
}