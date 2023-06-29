import "../styles/globals.css";
import React from "react";
import { useEffect } from "react";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
import * as SuperTokensConfig from "../config/frontendConfig";
import Session from "supertokens-auth-react/recipe/session";
import { ChakraProvider } from "@chakra-ui/react";
// TODO mpm: look @ CacheProvider from chakra next.js -- do you need it?

import theme from "../styles/theme";
import { NextPageWithLayout } from "../types";

if (typeof window !== "undefined") {
  SuperTokensReact.init(SuperTokensConfig.frontendConfig());
}

function MyApp({ Component, pageProps }): JSX.Element {
  // from supertokens docs
  useEffect(() => {
    async function doRefresh() {
      if (pageProps.fromSupertokens === "needs-refresh") {
        console.log("needs refresh");
        if (await Session.attemptRefreshingSession()) {
          location.reload();
        } else {
          // user has been logged out
          SuperTokensReact.redirectToAuth();
        }
      }
    }
    doRefresh();
  }, [pageProps.fromSupertokens]);
  if (pageProps.fromSupertokens === "needs-refresh") {
    console.log("needs refresh");
    return null;
  }

  const getLayout = Component.getLayout ?? ((page: NextPageWithLayout) => page);

  return (
    <SuperTokensWrapper>
      <ChakraProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
    </SuperTokensWrapper>
  );
}

export default MyApp;
