import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { middleware } from "supertokens-node/framework/express";
import { NextApiRequest, NextApiResponse } from "next";
import { Request, Response } from "express";
import supertokens from "supertokens-node";
import { backendConfig } from "../../../config/backendConfig";
import NextCors from "nextjs-cors";

supertokens.init(backendConfig());

export default async function superTokens(
  req: NextApiRequest & Request,
  res: NextApiResponse & Response
) {
  // NOTE: We need CORS only if we are querying the APIs from a different origin
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: /.localhost:3000$/,
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

// import { superTokensNextWrapper } from "supertokens-node/nextjs";
// import { middleware } from "supertokens-node/framework/express";
// import { NextApiRequest, NextApiResponse } from "next";
// import { Request, Response } from "express";
// import supertokens from "supertokens-node";
// import { backendConfig } from "../../../config/backendConfig";
// import NextCors from "nextjs-cors";

// supertokens.init(backendConfig());

// export default async function superTokens(
//   req: NextApiRequest & Request,
//   res: NextApiResponse & Response
// ) {
//   // NOTE: We need CORS only if we are querying the APIs from a different origin
//   await NextCors(req, res, {
//     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
//     origin: /.localhost:3000$/,
//     // origin: "/example\.com$/",
//     credentials: true,
//     allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
//   });

//   await superTokensNextWrapper(
//     async (next) => {
//       // This is needed for production deployments with Vercel
//       res.setHeader(
//         "Cache-Control",
//         "no-cache, no-store, max-age=0, must-revalidate"
//       );
//       await middleware()(req, res, next);
//     },
//     req,
//     res
//   );
//   if (!res.writableEnded) {
//     res.status(404).send("Not found");
//   }
// }

// // import { superTokensNextWrapper } from "supertokens-node/nextjs";
// // import { middleware } from "supertokens-node/framework/express";
// // import { NextApiRequest, NextApiResponse } from "next";
// // import { Request, Response } from "express";
// // import supertokens from "supertokens-node";
// // import { backendConfig } from "../../../config/backendConfig";
// // import NextCors from "nextjs-cors";

// // supertokens.init(backendConfig());

// // export default async function superTokens(
// //   req: NextApiRequest & Request,
// //   res: NextApiResponse & Response
// // ) {
// //   // NOTE: We need CORS only if we are querying the APIs from a different origin
// //   await NextCors(req, res, {
// //     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
// //     origin: "http://localhost:3000",
// //     credentials: true,
// //     allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
// //   });

// //   await superTokensNextWrapper(
// //     async (next) => {
// //       // This is needed for production deployments with Vercel
// //       res.setHeader(
// //         "Cache-Control",
// //         "no-cache, no-store, max-age=0, must-revalidate"
// //       );
// //       await middleware()(req, res, next);
// //     },
// //     req,
// //     res
// //   );
// //   if (!res.writableEnded) {
// //     res.status(404).send("Not found");
// //   }
// // }

// // // // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// // // import { superTokensNextWrapper } from "supertokens-node/nextjs";
// // // import supertokens from "supertokens-node";
// // // import { middleware } from "supertokens-node/framework/express";
// // // import { backendConfig } from "../../../config/backendConfig";

// // // supertokens.init(backendConfig());

// // // export default async function superTokens(req, res) {
// // //   await superTokensNextWrapper(
// // //     async (next) => {
// // //       res.setHeader(
// // //         "Cache-Control",
// // //         "no-cache, no-store, max-age=0, must-revalidate"
// // //       );
// // //       await middleware()(req, res, next);
// // //     },
// // //     req,
// // //     res
// // //   );
// // //   if (!res.writableEnded) {
// // //     res.status(404).send("Not found");
// // //   }
// // // }
