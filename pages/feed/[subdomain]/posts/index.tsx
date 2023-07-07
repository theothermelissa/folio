import PostItem from "../../../../components/posts/post-feed-item";
import FeedLayout from "../../../../layouts/feed-layout";
import { Box, Flex, Grid, Skeleton } from "@chakra-ui/react";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next/types";
import prisma from "../../../../lib/prisma";
import useSWR from "swr";
// import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { currentFeedAtom, isClaimedAtom } from "../../../../atoms/atoms";

const PostSkeleton = ({ height }) => (
  <Flex style={{ breakInside: "avoid", padding: "8px" }}>
    <Skeleton flex="1" height={height} />
  </Flex>
);

const getRandomHeightString = ({ min, max }) => {
  const heightString = Math.round(Math.random() * (max - min) + min).toString();
  return heightString;
};

const PostsLoading = ({ numberSkeletons }) => {
  let fakePosts = [] as JSX.Element[];

  for (let i = 0; i < numberSkeletons; i++) {
    fakePosts.push(
      <PostSkeleton
        key={`post-skeleton-${i}`}
        height={getRandomHeightString({ min: 180, max: 450 })}
      />
    );
  }
  return <Grid>{fakePosts.map((p) => p)}</Grid>;
};
const url = "/api/posts";

export type FetchConfig = {
  headers: {
    "x-subdomain": string;
  };
};
export const fetcher = (url: string, config: FetchConfig) =>
  fetch(url, config).then((res) => res.json());

const Posts = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  // const router = useRouter();
  const { subdomain, owner, claimed } = props;
  useHydrateAtoms([
    [currentFeedAtom, subdomain],
    [isClaimedAtom, claimed],
  ]);
  const [currentFeed] = useAtom(currentFeedAtom);
  const [isClaimed] = useAtom(isClaimedAtom);
  const { data } = useSWR(url, () => fetcher(url, fetcherConfig), {
    fallbackData: props,
    refreshInterval: 5000,
  });

  const fetcherConfig = {
    headers: {
      "x-subdomain": currentFeed,
    },
  };

  const { fallback, posts } = data;

  return (
    <Box
      padding={0}
      w="100%"
      mx="auto"
      sx={{ columnCount: [1, 2, 3, 4, 5], columnGap: "12px" }}
      margin="0px 16px"
    >
      {posts && posts.length > 0 ? (
        posts.map((post) => <PostItem key={post.id} post={post} />)
      ) : (
        <PostsLoading numberSkeletons={13} />
      )}
    </Box>
  );
};

Posts.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default Posts;

export async function getStaticPaths() {
  const result = await prisma.feed.findMany({});

  // todo: better types from prisma results
  const paths = result.map((feed: any) => ({
    params: { subdomain: feed.subdomain },
  }));
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const {
    params: { subdomain },
  } = context;
  const result = await prisma?.feed.findUnique({
    where: {
      subdomain: subdomain.toString(),
    },
    include: {
      posts: true,
      owner: true,
    },
  });

  const posts = JSON.parse(JSON.stringify(result.posts));
  const owner = JSON.parse(JSON.stringify(result.owner));

  return {
    props: {
      // fallback: {
      //   posts: result.posts,
      // },
      owner: owner,
      claimed: Boolean(owner.authId),
      subdomain: subdomain.toString(),
      posts: posts,
    },
    // revalidate: 5,
  };
}
