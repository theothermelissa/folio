import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "../../../lib/prisma";
// const prisma = new PrismaClient({ log: ["query"] });

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    // const subdomain = request.headers["subdomain"];
    // console.log("subdomain: ", subdomain);
    try {
      const feeds = await prisma?.feed.findMany({});
      response.status(200).json(feeds);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
}
