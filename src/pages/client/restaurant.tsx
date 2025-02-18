import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CATEGORY_FRAGMENT,
  DISH_FRAGMENT,
  RESTAURANT_FRAGMENT
} from "../../fragments";

import { FullScreenLoader } from "../../components/fullScreenLoader";
import {
  CreateOrderItemInput,
  RestaurantQuery,
  RestaurantQueryVariables
} from "../../__generated__/types";
import { PageMeta } from "../../components/pageMeta ";
import { Dish } from "../../components/dish";
import { ButtonSpan } from "../../components/buttonSpan";

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        category {
          ...CategoryParts
        }
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
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

  const [orderStarted, setOrderStarted] = useState(false); // 주문하기 버튼 클릭 여부
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]); // 선택한 메뉴
  //! console
  console.log("📢 [restaurant.tsx:orderItems]", orderItems);

  const triggerStartOrder = () => {
    setOrderStarted(true);
  };

  // 주문 담기 리스트에 선택한 메뉴 찾기
  const getOrderItem = (dishId: number) => {
    return orderItems.find((order) => {
      return order.dishId === dishId;
    });
  };

  // 주문 담기 리스트에 선택한 메뉴 존재 여부 체크
  const isMenuSelected = (dishId: number) => {
    return Boolean(getOrderItem(dishId));
  };

  // 주문 담기 리스트
  const addItemToOrder = (dishId: number) => {
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };

  if (loading || !restaurantData || !restaurantData?.restaurant.restaurant)
    return <FullScreenLoader />;

  const { restaurant } = restaurantData?.restaurant;
  const noMenu = restaurant.menu.length === 0;

  return (
    <div>
      <PageMeta title={restaurant.name || ""} />

      {/* 커버 이미지 및 레스토랑 정보보 */}
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

      <div className="container mt-20">
        {/* 주문하기 버튼 */}
        <div className="flex flex-col items-end">
          <ButtonSpan
            className={orderStarted ? "cursor-progress" : ""}
            text={orderStarted ? "주문 중..." : "주문하기"}
            bgColor={orderStarted ? "bg-gray-300" : "bg-lime-600"}
            isArrowVisible={false}
            onClick={triggerStartOrder}
          />
        </div>

        {/* 메뉴 리스트 */}
        <div className="grid-list">
          {noMenu && (
            <h4 className="text-xl mx-5 text-gray-500">
              등록된 메뉴가 없습니다.
            </h4>
          )}
          {restaurant.menu.map((dish) => (
            <Dish
              key={dish.id}
              id={dish.id}
              name={dish.name}
              price={dish.price}
              photo={dish.photo || ""}
              description={dish.description}
              isCustomer={true}
              options={dish.options}
              orderStarted={orderStarted}
              isMenuSelected={isMenuSelected(dish.id)}
              addItemToOrder={addItemToOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
