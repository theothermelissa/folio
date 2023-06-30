import PasswordlessNode from "supertokens-node/recipe/passwordless";
import SessionNode from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import { appInfo } from "./appInfo";
import { AuthConfig } from "../interfaces";
import Session from "supertokens-node/recipe/session";

const { SUPERTOKENS_URI, SUPERTOKENS_API_KEY, NEXT_PUBLIC_BASE_URL_PATH } =
  process.env;

export let backendConfig = (): AuthConfig => {
  return {
    framework: "express",
    supertokens: {
      // this is the location of the SuperTokens core.
      connectionURI: SUPERTOKENS_URI,
      apiKey: SUPERTOKENS_API_KEY,
    },
    appInfo,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
      PasswordlessNode.init({
        contactMethod: "EMAIL_OR_PHONE",
        flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
      }),
      Session.init({
        // getTokenTransferMethod: () => "header",
        // cookieDomain: ".example.com",
      }),
      Dashboard.init(),
    ],
    isInServerlessEnv: true,
  };
};
