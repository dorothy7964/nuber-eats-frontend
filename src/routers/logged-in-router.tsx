import { gql, useQuery } from "@apollo/client";
import { FullScreenLoader } from "../components/fullScreenLoader";
import { MeQuery } from "../__generated__/types";

const ME_QUERY = gql`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<MeQuery>(ME_QUERY);

  if (!data || loading || error) {
    return <FullScreenLoader />;
  }

  const { me } = data;
  return (
    <div>
      <h1>{me.email}</h1>
    </div>
  );
};
