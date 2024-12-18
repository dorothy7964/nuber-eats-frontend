import React from "react";

interface IDishProps {
  name: string;
  price: number;
  photo?: string;
  description: String;
}

export const Dish: React.FC<IDishProps> = ({ description, name, price }) => {
  const formattedNumber = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW", // "USD", "KRW", "EUR"
    minimumFractionDigits: 0 // 원화는 일반적으로 소수점이 없음
    // useGrouping: false //	천 단위 구분자 사용 여부 (기본값: true)
  });

  return (
    <div className="flex border cur1sor-pointer hover:border-gray-800 transition-all rounded-md overflow-hidden">
      <div className="flex-1 px-8 py-4">
        <h3 className="text-lg font-medium ">{name}</h3>
        <h4 className="font-medium text-gray-500">{description}</h4>
        <h5 className="mt-5">{formattedNumber.format(price)}</h5>
      </div>
      <img
        width="200px"
        src="https://cdn.pixabay.com/photo/2018/03/21/03/49/food-3245489_1280.jpg"
      />
    </div>
  );
};
