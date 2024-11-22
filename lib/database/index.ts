import prisma from "@/lib/database/prisma";

async function migrateRepository(fromFullName: string, toFullName: string) {
  return prisma.mod.updateMany({
    where: {
      source_repo: fromFullName
    },
    data: {
      source_repo: toFullName
    }
  })
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

const database = {
  getProjects,
  migrateRepository,
};

export default database;