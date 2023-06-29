import { Post } from "../types";
import { Box, Grid, Skeleton } from "@chakra-ui/react";
import { PostCard } from "./post-card";
import { DeletePost } from "./post-controls";

type ItemProps = {
  post: Post;
  isLoading: boolean;
};

const PostItem = (props: ItemProps) => {
  const {
    isLoading,
    post: { id, title, media, content },
  } = props;

  const preview =
    content.length < 145 ? content.padEnd(100) : content.slice(0, 144) + " ...";

  return (
    <Grid>
      <Skeleton isLoaded={!isLoading}>
        <PostCard id={id} name={title} imageUrls={media} preview={preview} />
      </Skeleton>
    </Grid>
  );
};

type PostListProps = {
  posts: Post[];
  isLoading: boolean;
};

const PostList = (props: PostListProps) => {
  const { posts, isLoading } = props;

  return (
    // <Box
    //   padding={0}
    //   w="100%"
    //   mx="auto"
    //   sx={{ columnCount: [1, 2, 3, 4, 5], columnGap: "4px" }}
    //   minBlockSize="-webkit-fill-available"
    // >
    <>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} isLoading={isLoading} />
      ))}
    </>
    // </Box>
  );
};

export default PostList;
