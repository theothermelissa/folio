"use client";

// import { Tabs, TabList, Tab, Flex, Container, Button } from "@chakra-ui/react";
// import { useAtom, useSetAtom } from "jotai";
// import { activePath, activeTabIndex } from "../atoms/nav-atoms";
import { NAVBAR_HEIGHT, NAV_LINK_INDICES } from "../constants";
import { useParams, usePathname, useRouter } from "next/navigation";
import styled from "@emotion/styled";
import React from "react";
import Link from "next/link";

const TOP_Z_INDEX = 999;

type TabProps = {
  isactive: boolean;
  children: React.ReactNode;
  key: string;
};

const Nav = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  background-color: white;
  width: 100%;
  height: ${NAVBAR_HEIGHT}px;
  align-items: flex-end;
  z-index: ${TOP_Z_INDEX};
  border-bottom: 2px solid #c4c4c4;
`;

const StyledTab = styled.div<TabProps>`
  margin: 10px 0px -2px 0px;
  padding: 0px 10px 9px 10px;
  border-bottom: ${(props) =>
    props.isactive ? "2px solid firebrick" : "2px solid #C4C4C4"};
  color: ${(props) => (props.isactive ? "firebrick" : "black")};
`;

// TODO mpm: rewrite this to use Chakra color theme
// TODO mpm: ... er, define color theme 🤦🏻‍♀️
export const NavBar = () => {
  const pathname = usePathname();
  const params = useParams();

  //   console.log("pathname: ", pathname);

  return (
    <Nav as="header">
      {" "}
      {/* <TabList style={{ width: "100%", justifyContent: "center" }}> */}
      {NAV_LINK_INDICES.map(({ path, name }) => (
        <Link href={path} key={path}>
          <StyledTab isactive={path === pathname} key={path}>
            {name}
          </StyledTab>
        </Link>
      ))}
      {/* </TabList> */}
    </Nav>
  );
};
