import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
export async function getUserFromSubdomain(subdomain: string) {
  const userResult = await prisma?.feed.findUnique({
    where: {
      subdomain: subdomain,
    },
    include: {
      owner: true,
    },
  });
  return userResult?.owner;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const subdomain = request.headers["x-subdomain"];
  const user = await getUserFromSubdomain(subdomain.toString());
  console.log("user: ", user);
  const { phone } = user;
  response.status(200).json({ phone });
}
