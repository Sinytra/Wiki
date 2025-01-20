import {DocumentationPage, LayoutTree, Project, ProjectSearchResults, ServiceProvider} from "@/lib/service/index";
import sources, {DocumentationSource} from "@/lib/docs/sources";
import assets, {AssetLocation} from "../assets";
import platforms from "@/lib/platforms";

async function getProjectSource(slug: string): Promise<DocumentationSource | null> {
  const localSources = await sources.getLocalDocumentationSources();
  const src = localSources.find(s => s.id === slug);
  return src || null;
}

async function getProject(slug: string): Promise<Project | null> {
  const src = await getProjectSource(slug);
  if (src) {
    return sourceToProject(src)
  }
  return null;
}

async function sourceToProject(src: DocumentationSource): Promise<Project> {
  const project = await platforms.getPlatformProject(src);

  return {
    id: src.id,
    name: project.name,
    platforms: src.platforms,
    is_community: src.is_community,
    is_public: false,
    local: true,
    type: project.type,
    created_at: ''
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

async function searchProjects(query: string, page: number, types: string | null, sort: string | null): Promise<ProjectSearchResults> {
  return {pages: 0, total: 0, data: []};
}

export default {
  getBackendLayout,
  getAsset,
  getDocsPage,
  getProject,
  searchProjects
} satisfies ServiceProvider;