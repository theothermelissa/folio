import { NextApiRequest, NextApiResponse } from "next/types";
import { verifyUnique } from "../../../lib/verifyUnique";
import prisma from "../../../lib/prisma";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const userId = request.query.id;
  if (request.method === "GET") {
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
    const { key, updatedValue, shouldBeUnique } = JSON.parse(request.body);
    console.log(
      "request received to update user ",
      userId,
      "'s ",
      key,
      " to ",
      updatedValue
    );
    if (shouldBeUnique) {
      const isUnique = verifyUnique(updatedValue, key);
      if (!isUnique) {
        response.status(500).json({
          error: `This ${key} is already in use; please choose another.`,
        });
      }
    }
    try {
      await prisma?.user.update({
        where: {
          id: parseInt(userId.toString()),
        },
        data: {
          [key]: updatedValue,
        },
      });
      console.log("update request sent");
      response
        .status(200)
        ?.json({ message: `${key} update request complete.` });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
}
