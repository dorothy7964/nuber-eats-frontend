import React from "react";
import { DishOption, DishOptionInputType } from "../__generated__/types";

interface IDishProps {
  name: string;
  price: number;
  photo?: string;
  description: String;
  isCustomer?: boolean;
  options?: DishOption[] | null;
}

export const Dish: React.FC<IDishProps> = ({
  description,
  name,
  price,
  isCustomer = false, // 유저가 고객이면 메뉴의 옵션 노출
  options
}) => {
  const formattedNumber = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW", // "USD", "KRW", "EUR"
    minimumFractionDigits: 0 // 원화는 일반적으로 소수점이 없음
    // useGrouping: false //	천 단위 구분자 사용 여부 (기본값: true)
  });

  return (
    <div className="flex border cur1sor-pointer hover:border-gray-800 transition-all rounded-md overflow-hidden">
      {/* 메뉴 정보 */}
      <div className="flex-1 px-8 py-4">
        <h3 className="text-lg font-medium ">{name}</h3>
        <h4 className="font-medium text-gray-500">{description}</h4>
        <h5 className="mt-5">{formattedNumber.format(price)}</h5>
        {/* 옵션 */}
        {isCustomer && options && options?.length !== 0 && (
          <div>
            <h5 className="mt-8 mb-3 font-bold">- 요리 옵션 -</h5>
            {options?.map((option, index) => (
              <span className="flex items-center" key={index}>
                <h6 className="mr-2">{option.name}</h6>
                <h6 className="text-sm opacity-75">
                  {formattedNumber.format(Number(option.extra))}
                </h6>
              </span>
            ))}
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
