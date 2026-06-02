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
    locales: []
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
  return src ? localAssets.resolveAsset(src.path, location) : null;
}

async function getDocsPage(
  path: string[],
  optional: boolean,
  ctx: ProjectContext
): Promise<ProjectPage | undefined | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    const file = await localDocs.readDocsFile(src, path, ctx.locale || undefined, optional);
    if (file) {
      const frontmatter = await markdown.readProcessedFrontmatter(file.content);
      const links = await localContent.resolveContentLinks(frontmatter.links ?? [], ctx);
      const infobox = frontmatter.infobox;
      if (infobox?.display && !infobox?.tabs) {
        infobox.tabs = [{ name: '', display: infobox.display }];
      }

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
  return undefined;
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
  const tree = await localContent.getProjectContents(ctx);
  if (tree) {
    for (const child of tree) {
      const entry = localContent.findTreeEntry((e) => e.ref != null && e.ref == ref, child);
      if (entry) {
        const page = await getDocsPage(['.content', entry.path], false, ctx);
        if (page) {
          const src = await localDocs.getProjectSource(ctx.id);
          const properties = await localContent.getLocalItemProperties(src!);
          const filteredProps = pick(properties, page.frontmatter.id);

          page.frontmatter.infobox = await localContent.constructInfobox(page.frontmatter, ctx);

          return {
            ...page,
            properties: filteredProps
          };
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

const serviceProvider: ServiceProvider = {
  getBackendLayout,
  getAsset,
  getDocsPage,
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
