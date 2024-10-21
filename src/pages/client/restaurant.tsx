import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";

import { FullScreenLoader } from "../../components/fullScreenLoader";
import {
  RestaurantQuery,
  RestaurantQueryVariables
} from "../../__generated__/types";
import { PageMeta } from "../../components/pageMeta ";

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

  return (
    <div>
      <PageMeta title={restaurant.name || ""} />

      <div
        className=" bg-gray-800 bg-center bg-cover py-48"
        style={{
          backgroundImage: `url(${restaurant?.coverImg})`
        }}
      >
        <div className="bg-white xl:w-3/12 py-8 pl-48">
          <h4 className="text-4xl mb-3">{restaurant?.name}</h4>
          <Link
            key={restaurant?.category?.id}
            to={`/category/${restaurant?.category?.slug}`}
          >
            <h5 className="text-sm font-light mb-2 cursor-pointer">
              {restaurant?.category?.name}
            </h5>
          </Link>
          <h6 className="text-sm font-light">{restaurant?.address}</h6>
        </div>
      </div>
    </div>
  );
};
