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
