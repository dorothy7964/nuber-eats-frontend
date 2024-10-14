import { gql, useQuery } from "@apollo/client";
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables
} from "../../__generated__/types";
import { PageMeta } from "../../components/pageMeta ";
import { Restaurant } from "../../components/restaurant";
import { useState } from "react";
import { MenuIcon } from "../../components/menuIcon";

const RESTAURANTS_QUERY = gql`
  query restaurantsPage($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
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
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="음식점 검색..."
        />
      </form>

      {/* 음식점 카테고리 */}
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="flex justify-around max-w-sm mx-auto ">
            {restaurantsPageData?.allCategories.categories?.map((category) => (
              <div
                key={category.id}
                className="flex flex-col group items-center cursor-pointer"
              >
                <div className="w-16 h-16 group-hover:bg-gray-100 rounded-full flex justify-center items-center">
                  <MenuIcon coverImg={category.coverImg} />
                </div>
                <span className="mt-1 text-sm text-center font-medium">
                  {category.name}
                </span>
              </div>
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
          <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
            <button
              onClick={onPrevPageClick}
              className="arrow-button"
              style={{ visibility: `${page > 1 ? "visible" : "hidden"}` }}
            >
              &larr;
            </button>

            <span>
              페이지 {page} 의 {restaurantsPageData?.restaurants.totalPages}
            </span>

            <button
              onClick={onNextPageClick}
              className="arrow-button"
              style={{
                visibility: `${
                  page !== restaurantsPageData?.restaurants.totalPages
                    ? "visible"
                    : "hidden"
                }`
              }}
            >
              &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
