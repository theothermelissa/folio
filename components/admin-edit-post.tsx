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
import Document from "@tiptap/extension-document";
import { JSONContent } from "@tiptap/react";

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
  width: 90%;
  height: 150px;
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

type EditPostProps = {
  postId: number;
  postElement: "title" | "content";
  elementValue: string;
  isOpen: boolean;
  onClose: () => void;
};

const StyledModalContent = styled(ModalContent)`
  background-color: whitesmoke;
`;

const AdminEditPost = (props: EditPostProps) => {
  const { postElement, postId, elementValue, isOpen, onClose } = props;

  const onUpdate = (json: JSONContent) => {
    // console.log("nope");
    // setDraftTitle(json.content);
  };

  const onContentUpdate = (update: any) => {
    // console.log("update: ", update);
  };

  function toTitleCase(str: string) {
    return str
      .split("")
      .map((letter, index) =>
        index < 1 ? letter.toUpperCase() : letter.toLowerCase()
      )
      .join("");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <StyledModalContent>
        <ModalHeader>Edit {toTitleCase(postElement)}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* <Flex> */}
          <Tiptap onKeyUp={onUpdate} content={elementValue ?? "(no value)"} />
          {/* </Flex> */}
        </ModalBody>
        <ModalFooter>
          <Button type="submit" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue" mr={3} onClick={onClose}>
            Save
          </Button>
          {/* <Button variant="ghost">Secondary Action</Button> */}
        </ModalFooter>
      </StyledModalContent>
    </Modal>
  );
};

export default AdminEditPost;
