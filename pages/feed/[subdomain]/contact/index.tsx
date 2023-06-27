import FeedLayout from "../../../../components/feed-layout";

const Contact = () => {
  return <h1>Contact go here</h1>;
};

Contact.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default Contact;
