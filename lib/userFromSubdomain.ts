import prisma from "./prisma";

export async function getUserFromSubdomain(subdomain: string) {
  const userResult = await prisma?.feed.findUnique({
    where: {
      subdomain: subdomain,
    },
    include: {
      owner: true,
    },
  });
  return userResult?.owner.phone;
}
