"use client";

// import { Tabs, TabList, Tab, Flex, Container, Button } from "@chakra-ui/react";
// import { useAtom, useSetAtom } from "jotai";
// import { activePath, activeTabIndex } from "../atoms/nav-atoms";
import { ADMIN_PATH, NAVBAR_HEIGHT, NAV_LINK_INDICES } from "../constants";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SettingsIcon } from "@chakra-ui/icons";
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
import { ClaimFeed } from "./admin-claim-feed";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next/types";
import { useAtom } from "jotai";
import { currentFeedAtom, isClaimedAtom, pagesAtom } from "../atoms/atoms";

const TOP_Z_INDEX = 999;

type TabProps = {
  isactive?: boolean;
  children?: React.ReactNode;
};

const Nav = styled(Flex)`
  position: fixed;
  background-color: white;
  width: 100%;
  align-items: center;
  z-index: ${TOP_Z_INDEX};
  padding: 0px 12px;
  height: ${NAVBAR_HEIGHT}px;
`;

const PageNameWrapper = styled(Flex)`
  width: 100%;
  position: absolute;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

const PageNameText = styled(Heading)`
  // height: 100%;
`;

const SettingsMenu = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  margin: 4px;
`;

const NavTabs = styled.div`
  display: flex;
  // flex: 1;
  justify-content: flex-start;
  width: 33%;
  min-width: 300px;
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

type PageLinkProps = {
  page: string;
  currentPath: string;
};

const PageLink = (props: PageLinkProps) => {
  const { page, currentPath } = props;
  const { path, name } = NAV_LINK_INDICES.find(
    (item) => item.name.toLowerCase() === page.toLowerCase()
  );

  const isActive = path === currentPath;
  return (
    <Link href={path} key={path}>
      <StyledTab isactive={isActive} key={path}>
        {name}
      </StyledTab>
    </Link>
  );
};

export const NavBar = () => {
  const [currentFeed] = useAtom(currentFeedAtom);
  const [isClaimed] = useAtom(isClaimedAtom);
  const [pages] = useAtom(pagesAtom);
  // console.log("props: ", props);
  // console.log("owner: ", owner);
  const router = useRouter();

  const { pathname } = router;
  console.log("pathname: ", pathname);

  const endPath = pathname.replace("/feed/[subdomain]", "");
  const currentPath = endPath.length > 0 ? endPath : "/";

  return (
    <Nav as="header" boxShadow="md">
      <NavTabs>
        {pages.map((page) => {
          console.log("page: ", page);
          return <PageLink page={page} currentPath={currentPath} />;
        })}
      </NavTabs>
      <PageName name={currentFeed} />
      {isClaimed ? (
        <SettingsMenu>
          <Link href={ADMIN_PATH}>
            <IconButton
              aria-label="settings"
              variant="ghost"
              icon={<SettingsIcon margin="3px" boxSize={4} color="dimgrey" />}
            />
          </Link>
        </SettingsMenu>
      ) : (
        <ClaimFeed />
      )}
    </Nav>
  );
};
