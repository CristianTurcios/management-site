/* eslint-disable no-restricted-syntax */
import axios from 'axios';
import {
  from, ApolloClient, InMemoryCache, HttpLink, ApolloLink, fromPromise,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const getNewToken = async () => {
  const baseUrl = process.env.REACT_APP_API_URL || '';

  try {
    return await axios.get(`${baseUrl}/authentication/refresh-token`, {
      headers: { refreshToken: localStorage.getItem('refreshToken') || '' },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err.message) {
        case 'Unauthorized':
          return fromPromise(
            getNewToken().then((response) => {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              return response.data.token;
            }).catch((error) => {
              throw new Error(error);
            }),
          ).filter((value) => Boolean(value))
            .flatMap((token) => {
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${token}`,
                },
              });
              return forward(operation);
            });
        default:
          return forward(operation);
      }
    }
  }
  return forward(operation);
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }: any) => ({
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
      ...headers,
    },
  }));
  return forward(operation);
});

const link = from([
  errorLink,
  authLink,
  new HttpLink({ uri: `${process.env.REACT_APP_API_URL}/graphql` }),
]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(
    {
      typePolicies: {
        Query: {
          fields: {
            Roles: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    },
  ),
});

export default client;
