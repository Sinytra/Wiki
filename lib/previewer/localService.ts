// noinspection JSUnusedLocalSymbols

import {
  ContentRecipeUsage,
  DocumentationPage,
  FileTreeEntry,
  LayoutTree,
  Project,
  ProjectSearchResults,
  ProjectWithInfo,
  ServiceProvider,
  ServiceProviderFactory
} from "@/lib/service";
import assets, {AssetLocation} from "../assets";
import platforms from "@/lib/platforms";
import {GameProjectRecipe, ProjectContentEntry, ProjectContentTree} from "@/lib/service/types";
import markdown from "@/lib/markdown";
import localDocs, {LocalDocumentationSource} from "@/lib/previewer/localDocs";

async function getProject(slug: string): Promise<ProjectWithInfo | null> {
  const src = await localDocs.getProjectSource(slug);
  if (src) {
    return sourceToProject(src)
  }
  return null;
}

async function sourceToProject(src: LocalDocumentationSource): Promise<ProjectWithInfo> {
  const project = await platforms.getPlatformProject(src);

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
      pageCount: 1,
      contentCount: 0
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

async function getAsset(slug: string, location: string, version: string | null): Promise<AssetLocation | null> {
  const src = await localDocs.getProjectSource(slug);
  if (src) {
    return assets.getAssetResource(location, src);
  }
  return null;
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

async function getLocalContentTree(slug: string, locale: string | null): Promise<ProjectContentTree | null> {
  const src = await localDocs.getProjectSource(slug);
  if (src) {
    const modifiedSrc = {...src, path: src.path + '/.content'};
    const tree = await localDocs.readDocsTree(modifiedSrc, locale || undefined);
    const processEntry: (e: FileTreeEntry) => Promise<ProjectContentEntry | null> = async (entry) => {
      if (entry.type === 'dir') {
        const children = await Promise.all(entry.children.map(c => processEntry(c)));
        return { ...entry, children: children.filter(c => c != null) };
      } else {
        const file = await localDocs.readDocsFile(src, ['.content', entry.path], locale || undefined, true);
        if (file) {
          const frontmatter = markdown.readFrontmatter(file.content);
          if (frontmatter.id) {
            return { id: frontmatter.id, name: entry.name, path: entry.path, type: entry.type, children: [] };
          }
        }
      }
      return null;
    };
    const results = await Promise.all(tree.map(e => processEntry(e)));
    return results.filter(c => c != null);
  }
  return null;
}

async function searchProjects(query: string, page: number, types: string | null, sort: string | null): Promise<ProjectSearchResults | null> {
  return null;
}

async function getProjectRecipe(project: string, recipe: string): Promise<GameProjectRecipe | null> {
  return null;
}

async function getProjectContents(project: string): Promise<ProjectContentTree | null> {
  return getLocalContentTree(project, null);
}

async function getProjectContentPage(project: string, id: string, version: string | null, locale: string | null): Promise<DocumentationPage | null> {
  const tree = await getProjectContents(project);
  const findRecursive: (e: ProjectContentEntry) => string | null = (e) => {
    if (e.type === 'dir') {
      for (let child of e.children) {
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
    for (let e of tree) {
      const path = findRecursive(e);
      if (path) {
        return (await getDocsPage(project, ['.content', path], null, null, false)) || null;
      }
    }
  }

  return null; // TODO
}

async function getContentRecipeUsage(project: string, id: string): Promise<ContentRecipeUsage[] | null> {
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
  getContentRecipeUsage
}

export const serviceProviderFactory: ServiceProviderFactory = {
  isAvailable() {
    return process.env.LOCAL_DOCS_ROOTS != null;
  },
  create() {
    return serviceProvider
  }
}
