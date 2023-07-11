import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { InferGetStaticPropsType, GetStaticPropsContext } from "next";
import { currentFeedAtom } from "../../../atoms/atoms";
import FeedLayout from "../../../layouts/feed-layout";
import prisma from "../../../lib/prisma";
import { useRouter } from "next/router";
import { type } from "os";

const Contact = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { subdomain } = props;
  useHydrateAtoms([[currentFeedAtom, subdomain]]);
  const [currentFeed] = useAtom(currentFeedAtom);

  return <h1>Contact go here</h1>;
};

Contact.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default Contact;

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
