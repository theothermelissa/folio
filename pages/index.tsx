import React from "react";
import SessionReact from "supertokens-auth-react/recipe/session";
import ProtectedPage from "../components/demo";

export default function Home(props) {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
