"use client";

import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { NavBar } from "../components/navbar";

const View = styled(Flex)`
  flex-direction: column;
  align-items: center;
  width: 100vw;
`;

const PageLayout = ({ children }) => {
  return (
    <View>
      <NavBar />
      {children}
    </View>
  );
};

export default PageLayout;
