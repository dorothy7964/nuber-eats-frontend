import { gql, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  MyRestaurantsQuery,
  MyRestaurantsQueryVariables
} from "../../__generated__/types";
import { PageMeta } from "../../components/pageMeta ";
import { Link } from "react-router-dom";
import { NoRestaurants } from "../../components/noRestaurants";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data: myRestaurantsData } = useQuery<
    MyRestaurantsQuery,
    MyRestaurantsQueryVariables
  >(MY_RESTAURANTS_QUERY);

  const noRestaurants =
    myRestaurantsData?.myRestaurants.ok &&
    myRestaurantsData.myRestaurants.restaurants?.length === 0;

  return (
    <div className="container mt-32">
      <PageMeta title="사장님의 레스토랑들" />

      <h2 className="text-4xl font-medium mb-10">사장님이 관리하는 음식점들</h2>

      {noRestaurants && (
        <NoRestaurants
          title="사장님이 관리하는 레스토랑이 없습니다."
          linkTitle="레스토랑 하나 만들기"
          linkAddress="/add-restaurant"
        />
      )}
    </div>
  );
};
