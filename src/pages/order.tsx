import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GetOrderQuery, GetOrderQueryVariables } from "../__generated__/types";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { PageMeta } from "../components/pageMeta ";
import { formatCurrency } from "../common/formatCurrency";
import { OrderStatusKorean } from "../common/orderStatus";

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const params = useParams<IParams>();

  const { data: orderData } = useQuery<GetOrderQuery, GetOrderQueryVariables>(
    GET_ORDER,
    {
      variables: {
        input: {
          id: +params.id
        }
      }
    }
  );
  console.log("📢 [order.tsx:45]", orderData);

  return (
    <div className="container mt-32 flex justify-center">
      <PageMeta title={`주문 #${params.id}`} />

      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          주문번호 #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          {formatCurrency.format(orderData?.getOrder.order?.total ?? 0)}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            가게:{" "}
            <span className="font-medium">
              {orderData?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            주문자:{" "}
            <span className="font-medium">
              {orderData?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            배달원:{" "}
            {orderData?.getOrder.order?.driver?.email ? (
              <span className="font-medium">
                {orderData?.getOrder.order?.driver?.email}
              </span>
            ) : (
              <span className="font-medium text-gray-500">
                배달원을 찾는 중입니다.
              </span>
            )}
          </div>
          <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
            상태:{" "}
            {orderData?.getOrder.order?.status &&
              OrderStatusKorean[orderData?.getOrder.order?.status]}
          </span>
        </div>
      </div>
    </div>
  );
};
