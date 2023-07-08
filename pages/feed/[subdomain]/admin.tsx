import { InferGetStaticPropsType } from "next/types";
import prisma from "../../../lib/prisma";

const FeedAdmin = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <div>Please use admin at the root path</div>;
};

// Posts.getLayout = function getLayout(page: React.ReactElement) {
//   return <FeedLayout>{page}</FeedLayout>;
// };

export default FeedAdmin;

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

export async function getStaticProps() {
  const protocol = process.env.NEXT_PUBLIC_BASE_PROTOCOL;
  const urlPath = process.env.NEXT_PUBLIC_BASE_URL_PATH;
  const fullHomePath = `${protocol}${urlPath}`;

  return {
    redirect: {
      permanent: false,
      destination: `${fullHomePath}/admin`,
    },
  };
}
