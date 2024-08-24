import prisma from "@/lib/database/prisma";
import {ModPlatform} from "@/lib/platforms";

// TODO Caching DB requests

async function registerProject(id: string, name: string, platform: ModPlatform, slug: string, source_repo: string, source_branch: string, source_path: string) {
  // TODO Throw error on duplicate
  const existing = await prisma.mod.findUnique({
    where: {
      id: slug
    }
  });
  if (!existing) {
    await prisma.mod.create({
      data: {id, name, platform, slug, source_repo, source_branch, source_path}
    })
  }
}

async function updateProject(id: string, name: string, platform: ModPlatform, slug: string, source_repo: string, source_branch: string, source_path: string) {
  return prisma.mod.update({
    where: {
      id
    },
    data: {name, platform, slug, source_repo, source_branch, source_path}
  });
}

async function unregisterProject(id: string) {
  return prisma.mod.delete({
    where: {
      id
    }
  });
}

async function getProjects(repoNames: string[]) {
  return prisma.mod.findMany({
    where: {
      source_repo: {
        in: repoNames
      }
    }
  });
}

async function searchProjects(query: string) {
  return prisma.mod.findMany({
    where: {
      name: {
        search: query.split(' ').map(v => v + ':*').join(' &#124; '),
      }
    },
    select: {
      id: true,
      name: true
    }
  });
}

async function getProjectStatuses(slugs: string[]) {
  const projects = await prisma.mod.findMany({
    select: {
      id: true
    },
    where: {
      id: {
        in: slugs
      }
    }
  });
  return projects.map(p => p.id);
}

async function getProject(slug: string) {
  return prisma.mod.findUnique({
    where: {
      id: slug
    }
  });
}

const database = {
  registerProject,
  getProjectStatuses,
  getProject,
  getProjects,
  unregisterProject,
  searchProjects,
  updateProject
};

export default database;