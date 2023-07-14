import { GetStaticPropsContext, InferGetStaticPropsType } from "next/types";
import useSWR from "swr";
import { useHydrateAtoms } from "jotai/utils";
import SuperJSON from "superjson";
import { Post, User } from "@prisma/client";
import { currentFeedAtom, isClaimedAtom } from "../../../atoms/atoms";
import PostsContent from "../../../components/feed-posts-content";
import FeedLayout from "../../../layouts/feed-layout";
import prisma from "../../../lib/prisma";

export type FetchConfig = {
  method: string;
};
export const fetcher = (url: string, config: FetchConfig) =>
  fetch(url, config).then((res) => res.json());

const FeedIndex = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { subdomain, owner, claimed } = props;

  useHydrateAtoms([
    [currentFeedAtom, subdomain],
    [isClaimedAtom, claimed],
  ]);
  const url = "/api/posts";

  const { data } = useSWR(url, () => fetcher(url, fetcherConfig), {
    fallbackData: props,
    refreshInterval: 5000,
  });

  const fetcherConfig = {
    method: "GET",
  };

  const { fallback, posts } = data;

  return <PostsContent posts={posts} />;
};

FeedIndex.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default FeedIndex;

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

export async function getStaticProps(context: GetStaticPropsContext) {
  const {
    params: { subdomain },
  } = context;
  // console.log("subdomain in getStaticProps: ", subdomain);

  const result = await prisma?.feed.findUnique({
    where: {
      subdomain: subdomain.toString(),
    },
    include: {
      posts: true,
      owner: true,
    },
  });

  // console.log("result: ", result);

  const posts = SuperJSON.parse(SuperJSON.stringify(result.posts)) as Post[];
  const owner = SuperJSON.parse(SuperJSON.stringify(result.owner)) as User;

  return {
    props: {
      // fallback: {
      //   posts: result.posts,
      // },
      owner: owner,
      claimed: Boolean(owner.authId),
      subdomain: subdomain.toString(),
      posts: posts,
    },
    // revalidate: 5,
  };
}
