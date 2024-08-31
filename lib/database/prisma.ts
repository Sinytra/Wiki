import { PrismaClient } from '@prisma/client';
import {pagination} from "prisma-extension-pagination";


declare global {
  var prisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  //@ts-ignore
  prisma = new PrismaClient().$extends(pagination());
} else {
  if (!global.prisma) {
    //@ts-ignore
    global.prisma = new PrismaClient().$extends(pagination());
  }
  prisma = global.prisma;
}

export default prisma;