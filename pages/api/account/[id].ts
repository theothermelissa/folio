import { NextApiRequest, NextApiResponse } from "next/types";
import { verifyUnique } from "../../../lib/verifyUnique";
import prisma from "../../../lib/prisma";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const userId = request.query.id;
  console.log("query: ", request.query);
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
    const { keyToUpdate, updatedValue, shouldBeUnique } = JSON.parse(
      request.body
    );
    console.log(
      "request received to update user ",
      userId,
      "'s ",
      keyToUpdate,
      " to ",
      updatedValue
    );
    if (shouldBeUnique) {
      const isUnique = verifyUnique(updatedValue, keyToUpdate);
      if (!isUnique) {
        response.status(500).json({
          error: `This ${keyToUpdate} is already in use; please choose another.`,
        });
      }
    }
    try {
      console.log("making server call to update user");
      await prisma?.user.update({
        where: {
          id: parseInt(userId.toString()),
        },
        data: {
          [keyToUpdate]: updatedValue,
        },
      });
      console.log("update request sent");
      response
        .status(200)
        ?.json({ message: `${keyToUpdate} update request complete.` });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
}
