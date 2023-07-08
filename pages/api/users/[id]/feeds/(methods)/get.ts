import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../lib/prisma";

export default async function getFeed(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const id = request.query.id;

  console.log(">>>>>>>>>> GETTING FEEDS FOR THIS USER <<<<<<<<<<<");

  try {
    const feeds = await prisma?.feed.findMany({
      where: {
        ownerId: parseInt(id.toString()),
      },
    });
    console.log("FEEDS IN GET: ", feeds);
    response.status(200).json(feeds);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
