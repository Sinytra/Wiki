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