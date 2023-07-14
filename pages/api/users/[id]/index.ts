import { NextApiRequest, NextApiResponse } from "next";
import get from "./(methods)/get";

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
    default: {
      response.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
