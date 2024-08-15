import prisma from "@/lib/prisma";
import modrinth, {ModrinthProject} from "@/lib/modrinth";
import {auth} from "@/lib/auth";

// TODO Caching DB requests

async function enableProject(project: ModrinthProject): Promise<boolean> {
  const session = await auth();

  if (session?.user && modrinth.isValidProject(project) && await modrinth.isProjectMember(session.user.id!, project)) {
    await registerProject(project.slug);
    return true;
  }

  // TODO Show error
  return false;
}

async function registerProject(slug: string) {
  const existing = await prisma.mod.findUnique({
    where: {
      id: slug
    }
  });
  if (!existing) {
    await prisma.mod.create({
      data: {
        id: slug
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