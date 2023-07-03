import prisma from "./prisma";

export async function verifyUnique(
  value: string,
  type: "email" | "phone" | "subdomain" | "tag"
) {
  console.log("checking if ", value, " is a unique ", type);
  const existingUser = await prisma?.user.findFirst({
    where: {
      [type]: value,
    },
  });
  return existingUser;
}
