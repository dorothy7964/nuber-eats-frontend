import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  CATEGORY_FRAGMENT,
  DISH_FRAGMENT,
  RESTAURANT_FRAGMENT
} from "../../fragments";

import {
  CreateOrderItemInput,
  CreateOrderMutation,
  CreateOrderMutationVariables,
  RestaurantQuery,
  RestaurantQueryVariables
} from "../../__generated__/types";
import { ButtonSpan } from "../../components/buttonSpan";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { FullScreenLoader } from "../../components/fullScreenLoader";
import { PageMeta } from "../../components/pageMeta ";

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
      orderId
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
  const selectedMenu = orderItems.length !== 0;

  const history = useHistory();
  const onCompleted = (data: CreateOrderMutation) => {
    const {
      createOrder: { ok, orderId }
    } = data;

    if (ok) {
      history.push(`order/${orderId}`);
    }
  };

  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted
  });

  // 주문 하기
  const triggerConfirmOrder = () => {
    if (placingOrder) return;

    setOrderStarted(true);

    const ok = window.confirm("주문을 하시겠습니까?");
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems
          }
        }
      });
    }
  };

  // 주문 담기 전체 취소
  const triggerCancelOrder = () => {
    setOrderItems([]);
  };

  // 메뉴 담기 리스트에 선택한 메뉴 찾기
  const getOrderItem = (dishId: number) => {
    return orderItems.find((order) => {
      return order.dishId === dishId;
    });
  };

  // 메뉴 담기 리스트에서 선택한 옵션 찾기
  const getOptionItem = (dishId: number, optionName: string) => {
    const orderOption = getOrderItem(dishId)?.options;

    if (orderOption) {
      return orderOption.find((orderMenuOption) => {
        return orderMenuOption.name === optionName;
      });
    }
  };

  // 메뉴 담기 리스트에 선택한 메뉴 존재 여부 체크
  const isMenuSelected = (dishId: number) => {
    return Boolean(getOrderItem(dishId));
  };

  // 메뉴 담기 리스트에 선택한 옵션 존재 여부 체크
  const isOptionSelected = (dishId: number, optionName: string) => {
    return Boolean(getOptionItem(dishId, optionName));
  };

  // 메뉴 담기
  const addItemToOrder = (dishId: number) => {
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };

  // 메뉴 빼기
  const removeFromOrder = (dishId: number) => {
    const orderList = orderItems.filter((order) => order.dishId !== dishId);
    setOrderItems(orderList);
  };

  // 메뉴 옵션 추가
  const addOptionToItem = (dishId: number, optionName: string) => {
    const prevOrderItem = getOrderItem(dishId);

    // 이미 담은 메뉴가 있다면 해당 주문 제거 후 옵션 추가해 다시 담기
    if (prevOrderItem) {
      // 이미 선택한 옵션인지 체크
      const hasOption = isOptionSelected(dishId, optionName);
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          {
            dishId,
            options: [{ name: optionName }, ...prevOrderItem.options!]
          },
          ...current
        ]);
        return;
      }
      return;
    }

    // 메뉴 담기가 되어 있지 않았을 때
    return setOrderItems((current) => [
      { dishId, options: [{ name: optionName }] },
      ...current
    ]);
  };

  // 메뉴 옵션 제거
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    const orderOption = getOrderItem(dishId)?.options;
    const orderOptionList = orderOption?.filter(
      (option) => option.name !== optionName
    );
    removeFromOrder(dishId);
    setOrderItems((current) => [
      { dishId, options: orderOptionList },
      ...current
    ]);
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
        {/* 버튼 : 주문하기, 전체 취소 */}
        <div className="flex justify-end">
          <ButtonSpan
            className={`${!selectedMenu && "pointer-events-none"}  ${
              orderStarted && "cursor-progress"
            } mr-2`}
            text={orderStarted ? "주문 중..." : "주문하기"}
            bgColor={selectedMenu ? "bg-lime-600" : "bg-gray-300"}
            isArrowVisible={false}
            onClick={triggerConfirmOrder}
          />
          <ButtonSpan
            className={`${!selectedMenu && "pointer-events-none"}  ${
              orderStarted && "cursor-progress"
            }`}
            text="전체 취소"
            bgColor={selectedMenu ? "bg-gray-900" : "bg-gray-300"}
            isArrowVisible={false}
            onClick={triggerCancelOrder}
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
              removeFromOrder={removeFromOrder}
            >
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  dishId={dish.id}
                  name={option.name}
                  extra={option.extra}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
