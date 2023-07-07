import FeedLayout from "../../../layouts/feed-layout";
import { NextPageWithLayout, User } from "../../../types";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next/types";
import { currentFeedAtom, isClaimedAtom } from "../../../atoms/atoms";
import { useHydrateAtoms } from "jotai/utils";
import { useAtom } from "jotai";
import prisma from "../../../lib/prisma";
import SuperJSON from "superjson";

const Feed: NextPageWithLayout = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { subdomain, owner, claimed } = props;
  useHydrateAtoms([
    [currentFeedAtom, subdomain],
    [isClaimedAtom, claimed],
  ]);
  const [currentFeed] = useAtom(currentFeedAtom);
  const [isClaimed] = useAtom(isClaimedAtom);
  // console.log("currentFeed from atom: ", currentFeed);
  console.log("isClaimed from atom: ", isClaimed);

  return <p>This is the subdomain index: {subdomain}</p>;
};

Feed.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default Feed;

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
  const owner = SuperJSON.parse(SuperJSON.stringify(result.owner)) as User;

  return {
    props: {
      subdomain: subdomain.toString(),
      owner: owner,
      claimed: Boolean(owner.authId),
    },
    // revalidate: 5,
  };
}
