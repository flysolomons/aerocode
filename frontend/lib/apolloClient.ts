// frontend/lib/apolloClient.js
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client";

// Function to determine the GraphQL URL based on context
const getGraphQLUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: Use NEXT_PUBLIC_GRAPHQL_URL for browser requests
    return process.env.NEXT_PUBLIC_GRAPHQL_URL;
  }
  // Server-side: Use GRAPHQL_URL for Node.js requests
  console.log("using process.env.GRAPHQL_URL: " + process.env.GRAPHQL_URL);
  return process.env.GRAPHQL_URL;
};

// Configure the cache with type policies for better cache handling
const cache = new InMemoryCache({
  typePolicies: {
    Page: {
      keyFields: ["id"],
      fields: {
        relatedPages: {
          merge(existing = [], incoming: any[]) {
            return [...incoming];
          },
        },
      },
    },
  },
});

// Create the Apollo Client instance
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: new HttpLink({
    uri: getGraphQLUrl(), // Use dynamic URL
    fetchOptions: {
      cache: "no-store",
    },
  }),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      pollInterval: 30000,
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

// console.log("Apollo Client URL:", getGraphQLUrl());

export default client;
