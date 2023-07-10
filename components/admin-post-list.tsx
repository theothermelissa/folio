import styled from "@emotion/styled";
import { Flex } from "@chakra-ui/react";
import AdminPost from "./admin-post";
import { Post } from "../types";
import useSWR from "swr";
import fetcher from "../lib/fetcher";

type AdminAllPostsProps = {
  userId: number;
  fallbackPosts: Post[];
};

const Section = styled(Flex)`
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const PreviewContainer = styled(Flex)`
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

const Preview = styled(Flex)`
  background-color: white;
  width: 40%;
  height: 80px;
  padding: 8px;
  gap: 8px;
`;

const Image = styled.div`
  background-color: gainsboro;
  height: 100%;
  width: 60px;
`;

const Content = styled(Flex)`
  height: 100%;
  align-items: flex-end;
`;

const onEditClick = () => {
  console.log("edit clicked");
};

const AdminPostList = (props: AdminAllPostsProps) => {
  const { fallbackPosts, userId } = props;
  const { data: posts } = useSWR(`/api/users/${userId}/posts`, fetcher, {
    fallbackData: fallbackPosts,
    refreshInterval: 5000,
    keepPreviousData: true,
  });

  const hasPosts =
    (posts && posts.length > 0) || (fallbackPosts && fallbackPosts.length > 0);

  // console.log("userId: ", userId);

  return (
    <Section>
      {hasPosts &&
        posts.map((post) => (
          <AdminPost key={post.id} userId={userId} fallbackPost={post} />
        ))}
    </Section>
  );
};

export default AdminPostList;
