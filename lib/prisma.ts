import { PrismaClient } from "@prisma/client/edge";

declare global {
  var prisma: PrismaClient;
}

const prisma = global.prisma || new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
