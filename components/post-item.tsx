import { Post } from "../types";
import { Box, Grid, Skeleton } from "@chakra-ui/react";
import { PostCard } from "./post-card";
import { DeletePost } from "./post-controls";

type ItemProps = {
  post: Post;
};

const PostItem = (props: ItemProps) => {
  const {
    post: { id, title, media, content },
  } = props;

  const preview =
    content.length < 145 ? content.padEnd(100) : content.slice(0, 144) + " ...";

  return (
    <Grid marginBottom="12px">
      <PostCard id={id} name={title} imageUrls={media} preview={preview} />
    </Grid>
  );
};

export default PostItem;