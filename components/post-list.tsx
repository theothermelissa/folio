import type { GetServerSideProps, GetStaticPaths } from "next";
import useSWR from "swr";
import { Post } from "../types";
import { Box, Flex } from "@chakra-ui/react";
import { PostCard } from "./post-card";
import { DeletePost } from "./post-controls";

// export const getServerSideProps: GetServerSideProps<{
//   posts: Post[];
// }> = async (context) => {
//   const subdomain = context.params?.subdomain;

//   const response = await fetch(`http://localhost:3000/api/posts`);
//   const data = await response.json();

//   return { props: { posts: data } };
// };

type FetcherProps = {
  url: string;
  subdomain: string;
};

const fetcher = async (props: FetcherProps) => {
  const { url, subdomain } = props;
  //   console.log("Props in fetcher: ", url, ", ", subdomain);
  const res = await fetch(url, { method: "GET", headers: { subdomain } });
  //   console.log("res: ", res);
  return res.json();
};

type PostListProps = {
  subdomain: string;
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
      <PostCard name={title} imageUrls={media} preview={preview}>
        <DeletePost id={id} />
      </PostCard>
    </Flex>
  );
};

const PostList = ({ subdomain }) => {
  const url = `/api/posts`;

  const { data, error, isLoading } = useSWR(
    url,
    async () => await fetcher({ url, subdomain })
  );

  if (!subdomain) {
    return <div>No feed</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Front-end Error: {JSON.stringify(error)}</div>;
  return (
    <div>
      {data && data.posts && (
        <Box
          padding={4}
          w="100%"
          mx="auto"
          sx={{ columnCount: [1, 2, 3, 4, 5], columnGap: "8px" }}
        >
          {data.posts.map((p: Post) => (
            <PostItem key={p.id} p={p} />
          ))}
        </Box>
      )}
    </div>
  );
};

export default PostList;
