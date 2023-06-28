import {
  Card,
  CardBody,
  Stack,
  Text,
  Heading,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  Image,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";

type PostCardProps = {
  children: React.ReactNode;
  name: string;
  id: number;
  preview: string;
  imageUrls: string[];
};

const StyledCard = styled(Card)`
  margin: 10px;
  display: block;
  break-inside: avoid;
`;

// const StyledDivider = styled(Divider)`
//   color: gainsboro;
// `;

const StyledImage = styled(Image)`
  height: auto;
  width: 100%;
  object-fit: cover;
`;

const FakePic = styled.div`
  background-color: gainsboro;
  height: 200px;
  width: 100%;
`;

const PostInfo = styled(Stack)`
  padding: 10px;
  margin-top: 8px;
`;

export const PostCard = (props: PostCardProps) => {
  const { children, id, name, imageUrls, preview } = props;

  const router = useRouter();

  return (
    <Link
      href={{
        pathname: "/posts/[id]",
        query: { id: id },
      }}
    >
      <StyledCard value={id} maxW="sm" borderRadius={"sm"}>
        <CardBody style={{ padding: "15px" }}>
          {imageUrls.length > 0 && (
            <StyledImage
              borderRadius={"sm"}
              src={imageUrls[0]}
              alt="Post image"
            />
          )}
          <PostInfo mt="6" spacing="1">
            {name.length > 0 && <Heading size="md">{name}</Heading>}
            <Text>{preview}</Text>
            {/* <Text color="blue.600" fontSize="2xl">
              tags
            </Text> */}
          </PostInfo>
        </CardBody>
        {/* <StyledDivider /> */}
        {/* <CardFooter> */}
        {/* <ButtonGroup spacing="2">
            <Button variant="solid" colorScheme="blue">
            Read More
          </Button> */}
        {/* <Button variant="ghost" colorScheme="blue">
              Add to cart
            </Button> */}
        {/* {children} */}
        {/* </ButtonGroup> */}
        {/* </CardFooter> */}
      </StyledCard>
    </Link>
  );
};
