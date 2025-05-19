import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client";

// Configure the cache with type policies for better cache handling
const cache = new InMemoryCache({
  typePolicies: {
    // You can customize this based on your Wagtail schema
    // This example assumes you have Page types from Wagtail
    Page: {
      // Fields that uniquely identify your entities (usually 'id')
      keyFields: ["id"],
      // Merge function to handle how incoming data is merged with existing cached data
      fields: {
        // For fields that are lists, you can define how they're merged
        // Example for handling lists of related items
        relatedPages: {
          merge(existing = [], incoming: any[]) {
            return [...incoming]; // Replace with incoming data
          },
        },
      },
    },
  },
});

// Create the Apollo Client instance
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:8000/api/graphql/", // Your Wagtail GraphQL endpoint
    // Disable caching of HTTP responses at network level
    // This ensures Apollo always validates with the network
    fetchOptions: {
      cache: "no-store",
    },
  }),
  cache,
  defaultOptions: {
    watchQuery: {
      // For all watched queries:
      fetchPolicy: "cache-and-network", // Use cache but always check network for updates
      nextFetchPolicy: "cache-first", // Use cache for subsequent refreshes if available
      // Enable polling - queries will automatically refetch at this interval (in ms)
      // Adjust as needed (e.g., 30000 for 30 seconds)
      pollInterval: 30000,
    },
    query: {
      fetchPolicy: "network-only", // Always get fresh data for one-time queries
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

export default client;
