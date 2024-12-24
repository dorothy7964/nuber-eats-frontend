import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables
} from "../../__generated__/types";
import { ButtonLink } from "../../components/buttonLink";
import { PageMeta } from "../../components/pageMeta ";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { NoRestaurants } from "../../components/noRestaurants";
import { Dish } from "../../components/dish";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant: React.FC = () => {
  const { id: restaurantId } = useParams<IParams>();

  const { data: myRestaurantData } = useQuery<
    MyRestaurantQuery,
    MyRestaurantQueryVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        id: +restaurantId
      }
    }
  });

  const noMenu = myRestaurantData?.myRestaurant.restaurant?.menu.length === 0;

  return (
    <>
      <PageMeta title="사장님의 레스토랑" />

      {/* 커버 이미지 */}
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${myRestaurantData?.myRestaurant.restaurant?.coverImg})`
        }}
      />
      {/* 레스토랑 정보 */}
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {myRestaurantData?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>

        {/* 버튼 */}
        <ButtonLink
          className="mr-8"
          text="요리 추가"
          bgColor="bg-gray-700"
          isArrowVisible={true}
          toLink={`/restaurants/${restaurantId}/add-dish`}
        />
        <ButtonLink
          text="홍보 구매"
          bgColor="bg-lime-600"
          isArrowVisible={true}
          toLink=""
        />

        {/* 메뉴 리스트 */}
        <div className="mt-20">
          {noMenu && <h4 className="text-xl mb-5">요리를 업로드해 주세요!</h4>}

          <div className="grid-list">
            {myRestaurantData?.myRestaurant.restaurant?.menu.map((dish) => (
              <Dish
                name={dish.name}
                price={dish.price}
                photo={dish.photo || ""}
                description={dish.description}
              />
            ))}
          </div>
        </div>

        {/* 판매 차트 */}
        <div className="mt-20 mb-10">
          <h4 className="text-center text-2xl font-medium">판매 차트</h4>
          <div className="max-w-lg w-full mx-auto mt-10">
            <VictoryChart domainPadding={20}>
              <VictoryAxis
                label="금액"
                dependentAxis
                tickValues={[20, 30, 40, 50, 60]}
              />
              <VictoryAxis label="날짜" />
              <VictoryBar
                data={[
                  { x: 10, y: 20 },
                  { x: 20, y: 5 },
                  { x: 35, y: 55 },
                  { x: 45, y: 99 }
                ]}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </>
  );
};
