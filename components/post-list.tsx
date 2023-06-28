// import type { GetServerSideProps, GetStaticPaths } from "next";
import useSWR, { SWRConfig } from "swr";
import { Post } from "../types";
import { Box, Flex, Skeleton } from "@chakra-ui/react";
import { PostCard } from "./post-card";
import { DeletePost } from "./post-controls";
import { GetStaticPropsContext } from "next";

type FetcherProps = {
  url: string;
  subdomain: string;
};

const fetcher = async ({ url, subdomain }) => {
  const res = await fetch(url, { method: "GET", headers: { subdomain } });
  return res.json();
};

type ItemProps = {
  p: Post;
};

const PostItem = (props: ItemProps) => {
  const {
    p: { id, title, media, content },
  } = props;

  const preview = content.slice(0, content.length);

  return (
    <Flex display="block" key={id} gap={6}>
      <PostCard id={id} name={title} imageUrls={media} preview={preview}>
        <DeletePost id={id} />
      </PostCard>
    </Flex>
  );
};

type PostListProps = {
  subdomain: string;
};

const PostList = (props: PostListProps) => {
  const { subdomain } = props;
  const { data, error, isLoading } = useSWR(
    `/api/posts`,
    async () => await fetcher({ url: `/api/posts`, subdomain })
  );

  if (!subdomain) {
    return <div>No feed</div>;
  }

  if (error)
    return (
      <div>Unfortunate error. Here's what we got: {JSON.stringify(error)}</div>
    );
  return (
    <div>
      <Box
        padding={4}
        w="100%"
        mx="auto"
        sx={{ columnCount: [1, 2, 3, 4, 5], columnGap: "8px" }}
      >
        <Skeleton isLoaded={!isLoading}>
          {data &&
            data.posts &&
            data.posts.map((p: Post) => <PostItem key={p.id} p={p} />)}
        </Skeleton>
      </Box>
    </div>
  );
};

export default PostList;
