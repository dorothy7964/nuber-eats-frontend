import { useHistory, useLocation } from "react-router-dom";
import { PageMeta } from "../../components/pageMeta ";
import { useEffect } from "react";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { gql, useLazyQuery } from "@apollo/client";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables
} from "../../__generated__/types";

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

  const [callQuery, { data, called }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT);

  console.log("📢 [search.tsx, data: ]", data);
  console.log("📢 [search.tsx, called: ]", called);

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
          page: 1,
          query
        }
      }
    });
  }, [history, location, callQuery]);

  return (
    <div>
      <PageMeta title="검색" />
      <h1>검색 페이지</h1>
    </div>
  );
};
