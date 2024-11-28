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
  const project = await platforms.getPlatformProject(src.platform, src.slug);

  return {
    id: src.id,
    name: project.name,
    platform: src.platform,
    slug: src.slug,
    is_community: src.is_community,
    is_public: false,
    local: true,
    type: project.type
  };
}

async function getBackendLayout(slug: string, version: string | null, locale: string | null): Promise<LayoutTree | null> {
  const src = await getProjectSource(slug);
  if (src) {
    const project = await sourceToProject(src)
    const tree = await sources.readDocsTree(src, locale || undefined);
    return {
      project,
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

async function getDocsPage(slug: string, path: string[], version: string | null, locale: string | null): Promise<DocumentationPage | null> {
  const src = await getProjectSource(slug);
  if (src) {
    const platformProject = await platforms.getPlatformProject(src.platform, src.slug);

    const project: Project = {
      id: src.id,
      name: platformProject.name,
      platform: src.platform,
      slug: src.slug,
      is_community: src.is_community,
      is_public: false,
      local: true,
      type: platformProject.type
    };
    const file = await sources.readDocsFile(src, path, locale || undefined);
    return {
      project,
      content: file.content,
      updated_at: file.updated_at
    }
  }
  return null;
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