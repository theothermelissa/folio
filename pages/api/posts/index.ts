import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next/types";

const prisma = new PrismaClient({ log: ["query"] });

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    const subdomain = request.headers["subdomain"];
    // console.log("subdomain: ", subdomain);
    try {
      const posts = await prisma?.feed.findUnique({
        where: {
          subdomain: subdomain.toString(),
        },
        include: {
          posts: true,
        },
      });
      // const posts = await prisma?.feed.findUnique({
      //   where: {
      //     subdomain: "theothermelissa",
      //   },
      //   include: {
      //     posts: true,
      //   },
      // });
      // console.log("posts: ", posts);
      response.status(200).json(posts);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
}
