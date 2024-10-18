import { gql, useQuery } from "@apollo/client";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useParams } from "react-router-dom";
import {
  CategoryQuery,
  CategoryQueryVariables
} from "../../__generated__/types";
import { FullScreenLoader } from "../../components/fullScreenLoader";
import { Restaurant } from "../../components/restaurant";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const params = useParams<ICategoryParams>();
  const { data: categoryData, loading } = useQuery<
    CategoryQuery,
    CategoryQueryVariables
  >(CATEGORY_QUERY, {
    variables: {
      input: {
        page: 1,
        slug: params.slug
      }
    }
  });

  if (loading) return <FullScreenLoader />;

  if (!categoryData || !categoryData?.category.restaurants)
    return <div>데이터가 없음</div>;

  return (
    <div className="wrapper-list">
      <div className="grid-list">
        {categoryData?.category.restaurants.map((restaurant) => (
          <Restaurant
            key={restaurant.id}
            id={restaurant.id + ""}
            coverImg={restaurant.coverImg}
            name={restaurant.name}
            categoryName={restaurant.category?.name}
          />
        ))}
      </div>
    </div>
  );
};
