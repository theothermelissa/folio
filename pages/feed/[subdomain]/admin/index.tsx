import FeedLayout from "../../../../components/feed-layout";
import Protected from "../../../../components/protected-page";

const Admin = () => {
  return (
    <Protected>
      <h1>Admin go here</h1>
    </Protected>
  );
};

Admin.getLayout = function getLayout(page: React.ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

export default Admin;
