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

// Interface for port pair data
export interface PortPair {
  originPortCode: string;
  originPortName: string;
  destinationPortCode: string;
  destinationPortName: string;
  __typename?: string;
}

// Query to fetch port pairs
export const GET_PORT_PAIRS_QUERY = gql`
  query GetPortPairs {
    portPairs(limit: 100) {
      originPortCode
      destinationPortCode
      originPortName
      destinationPortName
    }
  }
`;

// Cache for port pairs data to avoid repeated API calls
let portPairsCache: PortPair[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Internal function to get port pairs data with caching
 */
async function getCachedPortPairs(): Promise<PortPair[]> {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (portPairsCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
    return portPairsCache;
  }
  // console.log(
  //   "Running on:",
  //   typeof window !== "undefined" ? "CLIENT" : "SERVER"
  // );
  // console.log("Client URL is:", (client.link as any).options?.uri);

  // Fetch fresh data
  try {
    const { data } = await client.query({
      query: GET_PORT_PAIRS_QUERY,
      fetchPolicy: "cache-first", // Use Apollo cache when possible
    });

    portPairsCache = data.portPairs || [];
    cacheTimestamp = now;
    return portPairsCache;
  } catch (error) {
    console.error("Error fetching port pairs:", error);
    return portPairsCache; // Return current cache (empty array if no data)
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
    const portPairs = await getCachedPortPairs();

    // Use a Map to track unique destination airports by their code
    const uniqueAirportsMap = new Map<string, ArrivalAirport>();

    portPairs.forEach((pair: PortPair) => {
      // Find pairs that start from the selected airport (by code or name)
      if (
        pair.originPortCode === departureAirport ||
        pair.originPortName === departureAirport
      ) {
        uniqueAirportsMap.set(pair.destinationPortCode, {
          arrivalAirport: pair.destinationPortName,
          arrivalAirportCode: pair.destinationPortCode,
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
    const portPairs = await getCachedPortPairs();

    // Use a Map to track unique airports by their code
    const uniqueAirportsMap = new Map<string, Airport>();

    // Add airports from both origin and destination fields
    portPairs.forEach((pair: PortPair) => {
      // Add origin airport
      if (pair.originPortCode && !uniqueAirportsMap.has(pair.originPortCode)) {
        uniqueAirportsMap.set(pair.originPortCode, {
          airport: pair.originPortName,
          airportCode: pair.originPortCode,
        });
      }
      // Add destination airport
      if (
        pair.destinationPortCode &&
        !uniqueAirportsMap.has(pair.destinationPortCode)
      ) {
        uniqueAirportsMap.set(pair.destinationPortCode, {
          airport: pair.destinationPortName,
          airportCode: pair.destinationPortCode,
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
