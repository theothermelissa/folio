import { GetStaticPropsContext, InferGetStaticPropsType } from "next/types";
import FeedLayout from "../../../layouts/feed-layout";
import prisma from "../../../lib/prisma";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { currentFeedAtom } from "../../../atoms/atoms";

const Projects = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { subdomain } = props;
  useHydrateAtoms([[currentFeedAtom, subdomain]]);
  const [currentFeed] = useAtom(currentFeedAtom);
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
  await prisma.feed.findUnique({
    where: {
      subdomain: subdomain.toString(),
    },
  });
  return {
    props: {
      subdomain: subdomain.toString(),
    },
    // revalidate: 5,
  };
}
