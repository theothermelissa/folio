import { Box, Flex, Grid, Skeleton } from "@chakra-ui/react";
import useSWR from "swr";
import { useHydrateAtoms } from "jotai/utils";
import { currentFeedAtom, isClaimedAtom } from "../atoms/atoms";
import { Post, User } from "../types";
import PostItem from "./posts/post-feed-item";

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

export type FetchConfig = {
  method: string;
};
export const fetcher = (url: string, config: FetchConfig) =>
  fetch(url, config).then((res) => res.json());

type PostsProps = {
  posts: Post[];
};

const PostsContent = (props: PostsProps) => {
  const { posts } = props;

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

export default PostsContent;
