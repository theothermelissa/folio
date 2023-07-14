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
import { FormEvent, useState } from "react";
import { Post } from "../types";
import Tiptap from "./Tiptap";
import { CldImage } from "next-cloudinary";
import useSWR, { useSWRConfig } from "swr";
import fetcher from "../lib/fetcher";
import AdminEditPost from "./admin-edit-post";
import { useAtom } from "jotai";
import { adminPostHoveredAtom } from "../atoms/atoms";

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
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  gap: 4px;
`;

const Preview = styled(Flex)`
  background-color: white;
  width: 50%;
  height: 90px;
  // padding: 8px;
  gap: 8px;
  border-radius: 8px;
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
  const [hovered, setHovered] = useAtom(adminPostHoveredAtom);
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
    mutate(`/api/posts/${postId}`);
  };

  const trimmedTitle = Boolean(title)
    ? title.length < 20
      ? title
      : title.slice(0, 20) + "..."
    : "Untitled";
  const trimmedContent =
    content.length < 145 ? content : content.slice(0, 144) + "...";

  // console.log("userId: ", userId);

  const onEditorSubmit = (event: FormEvent<HTMLDivElement>) => {
    // e.preventDefault();
    console.log("e: ", event);
    // setEditing(true);
  };

  return (
    <PreviewContainer>
      <Flex direction="column" mt="4px">
        <IconButton
          colorScheme="red"
          variant="ghost"
          onClick={handleDelete}
          icon={<DeleteIcon />}
          aria-label={"delete post"}
        />
      </Flex>
      <Preview key={postId}>
        {media.length > 0 && (
          <ImagePreview
            alt="Post image"
            src={media[0]}
            width={60}
            height={60}
          />
        )}
        <Flex direction="column" m="12px">
          <Flex alignItems="center" justifyContent="center">
            {/* <IconButton
              aria-label="edit-content"
              size="sm"
              variant="ghost"
              icon={<EditIcon />}
              onClick={onOpen}
            /> */}
            <Text as="h2" fontSize="md" fontWeight="bold">
              {trimmedTitle}
            </Text>
          </Flex>
          <Content>
            <Flex alignItems="center" justifyContent="center">
              <Text fontSize="sm" noOfLines={1}>
                {trimmedContent}
              </Text>
            </Flex>
          </Content>
        </Flex>
      </Preview>
      {/* <AdminEditPost
        postElement="title"
        postId={postId}
        elementValue={title}
        isOpen={isOpen}
        onClose={onClose}
      /> */}
      {/* <AdminEditPost
        postElement="content"
        postId={postId}
        elementValue={content}
        isOpen={isOpen}
        onClose={onClose}
      /> */}
    </PreviewContainer>
  );
};

export default AdminPost;
