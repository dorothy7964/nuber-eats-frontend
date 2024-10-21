import { gql } from "@apollo/client";

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryParts on Category {
    id
    name
    coverImg
    slug
    restaurantCount
  }
`;

export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImg
    category {
      ...CategoryParts
    }
    address
    isPromoted
  }
  ${CATEGORY_FRAGMENT}
`;
