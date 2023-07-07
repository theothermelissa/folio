"use client";

import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { NavBar } from "../components/navbar";
import { GetStaticPropsContext } from "next/types";
import { useHydrateAtoms } from "jotai/utils";
import { useAtom } from "jotai";
import { currentFeedAtom } from "../atoms/atoms";

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
