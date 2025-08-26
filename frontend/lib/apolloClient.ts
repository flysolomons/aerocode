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
      cache: "default", // Allow HTTP caching for better performance
    },
  }),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      // Remove global polling - apply per query where needed
    },
    query: {
      fetchPolicy: "cache-first", // Better performance for static content
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

// console.log("Apollo Client URL:", getGraphQLUrl());

export default client;
