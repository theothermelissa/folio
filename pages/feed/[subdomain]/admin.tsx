import { useRouter } from "next/router";
import prisma from "../../../lib/prisma";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next/types";

const FeedAdmin = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { fullHomePath } = props;
  const router = useRouter();

  if (typeof window !== "undefined") {
    router.push(`${fullHomePath}/admin`);
  }

  return <div></div>;
};

export default FeedAdmin;

export async function getStaticPaths() {
  const result = await prisma.feed.findMany({});

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
  const protocol = process.env.NEXT_PUBLIC_BASE_PROTOCOL;
  const urlPath = process.env.NEXT_PUBLIC_BASE_URL_PATH;
  const fullHomePath = `${protocol}${urlPath}`;

  return {
    props: {
      fullHomePath,
    },
  };
}
