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

// New interface for Airport model data
export interface AirportData {
  code: string;
  name: string;
  city: string;
  __typename?: string;
}

// Query to fetch all airports directly from Airport model
export const GET_ALL_AIRPORTS_QUERY = gql`
  query GetAllAirports {
    airports(limit: 100) {
      code
      name
      city
    }
  }
`;

// Query to fetch destinations for a given port
export const GET_DESTINATIONS_FOR_PORT_QUERY = gql`
  query GetDestinationsForPort($searchQuery: String!) {
    portPairs(searchQuery: $searchQuery, limit: 100) {
      destinationPortCode
      destinationPortName
    }
  }
`;

// Cache for airports data to avoid repeated API calls
let airportsCache: AirportData[] = [];
let airportsCacheTimestamp: number = 0;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Internal function to get airports data with caching
 */
async function getCachedAirports(): Promise<AirportData[]> {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (
    airportsCache.length > 0 &&
    now - airportsCacheTimestamp < CACHE_DURATION
  ) {
    return airportsCache;
  }

  // Fetch fresh data
  try {
    const { data } = await client.query({
      query: GET_ALL_AIRPORTS_QUERY,
      fetchPolicy: "cache-first", // Use Apollo cache when possible
    });

    airportsCache = data.airports || [];
    airportsCacheTimestamp = now;
    return airportsCache;
  } catch (error) {
    console.error("Error fetching airports:", error);
    return airportsCache; // Return current cache (empty array if no data)
  }
}

/**
 * Function to fetch arrival destinations for a given origin airport
 * @param departureAirport - The departure airport code
 * @returns Promise with an array of arrival airports for the given origin
 */
export async function fetchArrivalDestinationsForOrigin(
  departureAirport: string
): Promise<ArrivalAirport[]> {
  try {
    const { data } = await client.query({
      query: GET_DESTINATIONS_FOR_PORT_QUERY,
      variables: { searchQuery: departureAirport },
      fetchPolicy: "cache-first",
    });

    const destinations = data.portPairs || [];

    return destinations
      .map((destination: any) => ({
        arrivalAirport: destination.destinationPortName,
        arrivalAirportCode: destination.destinationPortCode,
      }))
      .sort((a: ArrivalAirport, b: ArrivalAirport) =>
        a.arrivalAirport.localeCompare(b.arrivalAirport)
      );
  } catch (error) {
    console.error("Error fetching arrival destinations for origin:", error);
    return [];
  }
}

/**
 * Optimized function to fetch all airports from Airport model
 * Uses cached data to avoid repeated API calls
 * @returns Promise with an array of airports with code, name, and city
 */
export async function fetchAllAirports(): Promise<AirportData[]> {
  try {
    const airports = await getCachedAirports();

    // Create a new array and sort alphabetically by city name
    return [...airports].sort((a, b) => a.city.localeCompare(b.city));
  } catch (error) {
    console.error("Error fetching all airports:", error);
    return [];
  }
}
