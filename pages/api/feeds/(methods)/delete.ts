import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function deleteFeed(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const id = request.query.id;

  try {
    const feeds = await prisma?.feed.delete({
      where: {
        id: parseInt(id.toString()),
      },
    });
    response.status(200).json(feeds);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
