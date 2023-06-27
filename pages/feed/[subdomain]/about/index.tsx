import { useRouter } from "next/router";

const About = () => {
  const router = useRouter();
  return <h1>{`About for ${router.query.subdomain} go here`}</h1>;
};

export default About;
