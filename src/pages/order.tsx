import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  EditOrderMutation,
  EditOrderMutationVariables,
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderStatus,
  OrderUpdatesSubscription,
  UserRole
} from "../__generated__/types";
import { formatCurrency } from "../common/formatCurrency";
import { OrderStatusKorean } from "../common/orderStatus";
import { PageMeta } from "../components/pageMeta ";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { useMe } from "../hooks/useMe";

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

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const params = useParams<IParams>();
  const { data: userData } = useMe();

  const [editOrderMutation] = useMutation<
    EditOrderMutation,
    EditOrderMutationVariables
  >(EDIT_ORDER);

  const { data: orderData, subscribeToMore } = useQuery<
    GetOrderQuery,
    GetOrderQueryVariables
  >(GET_ORDER, {
    variables: {
      input: {
        id: +params.id
      }
    }
  });

  useEffect(() => {
    if (orderData?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION, // document: GraphQL subscription 쿼리
        variables: {
          // variables: variables는 구독할 때 사용할 변수 / 객체 (예: { input: { id: 123 } })
          input: {
            id: +params.id
          }
        },
        updateQuery: (
          // updateQuery: 새로운 subscription 데이터가 기존 쿼리 데이터에 어떻게 반영될지 정의하는 함수
          // ㄴ새로운 subscription 데이터를 subscriptionData로 받는다.
          prev,
          {
            subscriptionData: { data }
          }: { subscriptionData: { data: OrderUpdatesSubscription } }
        ) => {
          if (!data) return prev; // 새로운 데이터가 없으면 기존 데이터 반환

          return {
            getOrder: {
              ...prev.getOrder, // 기존 쿼리 결과에 구독된 데이터 반영
              order: {
                ...data.orderUpdates // 새로운 orderUpdates 데이터를 기존 데이터에 덮어씀
              }
            }
          };
        }
      });
    }
  }, [orderData]);

  const onButtonClick = (newStatus: OrderStatus) => {
    console.log("📢 [order.tsx:107]", newStatus);
    editOrderMutation({
      variables: {
        input: {
          id: +params.id,
          status: newStatus
        }
      }
    });
  };

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

          {/* 고객 전용 / 유저별 주문 상태 관리 */}
          {userData?.me.role === UserRole.Client && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              상태: {OrderStatusKorean[orderData?.getOrder.order?.status!]}
            </span>
          )}

          {/* 사장님 전용 / 유저별 주문 상태 관리 */}
          {userData?.me.role === UserRole.Owner && (
            <>
              {orderData?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                  className="btn"
                >
                  주문 접수
                </button>
              )}
              {orderData?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                  className="btn"
                >
                  조리 완료
                </button>
              )}
              {/* 접수 대기, 조리중 제외 하고 상태 노출  */}
              {orderData?.getOrder.order?.status !== OrderStatus.Cooking &&
                orderData?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                    상태:{" "}
                    {OrderStatusKorean[orderData?.getOrder.order?.status!]}
                  </span>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
