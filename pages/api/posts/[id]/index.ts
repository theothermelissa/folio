import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient({ log: ["query"] });

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const id = request.query.id;
  try {
    const posts = await prisma?.post.findUnique({
      where: {
        id: parseInt(id.toString()),
      },
    });
    response.status(200).json(posts);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
