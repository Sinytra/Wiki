import {
  ContentRecipeUsage,
  DocumentationPage,
  FileTreeEntry,
  LayoutTree,
  Project,
  ProjectSearchResults, ProjectWithInfo,
  ServiceProvider
} from "@/lib/service/index";
import sources, {DocumentationSource} from "@/lib/docs/sources";
import assets, {AssetLocation} from "../assets";
import platforms from "@/lib/platforms";
import {GameProjectRecipe, ProjectContentEntry, ProjectContentTree} from "@/lib/service/types";
import markdown from "@/lib/markdown";
import {unstable_cache} from "next/cache";

async function getProjectSource(slug: string): Promise<DocumentationSource | null> {
  const localSources = await sources.getLocalDocumentationSources();
  const src = localSources.find(s => s.id === slug);
  return src || null;
}

async function getProject(slug: string): Promise<ProjectWithInfo | null> {
  const src = await getProjectSource(slug);
  if (src) {
    return sourceToProject(src)
  }
  return null;
}

async function sourceToProject(src: DocumentationSource): Promise<ProjectWithInfo> {
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
      pageCount: 0,
      contentCount: 0
    }
  };
}

async function getBackendLayout(slug: string, version: string | null, locale: string | null): Promise<LayoutTree | null> {
  const src = await getProjectSource(slug);
  if (src) {
    const project = await sourceToProject(src);
    const locales = await sources.getAvailableLocales(src);
    const tree = await sources.readDocsTree(src, locale || undefined);
    return {
      project: {...project, locales},
      tree
    }
  }
  return null;
}

async function getAsset(slug: string, location: string, version: string | null): Promise<AssetLocation | null> {
  const src = await getProjectSource(slug);
  if (src) {
    return assets.getAssetResource(location, src);
  }
  return null;
}

async function getDocsPage(slug: string, path: string[], version: string | null, locale: string | null, optional: boolean): Promise<DocumentationPage | undefined | null> {
  const src = await getProjectSource(slug);
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
    const file = await sources.readDocsFile(src, path, locale || undefined, optional);
    if (file) {
      return {
        project,
        content: file.content,
        updated_at: file.updated_at
      }
    }
    return null;
  }
  return undefined;
}

async function getLocalContentTree(slug: string, locale: string | null): Promise<ProjectContentTree> {
  const src = await getProjectSource(slug);
  if (src) {
    const modifiedSrc = {...src, path: src.path + '/.content'};
    const tree = await sources.readDocsTree(modifiedSrc, locale || undefined);
    const processEntry: (e: FileTreeEntry) => Promise<ProjectContentEntry | null> = async (entry) => {
      if (entry.type === 'dir') {
        const children = await Promise.all(entry.children.map(c => processEntry(c)));
        return { ...entry, children: children.filter(c => c != null) };
      } else {
        const file = await sources.readDocsFile(src, ['.content', entry.path], locale || undefined, true);
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
  return [];
}

async function searchProjects(query: string, page: number, types: string | null, sort: string | null): Promise<ProjectSearchResults> {
  return {pages: 0, total: 0, data: []};
}

async function getProjectRecipe(project: string, recipe: string): Promise<GameProjectRecipe | null> {
  return null; // TODO
}

async function getProjectContents(project: string): Promise<ProjectContentTree | null> {
  const cache = unstable_cache(
    async (project: string) => getLocalContentTree(project, null),
    [],
    {
      revalidate: false,
      tags: ['local_content_tree']
    }
  );
  return cache(project);
}

async function getProjectContentPage(project: string, id: string): Promise<DocumentationPage | null> {
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
  return null; // TODO
}

export default {
  getBackendLayout,
  getAsset,
  getDocsPage,
  getProject,
  searchProjects,
  getProjectRecipe,
  getProjectContents,
  getProjectContentPage,
  getContentRecipeUsage
} satisfies ServiceProvider;