import { useRouter } from "next/router";
import FeedLayout from "../../../../components/feed-layout";
import { Flex } from "@chakra-ui/react";

const Post = () => {
  // const router = useRouter();
  // const subdomain = router.query.subdomain as string;

  return (
    <Flex flexDirection="column" width="100%">
      Post go here
      {/* {Boolean(subdomain) ? (
      ) : (
        <div>No feed here 🤷🏻‍♀️</div>
      )} */}
    </Flex>
  );
};

Post.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default Post;
