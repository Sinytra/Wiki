import prisma from "@/lib/prisma";

// TODO Caching DB requests

async function enableProject(slug: string, name: string) {
  const existing = await prisma.mod.findUnique({
    where: {
      id: slug
    }
  });
  if (!existing) {
    await prisma.mod.create({
      data: {
        id: slug,
        name: name
      }
    })
  }
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
  enableProject,
  getProjectStatuses,
  getProject
};

export default database;