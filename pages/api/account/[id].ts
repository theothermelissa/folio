import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "../../../lib/prisma";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    const userId = request.query.id;
    try {
      const posts = await prisma?.user.findUnique({
        where: {
          id: parseInt(userId.toString()),
        },
        include: {
          posts: true,
          feeds: true,
          ownedFeeds: true,
          projects: true,
        },
      });
      response.status(200).json(posts);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
  if (request.method === "PUT") {
    const userId = request.query.id;
    console.log("request to update user ", userId, " to ", request.body);
    try {
      await prisma?.user.update({
        where: {
          id: parseInt(userId.toString()),
        },
        data: {
          name: request.body,
        },
      });
      console.log("user updated? maybe?");
      response.status(200)?.json({ message: "User updated" });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
}
