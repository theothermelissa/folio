import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { middleware } from "supertokens-node/framework/express";
import { NextApiRequest, NextApiResponse } from "next";
import { Request, Response } from "express";
import supertokens from "supertokens-node";
import backendConfig from "../../../config/backendConfig";
import NextCors from "nextjs-cors";

supertokens.init(backendConfig());

const { NEXT_PUBLIC_BASE_URL_PATH } = process.env;

export default async function superTokens(
  req: NextApiRequest & Request,
  res: NextApiResponse & Response
) {
  const originRegEx = new RegExp("." + NEXT_PUBLIC_BASE_URL_PATH + "$");
  // NOTE: We need CORS only if we are querying the APIs from a different origin
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: originRegEx,
    credentials: true,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  });

  await superTokensNextWrapper(
    async (next) => {
      // This is needed for production deployments with Vercel
      res.setHeader(
        "Cache-Control",
        "no-cache, no-store, max-age=0, must-revalidate"
      );
      await middleware()(req, res, next);
    },
    req,
    res
  );
  if (!res.writableEnded) {
    res.status(404).send("Not found");
  }
}
