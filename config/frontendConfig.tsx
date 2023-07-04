import PasswordlessWebJs from "supertokens-web-js/recipe/passwordless";
import Session from "supertokens-web-js/recipe/session";
import { appInfo } from "./appInfo";

// const { NEXT_PUBLIC_BASE_URL_PATH } = process.env;

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      Session.init({
        sessionTokenFrontendDomain: ".localhost:3000",
      }),
      PasswordlessWebJs.init(),
    ],
  };
};

// import PasswordlessReact from "supertokens-auth-react/recipe/passwordless";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
// import { appInfo } from "./appInfo";
// import Router from "next/router";
// import Session from "supertokens-auth-react/recipe/session";

// // const { NEXT_PUBLIC_BASE_URL_PATH } = process.env;

// const NEXT_PUBLIC_BASE_URL_PATH = "localhost:3000";

// export let frontendConfig = () => {
//   return {
//     appInfo,
//     // recipeList contains all the modules that you want to
//     // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
//     recipeList: [
//       PasswordlessReact.init({
//         contactMethod: "EMAIL_OR_PHONE",
//         getRedirectionURL: async (context) => {
//           if (context.action === "SUCCESS") {
//             console.log("Successfully logged in");
//             if (context.redirectToPath !== undefined) {
//               console.log("redirectToPath: ", context.redirectToPath);
//               // we are navigating back to where the user was before they authenticated
//               return context.redirectToPath;
//             }
//             console.log("no redirectToPath, going to admin");
//             return "/admin";
//           }
//           return undefined;
//         },
//       }),
//       Session.init({
//         // tokenTransferMethod: "header",
//         sessionTokenFrontendDomain: `.${NEXT_PUBLIC_BASE_URL_PATH}`,
//       }),
//     ],
//     // this is so that the SDK uses the next router for navigation
//     windowHandler: (oI) => {
//       return {
//         ...oI,
//         location: {
//           ...oI.location,
//           setHref: (href) => {
//             Router.push(href);
//           },
//         },
//       };
//     },
//   };
// };

export const recipeDetails = {
  docsLink: "https://supertokens.com/docs/passwordless/introduction",
};

export const PreBuiltUIList = [PasswordlessPreBuiltUI];
