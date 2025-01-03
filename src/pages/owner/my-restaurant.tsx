import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer
} from "victory";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables
} from "../../__generated__/types";
import { ButtonLink } from "../../components/buttonLink";
import { Dish } from "../../components/dish";
import { PageMeta } from "../../components/pageMeta ";
import {
  DISH_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT
} from "../../fragments";

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
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
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
  const noOrder =
    myRestaurantData?.myRestaurant.restaurant?.orders.length === 0;

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
                key={dish.id}
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
          <div className="mt-10">
            {noOrder ? (
              <div className="text-center text-gray-500">주문이 없습니다.</div>
            ) : (
              <VictoryChart
                height={500}
                width={window.innerWidth}
                theme={VictoryTheme.material}
                containerComponent={<VictoryVoronoiContainer />}
              >
                <VictoryLine
                  labels={({ datum }) => `${datum.y}원`}
                  labelComponent={
                    <VictoryTooltip
                      style={{ fontSize: 15 } as any}
                      renderInPortal
                      dy={-20} // 툴팁을 수직 방향으로 이동
                    />
                  }
                  data={myRestaurantData?.myRestaurant.restaurant?.orders.map(
                    (order) => ({
                      x: order.createAt,
                      y: order.total || 0 // 기본값: 0원
                    })
                  )}
                  interpolation="natural" // 선 스타일
                  style={{
                    data: {
                      strokeWidth: 5 // 그래프 선 굵기
                    }
                  }}
                />
                <VictoryAxis
                  tickLabelComponent={<VictoryLabel renderInPortal />}
                  style={{
                    tickLabels: {
                      fontSize: 20,
                      fill: "grey"
                    } as any
                  }}
                  tickFormat={(tick: string) =>
                    new Date(tick).toLocaleDateString("ko")
                  }
                />
              </VictoryChart>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
