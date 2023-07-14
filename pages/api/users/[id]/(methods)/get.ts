import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";

export default async function get(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const id = request.query.id;

  try {
    const user = await prisma?.user.findUnique({
      where: {
        id: parseInt(id.toString()),
      },
      include: {
        feeds: true,
        posts: true,
        ownedFeeds: true,
        projects: true,
      },
    });
    // console.log("got user: ", user);
    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
