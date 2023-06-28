import { useRouter } from "next/router";
import PostList from "../../../../components/post-list";
import FeedLayout from "../../../../components/feed-layout";
import { Flex } from "@chakra-ui/react";
import { SWRConfig } from "swr/_internal";
import { GetStaticPropsContext } from "next/types";
// import { CreatePost } from "../../../../components/post-controls";

const url = `/api/posts`;

const fetcher = async ({ url, subdomain }) => {
  const res = await fetch(url, { method: "GET", headers: { subdomain } });
  return res.json();
};

// export async function getStaticProps(context: GetStaticPropsContext) {
//   const {
//     params: { subdomain },
//   } = context;
//   const posts = await fetcher({ url, subdomain });
//   return {
//     props: {
//       fallback: {
//         url: posts,
//       },
//     },
//   };
// }

// export async function getStaticPaths() {
//   const res = await fetch("/api/posts");
//   const posts = await res.json();

//   const paths = posts.map((post: any) => ({
//     params: { id: post.id },
//   }));
//   return {
//     paths,
//     fallback: true,
//   };
// }

const Posts = ({ fallback }) => {
  const router = useRouter();
  const subdomain = router.query.subdomain as string;

  return (
    <SWRConfig value={fallback}>
      <Flex flexDirection="column" width="100%">
        {Boolean(subdomain) ? (
          <PostList subdomain={subdomain} />
        ) : (
          <div>No feed here 🤷🏻‍♀️</div>
        )}
        {/* <CreatePost /> */}
      </Flex>
    </SWRConfig>
  );
};

Posts.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default Posts;
