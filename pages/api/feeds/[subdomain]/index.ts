import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "../../../../lib/prisma";

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
      response.status(200).json(posts);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
}
