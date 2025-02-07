import {AssetLocation} from "@/lib/assets";

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

export interface RecipeItem {
  id: string;
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
  type: string;
  inputs: RecipeIngredient[];
  outputs: RecipeIngredientItem[];
}

export interface ResolvedItem {
  id: string;
  src: AssetLocation;
  name: string;
}