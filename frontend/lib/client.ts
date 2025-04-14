import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql/',
});

let client: ApolloClient<any> | null = null;

export function getClient() {
  if (!client) {
    client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    });
  }
  return client;
}

export default getClient; 