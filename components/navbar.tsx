"use client";

// import { Tabs, TabList, Tab, Flex, Container, Button } from "@chakra-ui/react";
// import { useAtom, useSetAtom } from "jotai";
// import { activePath, activeTabIndex } from "../atoms/nav-atoms";
import { ADMIN_PATH, NAVBAR_HEIGHT, NAV_LINK_INDICES } from "../constants";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Loading from "./loading";
import { ClaimFeed } from "./claim-feed";

const TOP_Z_INDEX = 999;

type TabProps = {
  isactive: boolean;
  children: React.ReactNode;
  key: string;
};

const Nav = styled(Flex)`
  position: fixed;
  justify-content: space-between;
  background-color: white;
  width: 100%;
  height: ${NAVBAR_HEIGHT}px;
  align-items: center;
  z-index: ${TOP_Z_INDEX};
`;

const PageNameWrapper = styled(Flex)`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 0px 0px 24px;
`;

const PageNameText = styled(Heading)`
  height: 100%;
`;

const SettingsMenu = styled.div`
  display: flex;
  height: 100%;
  flex: 1;
  justify-content: flex-end;
  align-items: flex-start;
`;

const NavTabs = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const StyledTab = styled.div<TabProps>`
  margin: 10px 0px 0px 0px;
  padding: 0px 10px 9px 10px;
  border-bottom: ${(props) => (props.isactive ? "2px solid black" : "none")};
  color: ${(props) => (props.isactive ? "black" : "grey")};
  font-weight: ${(props) => (props.isactive ? "bold" : "normal")};
`;

type NameProps = { name?: string | string[] };

const PageName = (props: NameProps) => {
  const { name } = props;
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (Boolean(name)) {
      setTitle(name.toString());
      setLoaded(true);
    }
  });
  return (
    <PageNameWrapper>
      <Skeleton isLoaded={loaded}>
        <PageNameText>{title}</PageNameText>
      </Skeleton>
    </PageNameWrapper>
  );
};

// TODO mpm: rewrite this to use Chakra color theme
// TODO mpm: ... er, define color theme 🤦🏻‍♀️
export const NavBar = () => {
  const router = useRouter();

  const {
    pathname,
    query: { subdomain },
  } = router;

  const terminalPath = pathname.replace("/feed/[subdomain]", "");
  const currentPath = terminalPath.length > 0 ? terminalPath : "/";

  const handleClaimRequest = () => {
    const redirectUrl = `${window.location.origin}/api/auth/login`;
  };

  return (
    <Nav as="header" boxShadow="sm">
      <PageName name={subdomain} />
      <NavTabs>
        {NAV_LINK_INDICES.map(({ path, name }) => (
          <Link href={path} key={path}>
            <StyledTab isactive={path === currentPath} key={path}>
              {name}
            </StyledTab>
          </Link>
        ))}
      </NavTabs>
      <SettingsMenu>
        <ClaimFeed />
        {/* <Link href={ADMIN_PATH}>
          <IconButton
            aria-label="Search database"
            size="sm"
            variant="ghost"
            icon={<HamburgerIcon margin="3px" boxSize={4} color="gainsboro" />}
          />
        </Link> */}
      </SettingsMenu>
    </Nav>
  );
};
