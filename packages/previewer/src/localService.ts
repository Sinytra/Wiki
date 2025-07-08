// noinspection JSUnusedLocalSymbols

import platforms from '@repo/platforms';
import localDocs, {LocalDocumentationSource} from "./localDocsPages";
import {
  ContentRecipeUsage,
  DocumentationPage,
  FileTreeEntry, ItemProperties,
  LayoutTree,
  Project,
  ProjectContentEntry,
  ProjectContentTree,
  ProjectSearchResults,
  ProjectWithInfo,
  ResolvedGameRecipe,
  ResolvedGameRecipeType,
  ServiceProvider,
  ServiceProviderFactory
} from "@repo/shared/types/service";
import {AssetLocation} from "@repo/shared/assets";
import localAssets from "./localAssets";
import {ResourceLocation} from "@repo/shared/resourceLocation";
import markdown from "@repo/markdown";
import localFiles from "./localFiles";

function findDocsFiles(entry: FileTreeEntry): FileTreeEntry[] {
  return entry.type === 'file' ? [entry] : entry.children.flatMap(findDocsFiles);
}

async function getLocalSourceContentTree(src: LocalDocumentationSource, locale: string | null): Promise<ProjectContentTree | null> {
  const modifiedSrc = {...src, path: src.path + '/.content'};
  const tree = await localDocs.readDocsTree(modifiedSrc, locale || undefined);
  const processEntry: (e: FileTreeEntry) => Promise<ProjectContentEntry | null> = async (entry) => {
    if (entry.type === 'dir') {
      const children = await Promise.all(entry.children.map(c => processEntry(c)));
      return {...entry, children: children.filter(c => c != null)};
    } else {
      const file = await localDocs.readDocsFile(src, ['.content', entry.path], locale || undefined, true);
      if (file) {
        const frontmatter = markdown.readFrontmatter(file.content);
        if (frontmatter.id) {
          return {id: frontmatter.id, name: entry.name, path: entry.path, type: entry.type, children: []};
        }
      }
    }
    return null;
  }
  const results = await Promise.all(tree.map(e => processEntry(e)));
  return results.filter(c => c != null);
}

async function getLocalItemProperties(src: LocalDocumentationSource, id: string): Promise<ItemProperties | null> {
  const props = await localFiles.readFileContents(src, '.data/properties.json');
  try {
    const parsed = JSON.parse(props.content);
    return parsed[id] ?? null;
  } catch (e) {
    console.error('Error reading item properties file', e);
  }
  return null;
}

async function getProject(slug: string): Promise<ProjectWithInfo | null> {
  const src = await localDocs.getProjectSource(slug);
  if (src) {
    return sourceToProject(src)
  }
  return null;
}

async function sourceToProject(src: LocalDocumentationSource): Promise<ProjectWithInfo> {
  const project = await platforms.getPlatformProject(src);

  const docsPages = await localDocs.readDocsTree(src, undefined);
  const filePages = docsPages.flatMap(findDocsFiles);

  const contentPages = await getLocalSourceContentTree(src, null) || [];
  const fileContentPages = contentPages.flatMap(findDocsFiles);

  return {
    id: src.id,
    name: project.name,
    platforms: src.platforms,
    is_community: src.is_community,
    is_public: false,
    local: true,
    type: project.type,
    created_at: '',
    info: {
      pageCount: filePages.length,
      contentCount: fileContentPages.length
    }
  };
}

async function getBackendLayout(slug: string, version: string | null, locale: string | null): Promise<LayoutTree | null> {
  const src = await localDocs.getProjectSource(slug);
  if (src) {
    const project = await sourceToProject(src);
    const locales = await localDocs.getAvailableLocales(src);
    const tree = await localDocs.readDocsTree(src, locale || undefined);
    return {
      project: {...project, locales},
      tree
    }
  }
  return null;
}

async function getAsset(slug: string, location: ResourceLocation, version: string | null): Promise<AssetLocation | null> {
  const src = await localDocs.getProjectSource(slug);
  return src ? localAssets.resolveAsset(src.path, location) : null;
}

async function getDocsPage(slug: string, path: string[], version: string | null, locale: string | null, optional?: boolean): Promise<DocumentationPage | undefined | null> {
  const src = await localDocs.getProjectSource(slug);
  if (src) {
    const platformProject = await platforms.getPlatformProject(src);

    const project: Project = {
      id: src.id,
      name: platformProject.name,
      platforms: src.platforms,
      is_community: src.is_community,
      is_public: false,
      local: true,
      type: platformProject.type,
      created_at: ''
    };
    const file = await localDocs.readDocsFile(src, path, locale || undefined, optional);
    if (file) {
      return {
        project,
        content: file.content
      }
    }
    return null;
  }
  return undefined;
}

async function searchProjects(query: string, page: number, types: string | null, sort: string | null): Promise<ProjectSearchResults | null> {
  return null;
}

async function getProjectRecipe(project: string, recipe: string, version: string | null, locale: string | null): Promise<ResolvedGameRecipe | null> {
  return null;
}

async function getProjectContents(project: string, version: string | null, locale: string | null): Promise<ProjectContentTree | null> {
  const src = await localDocs.getProjectSource(project);
  if (src) {
    return getLocalSourceContentTree(src, locale);
  }
  return null;
}

async function getProjectContentPage(project: string, id: string, version: string | null, locale: string | null): Promise<DocumentationPage | null> {
  const tree = await getProjectContents(project, version, locale);
  const findRecursive: (e: ProjectContentEntry) => string | null = (e) => {
    if (e.type === 'dir') {
      for (const child of e.children) {
        const res = findRecursive(child);
        if (res) {
          return res;
        }
      }
      return null;
    } else {
      return e.id == id ? e.path : null;
    }
  }
  if (tree) {
    for (const e of tree) {
      const path = findRecursive(e);
      if (path) {
        const page = await getDocsPage(project, ['.content', path], null, null, false);
        if (page) {
          const src = await localDocs.getProjectSource(project);
          const properties = await getLocalItemProperties(src!, id);
          return {...page, properties};
        }
      }
    }
  }
  return null;
}

async function getContentRecipeUsage(project: string, id: string, version: string | null, locale: string | null): Promise<ContentRecipeUsage[] | null> {
  return null;
}

async function getContentRecipeObtaining(project: string, id: string, version: string | null, locale: string | null): Promise<ResolvedGameRecipe[] | null> {
  return null;
}

async function getRecipeType(project: string, type: string, version: string | null, locale: string | null): Promise<ResolvedGameRecipeType | null> {
  return null;
}

const serviceProvider: ServiceProvider = {
  getBackendLayout,
  getAsset,
  getDocsPage,
  getProject,
  searchProjects,
  getProjectRecipe,
  getProjectContents,
  getProjectContentPage,
  getContentRecipeUsage,
  getContentRecipeObtaining,
  getRecipeType
}

export const serviceProviderFactory: ServiceProviderFactory = {
  isAvailable() {
    return process.env.LOCAL_DOCS_ROOTS != null;
  },
  create() {
    return serviceProvider
  }
}
