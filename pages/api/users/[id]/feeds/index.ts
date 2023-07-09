import { NextApiRequest, NextApiResponse } from "next";
import getFeeds from "./(methods)/get";
import deleteFeed from "./(methods)/delete";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { method } = request;

  switch (method) {
    case "GET": {
      await getFeeds(request, response);
      break;
    }
    case "DELETE": {
      // console.log("api call to delete");
      await deleteFeed(request, response);
      break;
    }
    default: {
      response.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
