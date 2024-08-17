import prisma from "@/lib/database/prisma";
import {auth} from "@/lib/auth";
import {ModPlatform} from "@/lib/platforms";

// TODO Caching DB requests

async function enableProject(slug: string, name: string, source: ModPlatform, source_url: string): Promise<boolean> {
  const session = await auth();

  if (!session?.access_token) {
    return false;
  }

  // const user = await modrinth.getUserProfile(session?.access_token!);

  // if (user && modrinth.isValidProject(project) && await modrinth.isProjectMember(user.username, project)) {
  //   // await registerProject(project.slug); TODO
  //   return true;
  // }

  // TODO Show error
  await registerProject(slug, name, source, source_url);
  return true;
}

async function registerProject(slug: string, name: string, source: ModPlatform, source_url: string) {
  // TODO Throw error on duplicate
  const existing = await prisma.mod.findUnique({
    where: {
      id: slug
    }
  });
  if (!existing) {
    await prisma.mod.create({
      data: {
        id: slug,
        name: name,
        source,
        source_url
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