import React from "react";
import SessionReact, {
  useSessionContext,
} from "supertokens-auth-react/recipe/session";
import SuperTokensReact from "supertokens-auth-react";

type ProtectedProps = {
  children?: React.ReactNode;
};

export default function Protected({ children }: ProtectedProps) {
  // ah, sweet mystery of life, at last I've found you
  const session = useSessionContext();

  if (session.loading === true) {
    return null;
  }

  return <SessionReact.SessionAuth>{children}</SessionReact.SessionAuth>;
}
