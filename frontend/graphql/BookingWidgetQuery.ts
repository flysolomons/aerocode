import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interfaces for the Departure and Arrival Airports
export interface DepartureAirport {
  departureAirport: string;
  departureAirportCode: string;
  __typename?: string;
}

export interface ArrivalAirport {
  arrivalAirport: string;
  arrivalAirportCode: string;
  __typename?: string;
}

// Generic airport interface for merged function
export interface Airport {
  airport: string;
  airportCode: string;
  __typename?: string;
}

// Single optimized query to fetch all route data
export const GET_ALL_ROUTES_QUERY = gql`
  query GetAllRoutes {
    routes(limit: 1000) {
      departureAirport
      departureAirportCode
      arrivalAirport
      arrivalAirportCode
    }
  }
`;

// Cache for routes data to avoid repeated API calls
let routesCache: any[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Internal function to get routes data with caching
 */
async function getCachedRoutes(): Promise<any[]> {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (routesCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
    return routesCache;
  }
  // console.log(
  //   "Running on:",
  //   typeof window !== "undefined" ? "CLIENT" : "SERVER"
  // );
  // console.log("Client URL is:", (client.link as any).options?.uri);

  // Fetch fresh data
  try {
    const { data } = await client.query({
      query: GET_ALL_ROUTES_QUERY,
      fetchPolicy: "cache-first", // Use Apollo cache when possible
    });

    routesCache = data.routes || [];
    cacheTimestamp = now;
    return routesCache;
  } catch (error) {
    console.error("Error fetching routes:", error);
    return routesCache; // Return current cache (empty array if no data)
  }
}

/**
 * Optimized function to fetch arrival destinations for a given origin (supports bidirectional routing)
 * Uses cached route data to avoid repeated API calls
 * @param departureAirport - The departure airport name or code
 * @returns Promise with an array of distinct arrival airports for the given origin
 */
export async function fetchArrivalDestinationsForOrigin(
  departureAirport: string
): Promise<ArrivalAirport[]> {
  try {
    const routes = await getCachedRoutes();

    // Use a Map to track unique destination airports by their code
    const uniqueAirportsMap = new Map<string, ArrivalAirport>();

    routes.forEach((route: any) => {
      // Case 1: Selected airport is departure airport → add arrival airport as destination
      if (
        (route.departureAirport === departureAirport ||
          route.departureAirportCode === departureAirport) &&
        route.arrivalAirportCode &&
        !uniqueAirportsMap.has(route.arrivalAirportCode)
      ) {
        uniqueAirportsMap.set(route.arrivalAirportCode, {
          arrivalAirport: route.arrivalAirport,
          arrivalAirportCode: route.arrivalAirportCode,
        });
      }

      // Case 2: Selected airport is arrival airport → add departure airport as destination (bidirectional)
      if (
        (route.arrivalAirport === departureAirport ||
          route.arrivalAirportCode === departureAirport) &&
        route.departureAirportCode &&
        !uniqueAirportsMap.has(route.departureAirportCode)
      ) {
        uniqueAirportsMap.set(route.departureAirportCode, {
          arrivalAirport: route.departureAirport,
          arrivalAirportCode: route.departureAirportCode,
        });
      }
    });

    return Array.from(uniqueAirportsMap.values()).sort((a, b) =>
      a.arrivalAirport.localeCompare(b.arrivalAirport)
    );
  } catch (error) {
    console.error("Error fetching arrival destinations for origin:", error);
    return [];
  }
}

/**
 * Optimized function to fetch all airports (uses cached data)
 * @returns Promise with an array of distinct airports
 */
export async function fetchAllAirports(): Promise<Airport[]> {
  try {
    const routes = await getCachedRoutes();

    // Use a Map to track unique airports by their code
    const uniqueAirportsMap = new Map<string, Airport>();

    // Add airports from both departure and arrival fields
    routes.forEach((route: any) => {
      // Add departure airport
      if (
        route.departureAirportCode &&
        !uniqueAirportsMap.has(route.departureAirportCode)
      ) {
        uniqueAirportsMap.set(route.departureAirportCode, {
          airport: route.departureAirport,
          airportCode: route.departureAirportCode,
        });
      }
      // Add arrival airport
      if (
        route.arrivalAirportCode &&
        !uniqueAirportsMap.has(route.arrivalAirportCode)
      ) {
        uniqueAirportsMap.set(route.arrivalAirportCode, {
          airport: route.arrivalAirport,
          airportCode: route.arrivalAirportCode,
        });
      }
    });

    // Convert the Map values back to an array and sort alphabetically by airport name
    return Array.from(uniqueAirportsMap.values()).sort((a, b) =>
      a.airport.localeCompare(b.airport)
    );
  } catch (error) {
    console.error("Error fetching all airports:", error);
    return [];
  }
}
