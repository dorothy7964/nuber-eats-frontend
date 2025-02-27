import { OrderStatus } from "../__generated__/types";

/* 한글로 변환된 값을 표시 */
export const OrderStatusKorean: Record<OrderStatus, string> = {
  [OrderStatus.Cooked]: "조리 완료",
  [OrderStatus.Cooking]: "조리 중",
  [OrderStatus.Delivered]: "배달 완료",
  [OrderStatus.Pending]: "주문 접수 대기",
  [OrderStatus.PickedUp]: "배달 중"
};
