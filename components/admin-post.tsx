import styled from "@emotion/styled";
import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Post } from "../types";
import Tiptap from "./Tiptap";
import { CldImage } from "next-cloudinary";
import useSWR, { useSWRConfig } from "swr";
import fetcher from "../lib/fetcher";

type AdminPostProps = {
  userId: number;
  fallbackPost: Post;
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

const ImagePreview = styled(CldImage)`
  height: auto;
  width: 60px;
  min-width: 60px;
  // object-fit: cover;
`;

const Content = styled(Flex)`
  height: 100%;
  align-items: flex-end;
`;

const AdminPost = (props: AdminPostProps) => {
  const {
    // userId,
    fallbackPost,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate } = useSWRConfig();

  const { data, isLoading } = useSWR(`/api/posts/${fallbackPost.id}`, fetcher, {
    fallbackData: fallbackPost,
  });

  if (isLoading || !data) {
    return null;
  }

  const { title, id: postId, content, media, authorId } = data;

  const handleDelete = (e: React.SyntheticEvent) => {
    e.preventDefault();
    fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });
    mutate(
      `/api/posts/${postId}`
      // {
      //   // optimisticData: (posts: Post[]) => ({
      //   //   ...posts.filter((post: Post) => post.id !== id),
      //   // }),
      //   optimisticData: (posts: Post[]) => {
      //     const newPosts = posts.filter((post: Post) => post.id !== id);
      //     return newPosts;
      //   },
      //   revalidate: false,
      //   // optimisticData: (posts) => {
      //   //   posts.filter((post) => post.id !== id);
      //   // },
      //   rollbackOnError: true,
      // }
    );
  };

  //   const [editing, setEditing] = useState(false);
  const trimmedTitle = Boolean(title)
    ? title.length < 20
      ? title
      : title.slice(0, 20) + "..."
    : "Untitled";
  const trimmedContent =
    content.length < 145 ? content : content.slice(0, 144) + "...";

  // console.log("userId: ", userId);

  return (
    <PreviewContainer>
      <Preview key={postId}>
        {media.length > 0 && (
          <ImagePreview
            alt="Post image"
            src={media[0]}
            width={60}
            height={60}
          />
        )}
        <Flex direction="column">
          <Text as="h2" fontSize="md" fontWeight="bold">
            {trimmedTitle}
          </Text>
          <Content>
            <Text fontSize="sm" noOfLines={1}>
              {trimmedContent}
            </Text>
          </Content>
        </Flex>
      </Preview>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tiptap />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ButtonGroup size="sm" variant="outline">
        <Button leftIcon={<EditIcon />} color="dimgrey" onClick={onOpen}>
          Edit Title
        </Button>
        <Button leftIcon={<EditIcon />} color="dimgrey" onClick={onOpen}>
          Edit Content
        </Button>
        <Button
          isDisabled
          leftIcon={<EditIcon />}
          color="dimgrey"
          onClick={onOpen}
        >
          Edit Images
        </Button>
        <Button
          leftIcon={<DeleteIcon />}
          colorScheme="red"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </ButtonGroup>
    </PreviewContainer>
  );
};

export default AdminPost;
