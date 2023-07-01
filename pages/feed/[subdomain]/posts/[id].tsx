import { useRouter } from "next/router";
import FeedLayout from "../../../../layouts/feed-layout";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { GetStaticPropsContext } from "next/types";
import styled from "@emotion/styled";
import { CldImage } from "next-cloudinary";
import prisma from "../../../../lib/prisma";
import PostLayout from "../../../../layouts/post-layout";

const Hero = styled(CldImage)`
  // height: auto;
  // width: 100%;
  // object-fit: cover;
`;

const HeroImage = ({ src }) => {
  return (
    // <>
    // <Hero alt="post image" {...src} />
    <Hero width={600} height={600} alt="post image" src={src} />
    // </>
  );
};

const PostTitle = ({ title }) => {
  return (
    // <>
    <Heading>{title}</Heading>
    // </>
  );
};

const PostBody = ({ body }) => {
  return (
    <>
      <Text>{body}</Text>
    </>
  );
};

const Post = (props) => {
  console.log("props: ", props);
  const {
    fallback,
    post: { title, content, media, publishedDate },
  } = props;

  // heroImage
  // additional images, if any
  // title
  // content
  // date posted
  // eventually tags & metadata

  return (
    <Flex flexDirection="column" width="100%" alignItems="center">
      <HeroImage src={media[0]} />
      {title && <PostTitle title={title} />}
      <PostBody body={content} />
    </Flex>
  );
};

Post.getLayout = function getLayout(page: React.ReactElement) {
  return <PostLayout>{page}</PostLayout>;
};

export default Post;

export async function getStaticPaths() {
  const result = await prisma.post.findMany({
    include: {
      feed: true,
    },
  });
  // todo: better types from prisma results
  // console.log("result: ", result);
  const paths = result.map((post: any) => {
    if (!post.feed) {
      return { params: { id: post.id.toString(), subdomain: "default" } };
    } else
      return {
        params: { id: post.id.toString(), subdomain: post.feed.subdomain },
      };
  });
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const {
    params: { id },
  } = context;
  console.log("getting post: ", id);
  const result = await prisma.post.findUnique({
    where: {
      id: parseInt(id.toString()),
    },
  });
  console.log("result: ", result);

  return {
    props: {
      // fallback: {
      //   posts: result.posts,
      // },
      post: JSON.parse(JSON.stringify(result)),
    },
  };
}
