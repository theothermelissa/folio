import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "../../../lib/prisma";

// const prisma = new PrismaClient({ log: ["query"] });

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    // TODO mpm: add handling for getting all/multiple feed posts
    const subdomain = request.headers["subdomain"];
    console.log("subdomain: ", subdomain);
    if (subdomain) {
      try {
        const posts = await prisma?.feed.findUnique({
          where: {
            subdomain: subdomain.toString(),
          },
          include: {
            posts: true,
          },
        });
        response.status(200).json(posts);
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    } else {
      try {
        const posts = await prisma?.post.findMany();
        response.status(200).json(posts);
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    }
  }
}
