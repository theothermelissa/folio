import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../lib/prisma";

export default async function getPost(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const id = request.query.id;

  // console.log(">>>>>>>>>> GETTING POSTS FOR THIS USER <<<<<<<<<<<");

  try {
    const posts = await prisma?.post.findMany({
      where: {
        authorId: parseInt(id.toString()),
      },
    });
    // console.log("POSTS IN GET: ", posts);
    response.status(200).json(posts);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
