import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";

import { FullScreenLoader } from "../../components/fullScreenLoader";
import {
  RestaurantQuery,
  RestaurantQueryVariables
} from "../../__generated__/types";

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IRestaurantParams {
  id: string;
}

export const Restaurant: React.FC = () => {
  const params = useParams<IRestaurantParams>();
  const { data: restaurantData, loading } = useQuery<
    RestaurantQuery,
    RestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +params.id
      }
    }
  });

  if (loading || !restaurantData || !restaurantData?.restaurant.restaurant)
    return <FullScreenLoader />;

  const { restaurant } = restaurantData?.restaurant;
  console.log("📢 [restaurant.tsx:40]", restaurant);

  return <h1>Restaurant</h1>;
};
