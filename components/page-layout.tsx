"use client";

import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { NAVBAR_HEIGHT } from "../constants";

type LayoutProps = {
  children: React.ReactNode;
};

const View = styled(Flex)`
  flex-direction: column;
  align-items: center;
  // height: 100vh;
  width: 100vw;
`;

const Page = (props: LayoutProps) => {
  const { children } = props;
  return <View>{children}</View>;
};

export default Page;
