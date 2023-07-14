import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function getFeedById(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const id = request.query.id;

  try {
    const posts = await prisma?.feed.findUnique({
      where: {
        id: parseInt(id.toString()),
      },
    });
    response.status(200).json(posts);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
