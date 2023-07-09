import { useRouter } from "next/router";

const FeedAdmin = () => {
  const router = useRouter();
  const fullHomePath =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://folio.pics";

  if (typeof window !== "undefined") {
    router.push(`${fullHomePath}/admin`);
  }

  return <div></div>;
};

export default FeedAdmin;
