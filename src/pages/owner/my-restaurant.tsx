import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { PageMeta } from "../../components/pageMeta ";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables
} from "../../__generated__/types";

const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant: React.FC = () => {
  const { id } = useParams<IParams>();

  const { data: myRestaurantData } = useQuery<
    MyRestaurantQuery,
    MyRestaurantQueryVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        id: +id
      }
    }
  });
  console.log(myRestaurantData);

  return (
    <div className="container mt-32">
      <PageMeta title="사장님의 레스토랑" />

      <h1>사장님의 레스토랑</h1>
    </div>
  );
};
