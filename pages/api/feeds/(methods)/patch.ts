import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { verifyUnique } from "../../../../lib/verifyUnique";

export default async function updateFeed(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { body } = request;

  const { id, keyToUpdate, updatedValue, shouldBeUnique } = JSON.parse(body);

  if (shouldBeUnique) {
    const isUnique = verifyUnique(updatedValue, keyToUpdate);
    if (!isUnique) {
      response.status(500).json({
        error: `This ${keyToUpdate} is already in use; please choose another.`,
      });
    }
  }
  try {
    // console.log("making server call to update user");
    await prisma?.feed.update({
      where: {
        id: parseInt(id),
      },
      data: {
        [keyToUpdate]: updatedValue,
      },
    });
    // console.log("update request sent");
    response
      .status(200)
      ?.json({ message: `${keyToUpdate} update request complete.` });
  } catch (error) {
    // console.log("error in api call: ", error);
    response.status(500).json({ error: error });
  }
}
