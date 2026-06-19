// noinspection JSUnusedLocalSymbols

import platforms from '@repo/shared/platforms';
import localDocs, { LocalDocumentationSource } from './localDocsPages';
import { ProjectContext, ServiceProvider, ServiceProviderFactory } from '@repo/shared/types/service';
import { AssetLocation } from '@repo/shared/assets';
import localAssets from './localAssets';
import {
  BrowseResponse,
  FileTreeEntry,
  ProjectData,
  ProjectPage,
  RecipeTypeResponse,
  ResolvedGameRecipe,
  ResolvedItem,
  ResourceLocation,
  TreeResponse
} from '@sinytra/wiki-api-types';
import localContent from './localContent';
import { pick } from 'lodash';
import markdown from '@repo/markdown';

function findDocsFiles(entry: FileTreeEntry): FileTreeEntry[] {
  return entry.type === 'file' ? [entry] : entry.children.flatMap(findDocsFiles);
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

  const contentPages = (await localContent.getLocalSourceContentTree(src, null)) || [];
  const fileContentPages = contentPages.flatMap(findDocsFiles);
  const locales = await localDocs.getAvailableLocales(src);

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
      page_count: filePages.length,
      content_count: fileContentPages.length,
      licenses: {
        project: null
      }
    },
    versions: [],
    locales
  };
}

async function getBackendLayout(ctx: ProjectContext): Promise<TreeResponse | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    const tree = await localDocs.readDocsTree(src, ctx.locale || undefined);
    return { tree };
  }
  return null;
}

async function getAsset(location: ResourceLocation, ctx: ProjectContext): Promise<AssetLocation | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  return src ? localAssets.resolveAsset(src, location) : null;
}

async function getItemAsset(location: ResourceLocation, ctx: ProjectContext): Promise<AssetLocation | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    const actualLocation = src.format.getItemAssetLocation(location);
    return localAssets.resolveAsset(src, actualLocation);
  }
  return null;
}

async function getLocalAssetFile(location: ResourceLocation, ctx: ProjectContext): Promise<string | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    return localAssets.resolveAssetPath(src, location);
  }
  return null;
}

async function getDocsIndexPage(ctx: ProjectContext): Promise<ProjectPage | undefined | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    const path = [src.format.getDocsIndexPagePath()];
    return getDocsPageAt(src, 'docs', path, true, ctx);
  }
  return undefined;
}

async function getDocsPage(
  path: string[],
  optional: boolean,
  ctx: ProjectContext
): Promise<ProjectPage | undefined | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    return getDocsPageAt(src, 'docs', path, optional, ctx);
  }
  return undefined;
}

async function getDocsPageAt(
  src: LocalDocumentationSource,
  type: 'docs' | 'content',
  path: string[],
  optional: boolean,
  ctx: ProjectContext
): Promise<ProjectPage | null> {
  const file = await localDocs.readDocsFile(src, type, path, ctx.locale || undefined, optional);
  if (file) {
    const frontmatter = await markdown.readProcessedFrontmatter(file.content);
    const links = await localContent.resolveContentLinks(frontmatter.links ?? [], ctx);
    const infobox = frontmatter.infobox;
    if (infobox?.display && !infobox?.tabs) {
      infobox.tabs = [{ name: '', display: infobox.display }];
    }

    infobox?.tabs?.forEach((tab) => {
      if (!Array.isArray(tab.display)) {
        tab.display = [tab.display];
      }
    });

    return {
      frontmatter: {
        id: frontmatter.id ? (Array.isArray(frontmatter.id) ? frontmatter.id : [frontmatter.id]) : [],
        title: frontmatter.title ?? null,
        type: frontmatter.type,
        icon: frontmatter.icon,
        infobox,
        history: frontmatter.history,
        custom: frontmatter.custom
      },
      content: file.content,
      edit_url: null,
      properties: {},
      links
    };
  }
  return null;
}

async function searchProjects(
  _query: string,
  _page: number,
  _types: string | null,
  _sort: string | null
): Promise<BrowseResponse | null> {
  return null;
}

async function getProjectRecipe(_recipe: string, _ctx: ProjectContext): Promise<ResolvedGameRecipe | null> {
  return null;
}

async function getProjectContentPage(ref: string, ctx: ProjectContext): Promise<ProjectPage | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src == null) {
    return null;
  }

  const tree = await localContent.getProjectContents(ctx);
  if (tree == null) {
    return null;
  }

  for (const child of tree) {
    const entry = localContent.findTreeEntry((e) => e.ref != null && e.ref == ref, child);
    if (entry) {
      const page = await getDocsPageAt(src, 'content', [entry.path], false, ctx);
      if (page) {
        const src = await localDocs.getProjectSource(ctx.id);
        const properties = await localContent.getLocalItemProperties(src!);
        const filteredProps = pick(properties, page.frontmatter.id);

        if (src) {
          page.frontmatter.infobox = await localContent.constructInfobox(src.format, page.frontmatter, ctx);
        }

        return {
          ...page,
          properties: filteredProps
        };
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

const serviceProvider: ServiceProvider = {
  getBackendLayout,
  getAsset,
  getItemAsset,
  getDocsPage,
  getDocsIndexPage,
  getProject,
  searchProjects,
  getProjectRecipe,
  getProjectContents: localContent.getProjectContents,
  getProjectContentPage,
  getContentRecipeUsage,
  getContentRecipeObtaining,
  getRecipeType
};

export const serviceProviderFactory: ServiceProviderFactory = {
  isAvailable() {
    return process.env.LOCAL_DOCS_ROOTS != null;
  },
  create() {
    return serviceProvider;
  }
};

export default { getLocalAssetFile };
