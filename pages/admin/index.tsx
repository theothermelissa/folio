import Protected from "../../components/protected-page";
import Session from "supertokens-node/recipe/session";
import supertokensNode from "supertokens-node";
import { backendConfig } from "../../config/backendConfig";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";
import PageLayout from "../../layouts/page-layout";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { NAVBAR_HEIGHT } from "../../constants";
import prisma from "../../lib/prisma";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EditIcon } from "@chakra-ui/icons";

const SIDEBAR_WIDTH = 312;

const Sidebar = styled(Flex)`
  position: fixed;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background-color: gainsboro;
  height: 100%;
  width: ${SIDEBAR_WIDTH}px;
  min-width: ${SIDEBAR_WIDTH}px;
  padding: calc(${NAVBAR_HEIGHT}px + 16px) 8px 24px 24px;
  border-right: 1px solid ghostwhite;
`;

const SidebarItem = styled(Flex)`
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
`;

const View = styled(Flex)`
  height: 100vh;
  width: 100vw;
  flex-flow: row nowrap;
`;

const LinkTarget = styled.div`
  position: relative;
  top: calc(-${NAVBAR_HEIGHT}px - 10px);
`;

const Body = styled(Flex)`
  width: 100%;
  flex-flow: column;
  // gap: 60px;
  margin: calc(${NAVBAR_HEIGHT}px) 30px 0px calc(${SIDEBAR_WIDTH}px + 42px);
  // scroll-behavior: smooth;
  // scroll-margin-top: ${NAVBAR_HEIGHT}px;
`;

const SidebarSectionLink = ({
  currentSection,
  section: { label, id, subsections },
}) => {
  const weight = (string1, string2) =>
    string1 === string2 ? "bold" : "normal";
  return (
    <SidebarItem>
      <Stack direction="column" width="100%" spacing="0px">
        <Link href={`#${id}`}>
          <Text fontSize="md" fontWeight={weight(currentSection, id)}>
            {label}
          </Text>
        </Link>
        {subsections.map(({ id, label }) => (
          <Link
            key={`${id}-section-link`}
            style={{ marginLeft: "12px" }}
            href={`#${id}`}
          >
            <Text fontSize="sm" fontWeight={weight(currentSection, id)}>
              {label}
            </Text>
          </Link>
        ))}
      </Stack>
    </SidebarItem>
  );
};

const AdminSidebar = ({ currentSection, sections }) => {
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
      <Button width="120px" colorScheme="red" onClick={() => signOut()}>
        Sign Out
      </Button>
    </Sidebar>
  );
};

const Section = ({ label, children, id, onScrollIntoView, isSub }) => {
  const sectionRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      const position = sectionRef.current.getBoundingClientRect().top.toFixed();
      // if (id === "posts-section" || id === "posts") {
      if (position < 500) {
        if (position > 35) {
          onScrollIntoView(id);
        }
      }
    };
    // };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const as = () => (isSub ? "h3" : "h2");
  const size = () => (isSub ? "xl" : "2xl");
  const style = () =>
    isSub ? { margin: "12px 0px 8px 0px" } : { margin: "50px 0px 8px 0px" };

  return (
    <>
      <LinkTarget id={id} />
      <Box width="100%" ref={sectionRef}>
        <Heading
          // as={as()}
          fontSize={size()}
          style={style()}
          color="dimgrey"
        >
          {label}
        </Heading>
        {children}
      </Box>
    </>
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

const Admin = ({ userData }) => {
  const [currentSection, setCurrentSection] = useState("");
  const { id, email, name, image, projects, posts, phone, ownedFeeds, feeds } =
    userData;

  const onScrollIntoView = (id: string) => {
    const baseId = id.replace("-section", "");
    setCurrentSection(baseId);
  };

  const onNameEditClick = async () => {
    console.log("updating name to Supercalifragilisticexpialidocious");
    const update = await fetch(`/api/account/${id}`, {
      method: "PUT",
      body: "Supercalifragilisticexpialidocious",
    });
    console.log("update result: ", update);
  };

  const sections = [
    {
      label: "Account Information",
      id: "account-information",
      subsections: [
        {
          label: "Name",
          id: "username",
          component: (
            <Box minHeight="500px">
              <Text fontSize="md">
                {name}{" "}
                <IconButton
                  aria-label="edit"
                  variant="ghost"
                  color="dimgrey"
                  icon={<EditIcon />}
                  onClick={onNameEditClick}
                />
              </Text>
            </Box>
          ),
        },
        {
          label: "Email",
          id: "email",
          component: (
            <Text minHeight="500px" fontSize="md">
              {email}
            </Text>
          ),
        },
        {
          label: "Phone",
          id: "phone",
          component: (
            <Text minHeight="500px" fontSize="md">
              {phone}
            </Text>
          ),
        },
      ],
    },
    {
      label: "Tags & Channels",
      id: "tags-and-channels",
      subsections: [],
      component: (
        <Text minHeight="500px" fontSize="md">
          Tags & Channels Component (coming ... soon ... ish.)
        </Text>
      ),
    },
    {
      label: "Feeds",
      id: "feeds",
      subsections: [
        {
          label: "Create New Feed",
          id: "create-new-feed",
          component: (
            <Text minHeight="500px" fontSize="md">
              Create New Feed component (...also coming soon)
            </Text>
          ),
        },
        {
          label: "Feeds You Own",
          id: "owned-feeds",
          component: (
            <Box minHeight="500px">
              {ownedFeeds &&
                ownedFeeds.map((feed) => (
                  <Text key={feed.subdomain} fontSize="md">
                    {feed.subdomain}
                  </Text>
                ))}
            </Box>
          ),
        },
        {
          label: "Contributing Feeds",
          id: "contributing-feeds",
          component: (
            <Box minHeight="500px">
              {feeds.length > ownedFeeds && (
                <Text fontSize="md">Yep you are a contributor.</Text>
              )}
            </Box>
          ),
        },
      ],
    },
    {
      label: "Posts",
      id: "posts",
      subsections: [],
      component: (
        <Box minHeight="500px">
          {posts.length > 0 &&
            posts.map((post) => (
              <Text key={`post-${post.id}`} fontSize="md">
                {post.id}
              </Text>
            ))}
        </Box>
      ),
    },
  ];

  return (
    <Protected>
      <View>
        <AdminSidebar sections={sections} currentSection={currentSection} />
        <AdminBody sections={sections} onScrollIntoView={onScrollIntoView} />
      </View>
    </Protected>
  );
};

Admin.getLayout = function getLayout(page: React.ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default Admin;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  supertokensNode.init(backendConfig());
  let session;
  try {
    session = await Session.getSession(context.req, context.res, {
      overrideGlobalClaimValidators: () => {
        return [];
      },
    });
  } catch (err: any) {
    if (err.type === Session.Error.TRY_REFRESH_TOKEN) {
      return { props: { fromSupertokens: "needs-refresh" } };
    } else if (err.type === Session.Error.UNAUTHORISED) {
      return { props: { fromSupertokens: "needs-refresh" } };
    }
    throw new Error(err);
  }

  const userId = session!.getUserId();
  // TODO mpm: tie supertokens userId to dbUserId

  const dbUserId = 6;

  const data = await prisma.user.findUnique({
    where: {
      id: dbUserId,
    },
    include: {
      feeds: true,
      posts: true,
      ownedFeeds: true,
      projects: true,
    },
  });
  const userData = JSON.parse(JSON.stringify(data));
  return {
    props: {
      userData: userData,
    },
  };
};
