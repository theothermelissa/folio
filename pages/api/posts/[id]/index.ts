import { NextApiRequest, NextApiResponse } from "next";
import get from "./(methods)/get";
import deletePost from "./(methods)/delete";

// export const config = {
//   runtime: "edge",
// };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { method } = request;

  switch (method) {
    case "GET": {
      await get(request, response);
      break;
    }
    case "DELETE": {
      // console.log("api call to delete");
      await deletePost(request, response);
      break;
    }
    default: {
      response.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
