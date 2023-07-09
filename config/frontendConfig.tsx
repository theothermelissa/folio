import Passwordless from "supertokens-auth-react/recipe/passwordless";
// import PasswordlessWebJs from "supertokens-web-js/recipe/passwordless";
// import SessionWebJs from "supertokens-web-js/recipe/session";
import SessionReact from "supertokens-auth-react/recipe/session";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
import { appInfo } from "./appInfo";
import Router from "next/router";

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      Passwordless.init({
        contactMethod: "EMAIL_OR_PHONE",
        getRedirectionURL: async (context) => {
          if (context.action === "SUCCESS") {
            // console.log("Successfully logged in");
            if (context.redirectToPath !== undefined) {
              // console.log("redirectToPath: ", context.redirectToPath);
              // we are navigating back to where the user was before they authenticated
              return context.redirectToPath;
            }
            // console.log("no redirectToPath, going to admin");
            return "/admin";
          }
          return undefined;
        },
      }),
      SessionReact.init({
        sessionTokenFrontendDomain: `.folio.pics`,
        // sessionTokenBackendDomain: `${NEXT_PUBLIC_BASE_URL_PATH}`,
      }),
      // SessionWebJs.init({
      //   // sessionTokenFrontendDomain: `.${NEXT_PUBLIC_BASE_URL_PATH}`,
      //   sessionTokenFrontendDomain: `.folio.pics`,
      // }),
    ],
    windowHandler: (oI) => {
      return {
        ...oI,
        location: {
          ...oI.location,
          setHref: (href) => {
            Router.push(href);
          },
        },
      };
    },
  };
};

export const recipeDetails = {
  docsLink: "https://supertokens.com/docs/passwordless/introduction",
};

export const PreBuiltUIList = [PasswordlessPreBuiltUI];
