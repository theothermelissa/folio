import "../styles/globals.css";
import React from "react";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";

import { ChakraProvider } from "@chakra-ui/react";
// TODO mpm: look @ CacheProvider from chakra next.js -- do you need it?
import theme from "../styles/theme";
import { NextPageWithLayout } from "../types";
import { frontendConfig } from "../config/frontendConfig";
import { Provider } from "jotai";

if (typeof window !== "undefined") {
  SuperTokensReact.init(frontendConfig());
}

function MyApp({ Component, pageProps }): JSX.Element {
  const getLayout = Component.getLayout ?? ((page: NextPageWithLayout) => page);

  return (
    <SuperTokensWrapper>
      <Provider>
        <ChakraProvider theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </Provider>
    </SuperTokensWrapper>
  );
}

export default MyApp;
