import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink, concat } from "@apollo/client";

import { GRAPHQL_URI } from "config";

const httpLink = new HttpLink({ uri: GRAPHQL_URI });
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  uri: GRAPHQL_URI,
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({}),
});

export { ApolloProvider, client };
