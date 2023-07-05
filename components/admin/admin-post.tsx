import styled from "@emotion/styled";
import { Post } from "../../types";
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
import { lorem } from "../../lib/lorem";
import Tiptap from "../Tiptap";

type AdminPostProps = {
  userId: number;
  post: Post;
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

const AdminPost = (props: AdminPostProps) => {
  const { post, userId } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  //   const [editing, setEditing] = useState(false);

  console.log("userId: ", userId);
  return (
    <PreviewContainer>
      <Preview key={post.id}>
        {/* <Image /> */}
        <Flex direction="column">
          <Text as="h2" fontSize="xl">
            {post.title ? post.title : "Untitled"}
          </Text>
          <Content>
            <Text>{post.content}</Text>
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
        <Button leftIcon={<DeleteIcon />} colorScheme="red" onClick={onOpen}>
          Delete
        </Button>
      </ButtonGroup>
    </PreviewContainer>
  );
};

export default AdminPost;
