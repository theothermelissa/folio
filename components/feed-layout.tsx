"use client";

import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Page from "./page-layout";
import { NavBar } from "./navbar";
import { NAVBAR_HEIGHT } from "../constants";

export const dynamicParams = true;

type LayoutProps = {
  children: React.ReactNode;
};

const View = styled(Flex)`
  height: 100%;
  width: 100%;
  margin-top: calc(${NAVBAR_HEIGHT}px + 40px);
`;

const FeedLayout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <Page>
      <NavBar />
      <View>{children}</View>
    </Page>
  );
};

export default FeedLayout;
