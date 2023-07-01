"use client";

import { Flex } from "@chakra-ui/react";
import { NAVBAR_HEIGHT } from "../constants";
import styled from "@emotion/styled";
import PageLayout from "./page-layout";

const View = styled(Flex)`
  flex-direction: column;
  align-items: center;
  margin-top: calc(${NAVBAR_HEIGHT}px);
`;

const PostLayout = ({ children }) => {
  return (
    <PageLayout>
      <View>{children}</View>
    </PageLayout>
  );
};

export default PostLayout;
