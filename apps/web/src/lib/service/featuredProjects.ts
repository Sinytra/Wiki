import platforms, {PlatformProject} from "@repo/shared/platforms";
import {Project, ProjectType} from "@repo/shared/types/service";
import {ProjectPlatform} from "@repo/shared/types/platform";
import projectApi from "@/lib/service/api/projectApi";

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

async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    const popular = await projectApi.getPopularProjects();
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

async function resolveProject(project: Project): Promise<{project: Project, resolved: PlatformProject  }> {
  const resolved = await platforms.getPlatformProject(project);
  return {project, resolved}
}

async function constructFeaturedProject({project, resolved}: {project: Project, resolved: PlatformProject}): Promise<FeaturedProject> {
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

async function getProjectLinks(project: Project, sourceUrl?: string): Promise<FeaturedProject["links"]> {
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
