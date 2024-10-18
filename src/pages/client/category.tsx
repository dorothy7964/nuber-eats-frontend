import { gql, useQuery } from "@apollo/client";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useParams } from "react-router-dom";
import {
  CategoryQuery,
  CategoryQueryVariables
} from "../../__generated__/types";
import { FullScreenLoader } from "../../components/fullScreenLoader";
import { Restaurant } from "../../components/restaurant";
import { PageButton } from "../../components/pageButton";
import { useState } from "react";
import { CategoryList } from "../../components/categoryList";

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

  const [page, setPage] = useState<number>(1);

  const { data: categoryData, loading } = useQuery<
    CategoryQuery,
    CategoryQueryVariables
  >(CATEGORY_QUERY, {
    variables: {
      input: {
        page,
        slug: params.slug
      }
    }
  });

  const onNextPageClick = () => setPage((current: number) => current + 1);
  const onPrevPageClick = () => setPage((current: number) => current - 1);

  if (loading || !categoryData || !categoryData?.category.restaurants)
    return <FullScreenLoader />;

  return (
    <div className="wrapper-list">
      {/* 음식점 카테고리 */}
      <CategoryList />

      {/* 카테고리 검색 리스트 */}
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

      {/* 페이지 버튼 */}
      <PageButton
        page={page}
        totalPages={categoryData?.category.totalPages}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
      />
    </div>
  );
};
