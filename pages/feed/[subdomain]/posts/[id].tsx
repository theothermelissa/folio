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
import { useRouter } from "next/router";

const Hero = styled(CldImage)`
  height: 100%;
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
    fullHomePath,
    post: { title, content, media, publishedDate },
  } = props;

  useHydrateAtoms([
    [currentFeedAtom, subdomain],
    [isClaimedAtom, claimed],
  ]);
  const [currentFeed] = useAtom(currentFeedAtom);
  const [isClaimed] = useAtom(currentFeedAtom);
  const router = useRouter();

  if (typeof window !== "undefined" && !subdomain) {
    router.push(fullHomePath);
  }

  return (
    <Flex flexDirection="column" width="100%" alignItems="center">
      {media.length > 0 && <HeroImage src={media[0]} />}
      {title && <PostTitle title={title} />}
      {content && <PostBody body={content} />}
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

  const protocol = process.env.NEXT_PUBLIC_BASE_PROTOCOL;
  const urlPath = process.env.NEXT_PUBLIC_BASE_URL_PATH;
  const fullHomePath = `${protocol}${urlPath}`;

  // console.log("getting post: ", id);
  const result = await prisma.post.findUnique({
    where: {
      id: parseInt(id.toString()),
    },
    include: {
      author: true,
    },
  });
  // console.log("result: ", result);

  return {
    props: {
      fallback: {
        post: result,
      },
      subdomain: subdomain.toString(),
      fullHomePath,
      author: result.author,
      claimed: Boolean(result.author.authId),
      post: SuperJSON.parse(SuperJSON.stringify(result)) as PostType,
    },
  };
}
