import { useRouter } from "next/router";
import PostItem from "../../../../components/post-feed-item";
import FeedLayout from "../../../../layouts/feed-layout";
import { Box, Flex, Grid, Skeleton } from "@chakra-ui/react";
import { SWRConfig } from "swr/_internal";
import { GetStaticPropsContext } from "next/types";
import prisma from "../../../../lib/prisma";

export async function getStaticPaths() {
  const result = await prisma.feed.findMany({});

  // todo: better types from prisma results
  const paths = result.map((post: any) => ({
    params: { subdomain: post.subdomain },
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
  const result = await prisma.feed.findUnique({
    where: {
      subdomain: subdomain.toString(),
    },
    include: {
      posts: true,
    },
  });

  const posts = JSON.parse(JSON.stringify(result.posts));

  return {
    props: {
      // fallback: {
      //   posts: result.posts,
      // },
      posts: posts,
    },
  };
}

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

const Posts = (props) => {
  const { fallback, posts } = props;

  return (
    <SWRConfig value={fallback}>
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
    </SWRConfig>
  );
};

Posts.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default Posts;
