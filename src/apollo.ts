import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { LOCALSTORAGE_TOKEN } from "./constants";
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

/* HTTP 링크 (Query 및 Mutation 용) */
const httpLink = createHttpLink({
  // graphql에 URL를 설정하면 apollo httpLink에 보낼 수 있다.
  uri:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_RENDER_API_URL
      : "http://localhost:4000/graphql"
});

/* WebSocket 링크 (구독용) */
const wsLink = new GraphQLWsLink(
  createClient({
    url:
      process.env.NODE_ENV === "production"
        ? (process.env.NEXT_PUBLIC_WSS_RENDER_API_URL as string)
        : "ws://localhost:4000/graphql", // WebSocket 서버 URL
    connectionParams: {
      "x-jwt": authTokenVar() || "" // 인증 토큰 전달
    }
  })
);

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || ""
    }
  };
});

// split을 사용하여 HTTP vs WebSocket 요청을 구분
// split 함수는 세 가지 매개변수를 받는다:
// 1. 각 작업을 실행할 때 호출되는 함수
// 2. 해당 함수가 "truthy" 값을 반환하면 사용할 Link - 함수가 true이면 wsLink 사용용
// 3. 해당 함수가 "falsy" 값을 반환하면 사용할 Link - 함수가 false이면 authLink.concat(httpLink) 사용
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription" // 구독인 경우 WebSocket 사용
    );
  },
  wsLink, // 구독은 WebSocket
  authLink.concat(httpLink) // 그 외의 Query와 Mutation는 HTTP
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            }
          },
          token: {
            read() {
              return authTokenVar();
            }
          }
        }
      }
    }
  })
});
