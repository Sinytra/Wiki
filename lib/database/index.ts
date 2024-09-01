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

async function findExistingProject(id: string, source_repo: string, source_path: string) {
  return prisma.mod.findFirst({
    where: {
      OR: [
        {id},
        {source_repo, source_path}
      ]
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

async function searchProjectsPaginated(limit: number, query?: string, page?: number) {
  //@ts-ignore
  return prisma.mod.paginate({
    where: {
      name: {
        search: query ? query.split(' ').map(v => v + ':*').join(' &#124; ') : undefined,
      }
    },
    select: {
      id: true,
      name: true,
      source_repo: true,
      platform: true,
      slug: true
    }
  }).withPages({
    page,
    limit,
    includePageCount: true
  });
}

async function searchProjects(query: string) {
  return prisma.mod.findMany({
    where: {
      name: {
        search: query ? query.split(' ').map(v => v + ':*').join(' &#124; ') : undefined,
      }
    },
    select: {
      id: true,
      name: true
    }
  });
}

async function getProject(slug: string) {
  return prisma.mod.findUnique({
    where: {
      id: slug
    }
  });
}

async function getAllProjectIDs() {
  return prisma.mod.findMany({
    select: {
      id: true
    }
  });
}

async function getRandomProjectID(): Promise<string | null> {
  const ids = await prisma.$queryRaw`SELECT id FROM "Mod" ORDER BY random() LIMIT 1;` as {id: string}[];
  return ids.length === 0 ? null : ids[0].id;
}

const database = {
  registerProject,
  getProject,
  getProjects,
  unregisterProject,
  searchProjects,
  updateProject,
  findExistingProject,
  searchProjectsPaginated,
  getAllProjectIDs,
  getRandomProjectID
};

export default database;