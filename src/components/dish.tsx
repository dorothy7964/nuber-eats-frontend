import React from "react";
import { DishOption } from "../__generated__/types";

interface IDishProps {
  id?: number;
  name: string;
  price: number;
  photo?: string;
  description: String;
  isCustomer?: boolean;
  options?: DishOption[] | null;
  orderStarted?: boolean;
  isMenuSelected?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  children?: React.ReactNode;
}

export const formattedNumber = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW", // "USD", "KRW", "EUR"
  minimumFractionDigits: 0 // 원화는 일반적으로 소수점이 없음
  // useGrouping: false //	천 단위 구분자 사용 여부 (기본값: true)
});

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  name,
  price,
  photo,
  description,
  isCustomer = false, // 유저가 고객이면 메뉴의 옵션 노출
  options,
  orderStarted = false, // 오너 화면에서는 주문하기 버튼이 필요없으므로 기본값 false 설정
  isMenuSelected, // 주문 담기 리스트에 선택한 메뉴 존재 여부 체크
  addItemToOrder = () => {}, // 기본 빈 함수 설정
  removeFromOrder = () => {}, // 기본 빈 함수 설정
  children: dishOptions
}) => {
  const onClickMenu = (dishId: number) => {
    // 메뉴 빼기
    if (isMenuSelected) {
      return removeFromOrder(dishId);
    }

    // 메뉴 담기
    if (!isMenuSelected) {
      return addItemToOrder(dishId);
    }
  };

  return (
    <div
      className={`flex border cur1sor-pointer ${
        isMenuSelected ? "border-lime-600" : "hover:border-gray-800"
      } transition-all rounded-md overflow-hidden`}
    >
      <div className="flex flex-col flex-1 px-8 py-4">
        {/* 메뉴 정보 */}
        <h3 className="text-lg font-medium ">{name}</h3>
        <h4 className="font-medium text-gray-500">{description}</h4>
        <h5 className="mt-5">{formattedNumber.format(price)}</h5>
        {/* 옵션 */}
        {isCustomer && options && options?.length !== 0 && (
          <div className="mb-5">
            <h5 className="mt-8 mb-3 font-bold">- 요리 옵션 -</h5>
            <div>{dishOptions}</div>
          </div>
        )}

        {/* 메뉴 담기 */}
        {!orderStarted && (
          <div className="mt-auto flex justify-end">
            <span
              onClick={() => onClickMenu(id)}
              className={`cursor-pointer text-white ${
                isMenuSelected ? "bg-red-600" : "bg-gray-900"
              } py-1 px-2 mt-5`}
            >
              {isMenuSelected ? "메뉴 빼기" : "메뉴 담기"}
            </span>
          </div>
        )}
      </div>

      {/* 요리 이미지 */}
      <img
        width="200px"
        src="https://cdn.pixabay.com/photo/2018/03/21/03/49/food-3245489_1280.jpg"
      />
    </div>
  );
};
