import PasswordlessNode from "supertokens-node/recipe/passwordless";
import SessionNode from "supertokens-node/recipe/session";
import { appInfo } from "./appInfo";
import { TypeInput } from "supertokens-node/types";
import { SupertokensService } from "supertokens-node/recipe/passwordless/smsdelivery";
import Dashboard from "supertokens-node/recipe/dashboard";
import prisma from "../lib/prisma";

const {
  SUPERTOKENS_URI,
  SUPERTOKENS_API_KEY,
  SUPERTOKENS_SMS_API_KEY,
  NEXT_PUBLIC_BASE_URL_PATH,
} = process.env;

export const backendConfig = (): TypeInput => {
  return {
    framework: "express",
    supertokens: {
      connectionURI: SUPERTOKENS_URI,
      apiKey: SUPERTOKENS_API_KEY,
    },
    appInfo,
    recipeList: [
      PasswordlessNode.init({
        flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
        contactMethod: "EMAIL_OR_PHONE",
        // override: {
        //   apis: (originalImplementation) => {
        //     return {
        //       ...originalImplementation,
        //       createCodePOST: async function (input) {
        //         if (originalImplementation.createCodePOST === undefined) {
        //           throw new Error("Should never come here");
        //         }
        //         console.log("first, calling createCodePOST");
        //         return originalImplementation.createCodePOST(input);
        //       },
        //       consumeCodePOST: async function (input) {
        //         console.log("next, calling customCodePOST");
        //         if (originalImplementation.consumeCodePOST === undefined) {
        //           throw new Error("Should never come here");
        //         }
        //         let resp = await originalImplementation.consumeCodePOST(input);
        //         // add the successfully logged in user's authId to their user record
        //         if (resp.status === "OK") {
        //           console.log("resp: ", resp);
        //           const { user } = resp;
        //           await prisma.user.update({
        //             where: {
        //               phone: user.phoneNumber,
        //             },
        //             data: {
        //               authId: user.id,
        //             },
        //           });
        //         }
        //         return resp;
        //       },
        //     };
        //   },
        // },
        smsDelivery: {
          service: new SupertokensService(SUPERTOKENS_SMS_API_KEY),
        },
      }),
      SessionNode.init({
        //>>> okay not to set
        // cookieDomain: `.${NEXT_PUBLIC_BASE_URL_PATH}`,
      }),
      Dashboard.init(),
    ],
    isInServerlessEnv: true,
  };
};
