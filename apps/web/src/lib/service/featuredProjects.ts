import platforms, {IdentifiableProject, PlatformProject} from "@repo/shared/platforms";
import {ProjectPlatform} from "@repo/shared/types/platform";
import projectApi from "@/lib/service/api/projectApi";
import posthog from "@/lib/service/external/posthog";
import {ProjectType} from "@sinytra/wiki-api-types";

export interface FeaturedProject {
  id: string;
  title: string;
  summary: string;
  icon: string;
  type: ProjectType;
  links: {
    curseforge?: string;
    modrinth?: string;
    github?: string;
  }
}

type TypedIdProject = IdentifiableProject & { type: ProjectType };

async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    const ids = await posthog.getMostPopularProjectIDs();

    const popular = await projectApi.getProjectsByID(ids);
    if (!popular.success) {
      return [];
    }

    const platformsProjects = await Promise.all(popular.data.map(resolveProject));

    return await Promise.all(platformsProjects.map(constructFeaturedProject));
  } catch (e) {
    console.error('Error getting featured projects', e);
    return [];
  }
}

async function resolveProject<T extends TypedIdProject>(project: T): Promise<{project: T, resolved: PlatformProject}> {
  const resolved = await platforms.getPlatformProject(project);
  return {project, resolved}
}

async function constructFeaturedProject<T extends TypedIdProject>({project, resolved}: {project: T, resolved: PlatformProject}): Promise<FeaturedProject> {
  const links = await getProjectLinks(project, resolved.source_url);

  return {
    id: project.id,
    title: resolved.name,
    summary: resolved.summary,
    icon: resolved.icon_url,
    type: resolved.type,
    links
  };
}

async function getProjectLinks<T extends TypedIdProject>(project: T, sourceUrl?: string): Promise<FeaturedProject["links"]> {
  const entries: any = {};
  for (const [key, value] of Object.entries(project.platforms)) {
    entries[key] = platforms.getProjectURL(key as ProjectPlatform, value, project.type);
  }
  return {
    ...entries,
    github: sourceUrl
  };
}

export default {
  getFeaturedProjects
}
