import "../styles/globals.css";
import React from "react";
import SuperTokensWebJs from "supertokens-web-js";
import { ChakraProvider } from "@chakra-ui/react";
// TODO mpm: look @ CacheProvider from chakra next.js -- do you need it?
import theme from "../styles/theme";
import { NextPageWithLayout } from "../types";
import { frontendConfig } from "../config/frontendConfig";

if (typeof window !== "undefined") {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensWebJs.init(frontendConfig());
}

function MyApp({ Component, pageProps }): JSX.Element {
  // from supertokens docs

  const getLayout = Component.getLayout ?? ((page: NextPageWithLayout) => page);

  return (
    <ChakraProvider theme={theme}>
      {getLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  );
}

export default MyApp;
