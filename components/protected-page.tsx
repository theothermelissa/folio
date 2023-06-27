import React from "react";
import SessionReact, {
  useSessionContext,
} from "supertokens-auth-react/recipe/session";
// import SuperTokensReact from "supertokens-auth-react";

type ProtectedProps = {
  children?: React.ReactNode;
};

export default function Protected({ children }: ProtectedProps) {
  const session = useSessionContext();

  if (session.loading === true) {
    return null;
  }

  return <SessionReact.SessionAuth>{children}</SessionReact.SessionAuth>;
}
