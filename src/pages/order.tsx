import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GetOrderQuery, GetOrderQueryVariables } from "../__generated__/types";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { PageMeta } from "../components/pageMeta ";

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
    <div>
      <PageMeta title="주문 리스트" />
      오더
    </div>
  );
};
