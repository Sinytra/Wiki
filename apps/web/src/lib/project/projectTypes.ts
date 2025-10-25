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
import CurseForgeIcon from "@repo/ui/icons/CurseForgeIcon";
import ModrinthIcon from "@repo/ui/icons/ModrinthIcon";
import {ElementType} from "react";
import {ProjectType} from "@repo/shared/types/service";
import {ProjectPlatform} from "@repo/shared/types/platform";

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