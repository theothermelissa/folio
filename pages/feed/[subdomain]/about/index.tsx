import { useRouter } from "next/router";
import FeedLayout from "../../../../layouts/feed-layout";

const About = () => {
  const router = useRouter();
  return <h1>{`About for ${router.query.subdomain} go here`}</h1>;
};
About.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default About;
