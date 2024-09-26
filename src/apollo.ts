import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({
  // graphql에 URL를 설정하면 apollo httpLink에 보낼 수 있다.
  uri: "http://localhost:4000/graphql"
});

const authLink = setContext((_, { headers }) => {
  console.log("📢 [apollo.ts:20]", headers);
  return {
    headers: {
      ...headers,
      "X-JWT": authTokenVar() || ""
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
