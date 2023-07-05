import styled from "@emotion/styled";
import { Post } from "../../types";
import { Button, ButtonGroup, Flex, IconButton, Text } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import AdminPost from "./admin-post";

type AdminAllPostsProps = {
  userId: number;
  posts: Post[];
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

const AdminPosts = (props: AdminAllPostsProps) => {
  const { posts, userId } = props;
  console.log("userId: ", userId);
  return (
    <Section>
      {posts.map((post) => (
        <AdminPost key={post.id} userId={userId} post={post} />
      ))}
    </Section>
  );
};

export default AdminPosts;
