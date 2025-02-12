import {AssetLocation} from "@/lib/assets";
import {FileTreeEntry} from "@/lib/service/index";

export enum ProjectType {
  MOD = 'mod',
  MODPACK = 'modpack',
  RESOURCEPACK = 'resourcepack',
  DATAPACK = 'datapack',
  SHADER = 'shader',
  PLUGIN = 'plugin'
}

export const AVAILABLE_PROJECT_TYPES: string[] = [
  ProjectType.MOD, ProjectType.MODPACK, ProjectType.RESOURCEPACK, ProjectType.DATAPACK,
  ProjectType.SHADER, ProjectType.PLUGIN
];

export interface Slot {
  x: number;
  y: number;
}

export type SlotMap = Record<number, Slot>;

export interface GameRecipeType {
  localizedName: string | null;
  id: string;
  background: string;
  inputSlots: SlotMap;
  outputSlots: SlotMap;
}

export interface RecipeItem {
  id: string;
  name?: string;
  sources: string[];
}

export interface RecipeItemStack extends RecipeItem {
  count: number;
}

export interface RecipeTag {
  id: string;
  items: RecipeItem[];
}

export interface RecipeIgredientTag {
  count: number;
  slot: number;
  tag: RecipeTag;
}

export interface RecipeIngredientItem {
  slot: number;
  items: RecipeItemStack[];
}

export type RecipeIngredient = RecipeIngredientItem | RecipeIgredientTag;

export interface GameProjectRecipe {
  type: GameRecipeType;
  inputs: RecipeIngredient[];
  outputs: RecipeIngredientItem[];
}

export interface ResolvedItem {
  id: string;
  src: AssetLocation;
  name: string;
}

export type ProjectContentTree = ProjectContentEntry[];

export interface ProjectContentEntry extends FileTreeEntry {
  id?: string;
  children: ProjectContentTree;
}