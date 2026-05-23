// noinspection JSUnusedLocalSymbols

import platforms from '@repo/shared/platforms';
import localDocs, {LocalDocumentationSource} from './localDocsPages';
import {
  ContentFileTree,
  ItemProperties,
  ProjectContext,
  ServiceProvider,
  ServiceProviderFactory
} from '@repo/shared/types/service';
import {AssetLocation} from '@repo/shared/assets';
import localAssets from './localAssets';
import markdown from '@repo/markdown';
import localFiles from './localFiles';
import {
  BrowseResponse,
  ContentFileTreeEntry, ContentItemNameResponse, ContentItemResponse,
  FileTreeEntry,
  ProjectData, RecipeTypeResponse, ResolvedGameRecipe, ResolvedItem,
  ResourceLocation,
  TreeResponse
} from '@sinytra/wiki-api-types';

function findDocsFiles(entry: FileTreeEntry): FileTreeEntry[] {
  return entry.type === 'file' ? [entry] : entry.children.flatMap(findDocsFiles);
}

async function getLocalSourceContentTree(src: LocalDocumentationSource, locale?: string | null): Promise<ContentFileTree | null> {
  const modifiedSrc = {...src, path: src.path + '/.content'};
  const tree = await localDocs.readDocsTree(modifiedSrc, locale || undefined);
  const processEntry: (e: FileTreeEntry) => Promise<ContentFileTreeEntry | null> = async (entry) => {
    if (entry.type === 'dir') {
      const children = await Promise.all(entry.children.map(c => processEntry(c)));
      return {...entry, children: children.filter(c => c != null)};
    } else {
      const file = await localDocs.readDocsFile(src, ['.content', entry.path], locale || undefined, true);
      if (file) {
        const frontmatter = markdown.readFrontmatter(file.content);
        if (frontmatter.id) {
          return {
            id: frontmatter.id,
            icon: frontmatter.icon,
            name: entry.name,
            path: entry.path,
            type: entry.type,
            children: []
          };
        }
      }
    }
    return null;
  };
  const results = await Promise.all(tree.map(e => processEntry(e)));
  return results.filter(c => c != null);
}

async function getLocalItemProperties(src: LocalDocumentationSource, id: string): Promise<ItemProperties | null> {
  try {
    const props = await localFiles.readFileContents(src, '.data/properties.json');
    const parsed = JSON.parse(props.content);
    return parsed[id] ?? null;
  } catch (e: any) {
    if (e.code != 'ENOENT') {
      console.error('Error reading item properties file', e);
    }
  }
  return null;
}

async function getProject(ctx: ProjectContext): Promise<ProjectData | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    return sourceToProject(src);
  }
  return null;
}

async function sourceToProject(src: LocalDocumentationSource): Promise<ProjectData> {
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
    local: true,
    type: project.type,
    source_repo: null,
    created_at: '',
    info: {
      pageCount: filePages.length,
      contentCount: fileContentPages.length,
      licenses: {
        project: null
      }
    },
    versions: [],
    locales: []
  };
}

async function getBackendLayout(ctx: ProjectContext): Promise<TreeResponse | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    const tree = await localDocs.readDocsTree(src, ctx.locale || undefined);
    return {tree};
  }
  return null;
}

async function getAsset(location: ResourceLocation, ctx: ProjectContext): Promise<AssetLocation | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  return src ? localAssets.resolveAsset(src.path, location) : null;
}

async function getDocsPage(path: string[], optional: boolean, ctx: ProjectContext): Promise<ContentItemResponse | undefined | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    const file = await localDocs.readDocsFile(src, path, ctx.locale || undefined, optional);
    if (file) {
      return {content: file.content, edit_url: null, properties: {}};
    }
    return null;
  }
  return undefined;
}

async function searchProjects(_query: string, _page: number, _types: string | null, _sort: string | null): Promise<BrowseResponse | null> {
  return null;
}

async function getProjectRecipe(_recipe: string, _ctx: ProjectContext): Promise<ResolvedGameRecipe | null> {
  return null;
}

async function getProjectContents(ctx: ProjectContext): Promise<ContentFileTree | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    return getLocalSourceContentTree(src, ctx.locale);
  }
  return null;
}

async function getProjectContentPage(id: string, ctx: ProjectContext): Promise<ContentItemResponse | null> {
  const tree = await getProjectContents(ctx);
  const findRecursive: (e: ContentFileTreeEntry) => string | null = (e) => {
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
  };
  if (tree) {
    for (const e of tree) {
      const path = findRecursive(e);
      if (path) {
        const page = await getDocsPage(['.content', path], false, ctx);
        if (page) {
          const src = await localDocs.getProjectSource(ctx.id);
          const properties = await getLocalItemProperties(src!, id);
          return {...page, properties: properties || {}};
        }
      }
    }
  }
  return null;
}

async function getContentRecipeUsage(_id: string, _ctx: ProjectContext): Promise<ResolvedItem[] | null> {
  return null;
}

async function getContentRecipeObtaining(_id: string, _ctx: ProjectContext): Promise<ResolvedGameRecipe[] | null> {
  return null;
}

async function getRecipeType(_type: string, _ctx: ProjectContext): Promise<RecipeTypeResponse | null> {
  return null;
}

function flattenChildren(entries: ContentFileTreeEntry[]): ContentFileTreeEntry[] {
  return [...entries, ...entries.flatMap(e => flattenChildren(e.children || []))];
}

async function getContentItemName(id: string, ctx: ProjectContext): Promise<ContentItemNameResponse | null> {
  const contents = await getProjectContents(ctx);
  if (!contents) {
    return null;
  }
  const flat = flattenChildren(contents);
  for (const entry of flat) {
    if (entry.id === id) {
      return {source: id, id, name: entry.name};
    }
  }
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
  getRecipeType,
  getContentItemName
};

export const serviceProviderFactory: ServiceProviderFactory = {
  isAvailable() {
    return process.env.LOCAL_DOCS_ROOTS != null;
  },
  create() {
    return serviceProvider;
  }
};
