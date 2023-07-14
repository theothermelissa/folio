import Protected from "../components/protected-page";

import ServerSession from "supertokens-node/recipe/session";
import supertokensNode from "supertokens-node";
import backendConfig from "../config/backendConfig";
import { signOut } from "supertokens-auth-react/recipe/passwordless";
import PageLayout from "../layouts/page-layout";
import { Button, Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { NAVBAR_HEIGHT } from "../constants";
import prisma from "../lib/prisma";
import { useEffect, useState } from "react";
import Session from "supertokens-web-js/recipe/session";
import SuperJSON from "superjson";
import {
  Section,
  SidebarSectionLink,
  allAdminSections,
} from "../components/admin-sections";
import useSWR from "swr";
import fetcher from "../lib/fetcher";
import { GetServerSidePropsContext } from "next/types";

// async function doesSessionExist() {
//   if (await Session.doesSessionExist()) {
//     console.log("user session exists");
//     return true;
//     // user is logged in
//   } else {
//     console.log("user session DOES NOT exist");
//     return false;
//     // user has not logged in yet
//   }
// }

const SIDEBAR_WIDTH = 312;

const Sidebar = styled(Flex)`
  position: fixed;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background-color: white;
  height: 100%;
  width: ${SIDEBAR_WIDTH}px;
  min-width: ${SIDEBAR_WIDTH}px;
  padding: calc(${NAVBAR_HEIGHT}px + 16px) 8px 24px 24px;
  border-right: 1px solid ghostwhite;
`;

const View = styled(Flex)`
  height: 100vh;
  width: 100vw;
  flex-flow: row nowrap;
`;

const Body = styled(Flex)`
  width: 100%;
  flex-flow: column;
  // gap: 60px;
  margin: calc(${NAVBAR_HEIGHT}px) 30px 0px calc(${SIDEBAR_WIDTH}px + 42px);
  // scroll-behavior: smooth;
  // scroll-margin-top: ${NAVBAR_HEIGHT}px;
`;

const AdminSidebar = ({ currentSection, sections }) => {
  async function onLogout() {
    await signOut();
    window.location.href = "/";
  }
  return (
    <Sidebar
    // boxShadow="md"
    >
      <Flex direction="column">
        {sections.map((section) => {
          return (
            <SidebarSectionLink
              currentSection={currentSection}
              key={section.id}
              section={section}
            />
          );
        })}
      </Flex>
      <Button width="120px" colorScheme="red" onClick={onLogout}>
        Sign Out
      </Button>
    </Sidebar>
  );
};

const AdminBody = ({ sections, onScrollIntoView }) => {
  return (
    <Body>
      {sections.map(({ id, label, subsections, component }) => (
        <Section
          onScrollIntoView={onScrollIntoView}
          key={`${id}-section`}
          id={id}
          label={label}
          isSub={false}
        >
          {subsections.length > 0
            ? subsections.map(
                ({ id: subId, label: subLabel, component: subComponent }) => (
                  <Section
                    onScrollIntoView={onScrollIntoView}
                    key={`${subId}-subsection`}
                    label={subLabel}
                    id={subId}
                    isSub
                  >
                    {subComponent}
                  </Section>
                )
              )
            : component}
        </Section>
      ))}
    </Body>
  );
};

const Admin = ({ fallbackUserData }) => {
  const [currentSection, setCurrentSection] = useState("");

  // useEffect(() => {
  //   const session = doesSessionExist();
  //   if (!session) {
  //     console.log("no session exists");
  //   }
  //   console.log("session: ", session);
  // });

  const { data: userData } = useSWR(
    `/api/users/${fallbackUserData.id}`,
    fetcher,
    {
      fallbackData: fallbackUserData,
      refreshInterval: 5000,
    }
  );
  // console.log("userData in Admin Index: ", userData);
  const { id } = userData;
  const { data: postsData } = useSWR(`/api/users/${id}/posts`, fetcher, {
    fallbackData: fallbackUserData.posts,
    refreshInterval: 5000,
  });
  const { data: feedsData } = useSWR(`/api/users/${id}/feeds`, fetcher, {
    fallbackData: fallbackUserData.posts,
    refreshInterval: 5000,
  });
  // console.log(
  //  "fallbackUserData.posts in Admin Index: ",
  //   fallbackUserData.posts
  // );
  // console.log("postsData in Admin Index: ", postsData);
  // const { data: feedsData } = useSWR(
  //   "/api/user",
  //   () => fetcher(`/api/users/${fallbackUserData.id}`, fetcherConfig),
  //   {
  //     fallbackData: fallbackUserData,
  //     refreshInterval: 5000,
  //   }
  // );

  const fetcherConfig = {
    method: "GET",
  };

  const onDeletePost = async (id: number) => {
    // console.log("deleting post: ", id);
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    // mutate(`/api/users/${authorId}`, { data });
  };
  if (!userData || !fallbackUserData) return <div>Loading...</div>;

  const onScrollIntoView = (id: string) => {
    const baseId = id.replace("-section", "");
    setCurrentSection(baseId);
  };

  return (
    <View>
      <AdminSidebar
        sections={allAdminSections({ userData, postsData, feedsData })}
        currentSection={currentSection}
      />
      <AdminBody
        sections={allAdminSections({ userData, postsData, feedsData })}
        onScrollIntoView={onScrollIntoView}
      />
    </View>
  );
};

Admin.getLayout = function getLayout(page: React.ReactElement) {
  if (process.env.NODE_ENV === "development") {
    return <PageLayout>{page}</PageLayout>;
  }
  return (
    <PageLayout>
      <Protected>{page}</Protected>
    </PageLayout>
  );
};

export default Admin;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // console.log("calling serverSideProps");
  const protocol = process.env.NEXT_PUBLIC_BASE_PROTOCOL;
  const urlPath = process.env.NEXT_PUBLIC_BASE_URL_PATH;
  const fullHomePath = `${protocol}${urlPath}`;

  // console.log("getting serverSideProps for admin page");

  let id = 0;
  let authId = "";
  let userId = {};

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=1800, stale-while-revalidate=86400"
  );

  // if (process.env.NODE_ENV === "production") {
  supertokensNode.init(backendConfig());

  let session: ServerSession.SessionContainer;

  try {
    session = await ServerSession.getSession(context.req, context.res, {
      overrideGlobalClaimValidators: () => {
        return [];
      },
    });
    // console.log("session inside try/catch: ", session);
  } catch (err: any) {
    console.log("error in getServerSideProps: ", err.type, " ", err.message);
    if (err.type === ServerSession.Error.TRY_REFRESH_TOKEN) {
      return { props: { fromSupertokens: "needs-refresh" } };
    } else if (err.type === ServerSession.Error.UNAUTHORISED) {
      return { props: { fromSupertokens: "needs-refresh" } };
    }
  }
  authId = session!.getUserId();
  userId = { authId: authId };
  // console.log("userId from supertokens: ", userId);
  // } else id = 1;
  // userId = { id: id };
  // console.log("userId, not logged in: ", userId);

  // const userId = 1;

  const data = await prisma.user.findUnique({
    // where: {
    //   authId: authId,
    // },
    where: {
      ...userId,
    },
    include: {
      feeds: true,
      posts: true,
      ownedFeeds: true,
      projects: true,
    },
  });
  // console.log("userData: ", SuperJSON.parse(SuperJSON.stringify(data)));
  const userData = SuperJSON.parse(SuperJSON.stringify(data));

  return {
    props: {
      fallbackUserData: userData,
    },
  };
};
