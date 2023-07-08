// import { useRouter } from "next/router";
import FeedLayout from "../../../layouts/feed-layout";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next/types";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { currentFeedAtom, isClaimedAtom } from "../../../atoms/atoms";
import prisma from "../../../lib/prisma";

const About = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { subdomain, owner, claimed } = props;
  // const router = useRouter();
  useHydrateAtoms([
    [currentFeedAtom, subdomain],
    [isClaimedAtom, claimed],
  ]);
  const [currentFeed] = useAtom(currentFeedAtom);
  const [isClaimed] = useAtom(isClaimedAtom);
  return <h1>{`About for ${currentFeed} go here`}</h1>;
};
About.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default About;

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
  const result = await prisma.feed.findUnique({
    where: {
      subdomain: subdomain.toString(),
    },
    include: {
      owner: true,
    },
  });
  return {
    props: {
      subdomain: subdomain.toString(),
      owner: result.owner,
      claimed: Boolean(result.owner.authId),
    },
    revalidate: 10,
  };
}