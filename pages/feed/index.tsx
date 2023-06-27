import { useRouter } from "next/router";
import { useEffect } from "react";

const Posts = () => {
  const router = useRouter();
  useEffect(() => {
    router.isReady
      ? console.log("router is ready")
      : console.log("router is not ready");
  }, [router.isReady]);
  return <p>Subdomain index: {router.query.subdomain}</p>;
};

export default Posts;
