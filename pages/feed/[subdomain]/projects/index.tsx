import FeedLayout from "../../../../components/feed-layout";

const Projects = () => {
  return <h1>Projects go here</h1>;
};

Projects.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default Projects;
