import {PrismaClient} from '@prisma/client';
import {pagination} from "prisma-extension-pagination";
import {withAccelerate} from '@prisma/extension-accelerate';

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(pagination()).$extends(withAccelerate());
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}