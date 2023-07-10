import { GetStaticPropsContext, InferGetStaticPropsType } from "next/types";
import FeedLayout from "../../../layouts/feed-layout";
import prisma from "../../../lib/prisma";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { currentFeedAtom } from "../../../atoms/atoms";
import { useRouter } from "next/router";

const Projects = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { subdomain, fullHomePath } = props;
  useHydrateAtoms([[currentFeedAtom, subdomain]]);
  const [currentFeed] = useAtom(currentFeedAtom);
  const router = useRouter();

  if (typeof window !== "undefined" && !subdomain) {
    router.push(fullHomePath);
  }

  return <h1>{currentFeed}'s Projects go here</h1>;
};

Projects.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default Projects;

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

  await prisma.feed.findUnique({
    where: {
      subdomain: subdomain.toString(),
    },
  });
  return {
    props: {
      subdomain: subdomain.toString(),
      fullHomePath,
    },
    // revalidate: 5,
  };
}
