"use client";

// import { Tabs, TabList, Tab, Flex, Container, Button } from "@chakra-ui/react";
// import { useAtom, useSetAtom } from "jotai";
// import { activePath, activeTabIndex } from "../atoms/nav-atoms";
import { NAVBAR_HEIGHT, NAV_LINK_INDICES } from "../constants";
import styled from "@emotion/styled";
import React from "react";
import Link from "next/link";
import { SettingsIcon } from "@chakra-ui/icons";
import { Heading, IconButton, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

const TOP_Z_INDEX = 999;

type TabProps = {
  isactive: boolean;
  children: React.ReactNode;
  key: string;
};

const Nav = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  background-color: white;
  border-bottom: 2px solid whitesmoke;
  width: 100%;
  height: ${NAVBAR_HEIGHT}px;
  align-items: flex-end;
  z-index: ${TOP_Z_INDEX};
`;

const PageName = styled(Heading)`
  display: flex;
  flex: 1;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  padding: 24px 5px 5px 30px;
`;

const SettingsMenu = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  margin: 5px;
`;

const NavTabs = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const StyledTab = styled.div<TabProps>`
  margin: 10px 0px -2px 0px;
  padding: 0px 10px 9px 10px;
  border-bottom: ${(props) =>
    props.isactive ? "2px solid black" : "2px solid whitesmoke"};
  color: ${(props) => (props.isactive ? "black" : "grey")};
  // font-weight: ${(props) => (props.isactive ? "bold" : "normal")};
  font-weight: bold;
`;

// TODO mpm: rewrite this to use Chakra color theme
// TODO mpm: ... er, define color theme 🤦🏻‍♀️
export const NavBar = () => {
  const router = useRouter();

  const {
    pathname,
    query: { subdomain },
  } = router;

  const terminalPath = pathname.replace("/feed/[subdomain]", "");
  console.log("terminalPath: ", terminalPath);

  return (
    <Nav as="header">
      <PageName fontSize="2xl">{subdomain}</PageName>
      <NavTabs>
        {NAV_LINK_INDICES.map(({ path, name }) => (
          <Link href={path} key={path}>
            <StyledTab isactive={path === terminalPath} key={path}>
              {name}
            </StyledTab>
          </Link>
        ))}
      </NavTabs>
      <SettingsMenu>
        <IconButton
          aria-label="Search database"
          size="sm"
          variant="ghost"
          icon={<SettingsIcon boxSize={4} color="gainsboro" />}
        />
      </SettingsMenu>
    </Nav>
  );
};
