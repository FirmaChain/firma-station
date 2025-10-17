import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloLink, concat } from '@apollo/client/link/core';
import { HttpLink } from '@apollo/client/link/http';

import { CHAIN_CONFIG } from '../config';

const httpLink = new HttpLink({ uri: CHAIN_CONFIG.GRAPHQL_CONFIG.URI });
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  uri: CHAIN_CONFIG.GRAPHQL_CONFIG.URI,
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({}),
});

export { ApolloProvider, client };
