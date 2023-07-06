import "../styles/globals.css";
import React from "react";
// import SuperTokensWebJs from "supertokens-web-js";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
// import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";

import { ChakraProvider } from "@chakra-ui/react";
// TODO mpm: look @ CacheProvider from chakra next.js -- do you need it?
import theme from "../styles/theme";
import { NextPageWithLayout } from "../types";
import { frontendConfig } from "../config/frontendConfig";

if (typeof window !== "undefined") {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig());
}

function MyApp({ Component, pageProps }): JSX.Element {
  // from supertokens docs

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
