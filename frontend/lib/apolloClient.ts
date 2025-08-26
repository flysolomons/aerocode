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

  // Build-time: Check if we're in a build environment and prefer external URL
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_GRAPHQL_URL
  ) {
    console.log(
      "🔧 Build-time: Using public GraphQL URL for static generation"
    );
    return process.env.NEXT_PUBLIC_GRAPHQL_URL;
  }

  // Server-side: Use GRAPHQL_URL for Node.js requests
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
      // Allow caching during build time for static generation
      // Only use no-store for runtime requests that need fresh data
      cache: typeof window !== "undefined" ? "no-store" : "default",
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
      // Allow caching during build time for static generation
      fetchPolicy:
        typeof window !== "undefined" ? "network-only" : "cache-first",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

// console.log("Apollo Client URL:", getGraphQLUrl());

export default client;
