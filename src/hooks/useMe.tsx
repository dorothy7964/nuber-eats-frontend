import { gql, useQuery } from "@apollo/client";
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

export const useMe = () => {
  return useQuery<MeQuery>(ME_QUERY);
};
