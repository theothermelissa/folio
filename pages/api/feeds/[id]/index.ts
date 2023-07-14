import { NextApiRequest, NextApiResponse } from "next/types";
import getFeedById from "../(methods)/get";
import updateFeed from "../(methods)/patch";
import deleteFeed from "../(methods)/delete";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { method } = request;

  switch (method) {
    case "GET": {
      await getFeedById(request, response);
      break;
    }
    case "DELETE": {
      // console.log("api call to delete");
      await deleteFeed(request, response);
      break;
    }
    case "PATCH": {
      await updateFeed(request, response);
      break;
    }
    default: {
      response.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
