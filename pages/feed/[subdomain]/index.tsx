import { useRouter } from "next/router";

const Feed = () => {
  const router = useRouter();
  return <p>Subdomain: {router.query.subdomain}</p>;
};

export default Feed;
