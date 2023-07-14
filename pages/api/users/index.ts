import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import NextCors from "nextjs-cors";
import backendConfig from "../../../config/backendConfig";

supertokens.init(backendConfig());

const { NEXT_PUBLIC_BASE_URL_PATH } = process.env;

export default async function user(req: any, res: any) {
  // NOTE: We need CORS only if we are querying the APIs from a different origin
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: NEXT_PUBLIC_BASE_URL_PATH,
    credentials: true,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  });
  //   console.log("making request to supertokens: ", req);

  // we first verify the session
  await superTokensNextWrapper(
    async (next) => {
      return await verifySession()(req, res, next);
    },
    req,
    res
  );
  // if it comes here, it means that the session verification was successful

  return res.json({
    note: "Fetch any data from your application for authenticated user after using verifySession middleware",
    userId: req.session.getUserId(),
    sessionHandle: req.session.getHandle(),
    userDataInAccessToken: req.session.getAccessTokenPayload(),
  });
}

// import { superTokensNextWrapper } from "supertokens-node/nextjs";
// import { verifySession } from "supertokens-node/recipe/session/framework/express";
// import supertokens from "supertokens-node";
// import { backendConfig } from "../../config/backendConfig";

// supertokens.init(backendConfig());

// export default async function user(req, res) {
//     await superTokensNextWrapper(
//         async (next) => {
//             return await verifySession()(req, res, next);
//         },
//         req,
//         res
//     );

//     return res.json({
//         note: "Fetch any data from your application for authenticated user after using verifySession middleware",
//         userId: req.session.getUserId(),
//         sessionHandle: req.session.getHandle(),
//         accessTokenPayload: req.session.getAccessTokenPayload(),
//     });
// }
