import PasswordlessNode from "supertokens-node/recipe/passwordless";
import SessionNode from "supertokens-node/recipe/session";
import { appInfo } from "./appInfo";
import { TypeInput } from "supertokens-node/types";
import { SupertokensService } from "supertokens-node/recipe/passwordless/smsdelivery";
import { getUserFromSubdomain } from "../lib/userFromSubdomain";
import Dashboard from "supertokens-node/recipe/dashboard";
import Session from "supertokens-node/recipe/session";

const { SUPERTOKENS_URI, SUPERTOKENS_API_KEY, SUPERTOKENS_SMS_API_KEY } =
  process.env;

export const backendConfig = (): TypeInput => {
  return {
    framework: "express",
    supertokens: {
      // These are the connection details of the app you created on supertokens.com
      connectionURI: SUPERTOKENS_URI,
      apiKey: SUPERTOKENS_API_KEY,
    },
    appInfo,
    recipeList: [
      PasswordlessNode.init({
        flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
        contactMethod: "EMAIL_OR_PHONE",
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              createCodePOST: async function (input) {
                if (originalImplementation.createCodePOST === undefined) {
                  throw new Error("Should never come here");
                }
                console.log("first, calling createCodePOST");
                return originalImplementation.createCodePOST(input);
              },
              consumeCodePOST: async function (input) {
                console.log("next, calling customCodePOST");
                if (originalImplementation.consumeCodePOST === undefined) {
                  throw new Error("Should never come here");
                }

                // we should already have a session here since this is called
                // after phone password login
                // let session = await SessionNode.getSession(
                //   input.options.req,
                //   input.options.res,
                //   {
                //     overrideGlobalClaimValidators: () => [],
                //   }
                // );
                // if (session === undefined) {
                //   throw new Error("Should never come here");
                // }

                // we add the session to the user context so that the createNewSession
                // function doesn't create a new session
                // input.userContext.session = session;
                let resp = await originalImplementation.consumeCodePOST(input);

                if (resp.status === "OK") {
                  console.log("resp: ", resp);
                  const { user } = resp;
                  const updateUser = await prisma.user.update({
                    where: {
                      phone: user.phoneNumber,
                    },
                    data: {
                      authId: user.id,
                    },
                  });
                  console.log("updateUser:", updateUser);
                  return resp;
                  // OTP verification was successful.
                  //TODO: save the user's authId to their User record
                }

                return resp;
              },
            };
          },
        },
        smsDelivery: {
          service: new SupertokensService(SUPERTOKENS_SMS_API_KEY),
          // override: (originalImplementation) => {
          //   return {
          //     ...originalImplementation,
          //     sendSms: ({ ...args }) => {
          //       const newArgs = { ...args, phoneNumber: "+14056403957" };
          //       console.log("calling custom sendSms with newArgs: ", newArgs);
          //       return originalImplementation.sendSms(newArgs);
          //       // NOTE: we are passing the subdomain here as "phoneNumber"
          //       // and converting it in the getUserFromSubdomain function
          //       // console.log("originalImplementation: ", originalImplementation);
          //       // const ownerPhone = getUserFromSubdomain(args.phoneNumber).then(
          //       //   (phone) => {
          //       //     const newArgs = { ...args, phoneNumber: "+14056403957" };
          //       //     console.log(
          //       //       "calling custom sendSms with newArgs: ",
          //       //       newArgs
          //       //     );
          //       //     return originalImplementation.sendSms(newArgs);
          //       //   }
          //       // );
          //       // return ownerPhone;
          //       // const phoneNumber = { phoneNumber: "+14056403957" };
          //     },
          //     // sendSms: async function ({
          //     //   codeLifetime, // amount of time the code is alive for (in MS)
          //     //   phoneNumber,
          //     //   urlWithLinkCode, // magic link
          //     //   userInputCode, // OTP
          //     // }) {
          //     //   // TODO: create and send SMS
          //     // },
          //   };
          // },
        },
      }),
      SessionNode.init(),
      Dashboard.init(),
    ],
    isInServerlessEnv: true,
  };
};

// import PasswordlessNode from "supertokens-node/recipe/passwordless";
// import SessionNode from "supertokens-node/recipe/session";
// import Dashboard from "supertokens-node/recipe/dashboard";
// import { appInfo } from "./appInfo";
// import { AuthConfig } from "../interfaces";
// import Session from "supertokens-node/recipe/session";
// import { SupertokensService } from "supertokens-node/recipe/passwordless/smsdelivery";

// const { SUPERTOKENS_URI, SUPERTOKENS_API_KEY, SUPERTOKENS_SMS_API_KEY } =
//   process.env;

// export let backendConfig = (): AuthConfig => {
//   return {
//     framework: "express",
//     supertokens: {
//       // this is the location of the SuperTokens core.
//       connectionURI: SUPERTOKENS_URI,
//       apiKey: SUPERTOKENS_API_KEY,
//     },
//     appInfo,
//     // recipeList contains all the modules that you want to
//     // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
//     recipeList: [
//       PasswordlessNode.init({
//         contactMethod: "EMAIL_OR_PHONE",
//         flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
//         smsDelivery: {
//           service: new SupertokensService(SUPERTOKENS_SMS_API_KEY),
//         },
//       }),
//       Session.init({
//         // getTokenTransferMethod: () => "header",
//         // cookieDomain: ".example.com",
//       }),
//       Dashboard.init(),
//     ],
//     isInServerlessEnv: true,
//   };
// };
