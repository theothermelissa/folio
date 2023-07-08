import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { NAVBAR_HEIGHT } from "../constants";
import phone from "../pages/api/account/phone";
import feeds from "../pages/api/feeds";
import posts from "../pages/api/posts";
import { EditAccountValue } from "./EditAccountValue";
import AdminPosts from "./admin-post-list";
import { Feed, Post, User } from "../types";
import AdminPostList from "./admin-post-list";

type UserData = {
  id: number;
  email: string;
  name: string;
  image: string;
  // TODO: fix this
  projects: string[];
  posts: Post[];
  phone: string;
  ownedFeeds: Feed[];
  feeds: Feed[];
};

const SidebarItem = styled(Flex)`
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
`;

const LinkTarget = styled.div`
  position: relative;
  top: calc(-${NAVBAR_HEIGHT}px - 10px);
`;

type AdminSectionProps = {
  userData: UserData;
  postsData: Post[];
  feedsData: Feed[];
};

export const allAdminSections = (props: AdminSectionProps) => {
  const { id, email, name, image, projects, phone } = props.userData;
  const posts = props.postsData;
  const feeds = props.feedsData;
  return [
    {
      label: "Account Information",
      id: "account-information",
      subsections: [
        {
          label: "Your Name",
          id: "username",
          component: (
            <EditAccountValue
              userId={id}
              keyToUpdate={"name"}
              currentValue={name || ""}
            />
          ),
        },
        {
          label: "Your Email",
          id: "email",
          component: (
            <EditAccountValue
              userId={id}
              keyToUpdate={"email"}
              currentValue={email || ""}
            />
          ),
        },
        // TODO: disable phone number edit until user has verified email
        {
          label: "Phone",
          id: "phone",
          component: (
            <EditAccountValue
              userId={id}
              keyToUpdate={"phone"}
              currentValue={phone || ""}
            />
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
      label: "Posts",
      id: "posts",
      subsections: [],
      component: <AdminPostList fallbackPosts={posts} userId={id} />,
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
          label: "Your Feeds",
          id: "feeds",
          component: (
            <Box minHeight="500px">
              {feeds &&
                feeds.map((feed) => (
                  <Text key={feed.subdomain} fontSize="md">
                    {feed.subdomain}
                  </Text>
                ))}
            </Box>
          ),
        },
      ],
    },
  ];
};

export const SidebarSectionLink = ({
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

export const Section = ({ label, children, id, onScrollIntoView, isSub }) => {
  const sectionRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      const position = sectionRef.current.getBoundingClientRect().top.toFixed();
      if (position < 65) {
        if (position > 50) {
          console.log(id, " position: ", position);
          onScrollIntoView(id);
        }
      }
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const as = () => (isSub ? "h3" : "h2");
  const size = () => (isSub ? "xl" : "2xl");
  const style = () =>
    isSub
      ? { margin: "12px 0px 8px 0px" }
      : { margin: "50px 0px 8px 0px", color: "black" };

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
