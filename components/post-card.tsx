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

type PostCardProps = {
  children: React.ReactNode;
  name: string;
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

const StyledImage = styled(Image)``;

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
  const { children, name, imageUrls, preview } = props;

  return (
    <StyledCard maxW="sm" borderRadius={"sm"}>
      <CardBody style={{ padding: "15px" }}>
        {imageUrls.length > 0 ? (
          <StyledImage
            borderRadius={"sm"}
            src={imageUrls[0]}
            alt="Post image"
          />
        ) : (
          // TODO: image carousel
          // <>
          //   {imageUrls.map((url) => (
          //     <Image key={url} src={url} alt="foo" borderRadius="lg" />
          //   ))}
          // </>
          <FakePic />
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
  );
};
