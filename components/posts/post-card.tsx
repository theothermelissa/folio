import { Card, CardBody, Stack, Text, Heading } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

type PostCardProps = {
  name: string;
  id: number;
  preview: string;
  imageUrls: string[];
};

const StyledCard = styled(Card)`
  // margin: 10px;
  break-inside: avoid;
  display: flex;
`;

const ImageWithContent = styled(CldImage)`
  height: auto;
  width: 100%;
  object-fit: cover;
  border-radius: 4px 4px 0px 0px;
`;
const ImageWithoutContent = styled(ImageWithContent)`
  border-radius: 4px;
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

const PostImage = ({ hasInfo, imageSrc }) => {
  return (
    <>
      {hasInfo ? (
        <ImageWithContent
          height="800"
          width="400"
          src={imageSrc}
          alt="Post image"
        />
      ) : (
        <ImageWithoutContent
          height="800"
          width="400"
          src={imageSrc}
          alt="Post image"
        />
      )}
    </>
  );
};

export const PostCard = (props: PostCardProps) => {
  const { id, name, imageUrls, preview } = props;
  const hasTitle = name.length > 0;
  const hasContent = preview.length > 0;
  const hasImage = imageUrls.length > 0;
  const hasInfo = hasTitle || hasContent;

  return (
    <Link
      href={{
        pathname: "/posts/[id]",
        query: { id: id },
      }}
    >
      <StyledCard boxShadow="lg" value={id} maxW="sm" borderRadius="md">
        <CardBody style={{ padding: "0px" }}>
          {hasImage && <PostImage hasInfo={hasInfo} imageSrc={imageUrls[0]} />}
          {hasInfo && (
            <PostInfo mt="6" spacing="1">
              {hasTitle && <Heading size="md">{name}</Heading>}
              {hasContent && (
                <Text minW={"fill-available"} noOfLines={[2, 3, 5]}>
                  {preview}
                </Text>
              )}
            </PostInfo>
          )}
        </CardBody>
      </StyledCard>
    </Link>
  );
};
