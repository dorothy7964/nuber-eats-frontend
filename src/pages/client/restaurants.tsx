import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables
} from "../../__generated__/types";
import { CategoryList } from "../../components/categoryList";
import { PageButton } from "../../components/pageButton";
import { PageMeta } from "../../components/pageMeta ";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { FoodSearch } from "../../components/foodSearch";

const RESTAURANTS_QUERY = gql`
  query restaurantsPage($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Restaurants: React.FC = () => {
  const [page, setPage] = useState<number>(1);

  const { data: restaurantsPageData, loading } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page
      }
    }
  });

  const onNextPageClick = () => setPage((current: number) => current + 1);
  const onPrevPageClick = () => setPage((current: number) => current - 1);

  return (
    <div>
      <PageMeta title="홈" />
      {/* 음식점 검색 */}
      <FoodSearch />

      {/* 음식점 카테고리 */}
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="flex justify-around max-w-lg mx-auto ">
            {restaurantsPageData?.allCategories.categories?.map((category) => (
              <CategoryList
                id={category.id}
                name={category.name}
                slug={category.slug}
                coverImg={category.coverImg}
              />
            ))}
          </div>

          {/* 음식점 리스트 */}
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {restaurantsPageData?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>

          {/* 페이지 버튼 */}
          <PageButton
            page={page}
            totalPages={restaurantsPageData?.restaurants.totalPages}
            onNextPageClick={onNextPageClick}
            onPrevPageClick={onPrevPageClick}
          />
        </div>
      )}
    </div>
  );
};
