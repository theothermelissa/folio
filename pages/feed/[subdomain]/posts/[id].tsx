// import { useRouter } from "next/router";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next/types";
import { CldImage } from "next-cloudinary";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { currentFeedAtom, isClaimedAtom } from "../../../../atoms/atoms";
// import FeedLayout from "../../../../layouts/feed-layout";
import PostLayout from "../../../../layouts/post-layout";
import prisma from "../../../../lib/prisma";
import styled from "@emotion/styled";
import SuperJSON from "superjson";
import { Post as PostType } from "../../../../types";

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

const Post = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    fallback,
    subdomain,
    author,
    claimed,
    post: { title, content, media, publishedDate },
  } = props;
  useHydrateAtoms([
    [currentFeedAtom, subdomain],
    [isClaimedAtom, claimed],
  ]);
  const [currentFeed] = useAtom(currentFeedAtom);
  const [isClaimed] = useAtom(currentFeedAtom);

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
    params: { id, subdomain },
  } = context;
  console.log("getting post: ", id);
  const result = await prisma.post.findUnique({
    where: {
      id: parseInt(id.toString()),
    },
    include: {
      author: true,
    },
  });
  console.log("result: ", result);

  return {
    props: {
      fallback: {
        post: result,
      },
      subdomain: subdomain.toString(),
      author: result.author,
      claimed: Boolean(result.author.authId),
      post: SuperJSON.parse(SuperJSON.stringify(result)) as PostType,
    },
  };
}
