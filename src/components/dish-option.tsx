import React from "react";
import { formattedNumber } from "./dish";

interface IDishOptionProps {
  dishId: number;
  name: string;
  extra?: number | null;
  isSelected: boolean;
  addOptionToItem: (dishId: number, optionName: string) => void;
  // removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  dishId,
  name,
  extra,
  isSelected,
  addOptionToItem = () => {} // 기본 빈 함수 설정
  // removeOptionFromItem,
}) => {
  // const onClick = () => {
  //   if (isSelected) {
  //     removeOptionFromItem(dishId, name);
  //   } else {
  //     addOptionToItem(dishId, name);
  //   }
  // };

  const onClickOption = (dishId: number, optionName: string) => {
    return addOptionToItem(dishId, optionName);
  };

  return (
    <span
      onClick={() => onClickOption(dishId, name)}
      className={`flex items-center p-1 mb-1 cursor-pointer rounded border
    ${isSelected ? "border-lime-600" : "hover:border-gray-800"}`}
    >
      <h6 className="mr-2">{name}</h6>
      <h6 className="text-sm opacity-75">
        {formattedNumber.format(Number(extra))}
      </h6>
    </span>
  );
};
