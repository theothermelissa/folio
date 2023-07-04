"use client";

import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { NAVBAR_HEIGHT } from "../constants";
import PageLayout from "./page-layout";

const View = styled(Flex)`
  height: 100%;
  width: 100%;
  margin-top: calc(${NAVBAR_HEIGHT}px + 10px);
`;

const FeedLayout = ({ children }) => {
  return (
    <PageLayout>
      <View>{children}</View>
    </PageLayout>
  );
};

export default FeedLayout;
