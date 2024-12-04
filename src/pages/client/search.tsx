import { useHistory, useLocation } from "react-router-dom";
import { PageMeta } from "../../components/pageMeta ";
import { useEffect, useState } from "react";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { gql, useLazyQuery } from "@apollo/client";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables
} from "../../__generated__/types";
import { FoodSearch } from "../../components/foodSearch";
import { FullScreenLoader } from "../../components/fullScreenLoader";
import { Restaurant } from "../../components/restaurant";
import { PageButton } from "../../components/pageButton";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const [page, setPage] = useState<number>(1);
  const onNextPageClick = () => setPage((current: number) => current + 1);
  const onPrevPageClick = () => setPage((current: number) => current - 1);

  const [callQuery, { data: searchData, /*called,*/ loading }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT);

  useEffect(() => {
    // URL에서 쿼리 파라미터를 추출하고 디코딩
    const [, query] = location.search.split("?term=");
    const searchTerm = decodeURIComponent(query);

    if (!searchTerm) {
      return history.replace("/");
    }

    // searchTerm이 있으면 useLazyQuery 호출
    callQuery({
      variables: {
        input: {
          page,
          query
        }
      }
    });
  }, [page, history, location, callQuery]);

  if (loading || !searchData || !searchData.searchRestaurant.restaurants)
    return <FullScreenLoader />;

  return (
    <div>
      <PageMeta title="음식점 검색" />

      {/* 음식점 카테고리 */}
      <FoodSearch />

      <div className="container">
        {/* 음식점 검색 리스트 */}
        <div className="grid-list">
          {searchData.searchRestaurant.restaurants.map((restaurant) => (
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
          totalPages={searchData?.searchRestaurant.totalPages}
          onNextPageClick={onNextPageClick}
          onPrevPageClick={onPrevPageClick}
        />
      </div>
    </div>
  );
};
