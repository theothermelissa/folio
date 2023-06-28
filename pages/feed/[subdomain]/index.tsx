import { useRouter } from "next/router";
import FeedLayout from "../../../components/feed-layout";
import { NextPageWithLayout } from "../../../types";

const Feed: NextPageWithLayout = () => {
  const router = useRouter();

  return <p>This is the subdomain index: {router.query.subdomain}</p>;
};

Feed.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default Feed;

// export async function getStaticPaths() {
//   const res = await fetch("/api/feeds");
//   const feeds = await res.json();

//   // Get the paths we want to pre-render based on posts
//   const paths = feeds.map((feed: any) => ({
//     params: { subdomain: feed.subdomain },
//   }));

//   // We'll pre-render only these paths at build time.
//   // { fallback: false } means other routes should 404.
//   return { paths, fallback: false };
// }

// export async function getStaticProps({ params }) {
//   // params contains the post `id`.
//   // If the route is like /posts/1, then params.id is 1
//   const res = await fetch(`https://.../posts/${params.id}`);
//   const post = await res.json();

//   // Pass post data to the page via props
//   return { props: { post } };
// }
