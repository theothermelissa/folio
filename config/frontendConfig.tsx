import Passwordless from "supertokens-auth-react/recipe/passwordless";
import SessionReact from "supertokens-auth-react/recipe/session";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
import { appInfo } from "./appInfo";
import Router from "next/router";

// const { NEXT_PUBLIC_BASE_URL_PATH } = process.env;

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      Passwordless.init({
        contactMethod: "EMAIL_OR_PHONE",
        getRedirectionURL: async (context) => {
          if (context.action === "SUCCESS") {
            console.log("Successfully logged in");
            if (context.redirectToPath !== undefined) {
              console.log("redirectToPath: ", context.redirectToPath);
              // we are navigating back to where the user was before they authenticated
              return context.redirectToPath;
            }
            console.log("no redirectToPath, going to admin");
            return "/admin";
          }
          return undefined;
        },
      }),
      SessionReact.init(),
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
