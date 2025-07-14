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

// Query to fetch departure destinations
export const GET_DEPARTURE_DESTINATIONS_QUERY = gql`
  query GetDepartureDestinations {
    routes(limit: 100) {
      departureAirportCode
      departureAirport
    }
  }
`;

// Query to fetch arrival destinations
export const GET_ARRIVAL_DESTINATIONS_QUERY = gql`
  query GetArrivalDestinations {
    routes(limit: 100) {
      arrivalAirport
      arrivalAirportCode
    }
  }
`;

export const GET_ARRIVAL_DESTINATIONS_FOR_ORIGIN_QUERY = gql`
  query GetArrivalDestinationsForOrigin($departureAirport: String!) {
    routes(limit: 100, searchQuery: $departureAirport) {
      arrivalAirport
      arrivalAirportCode
      departureAirport
      departureAirportCode
    }
  }
`;

export const GET_ORIGINS_FOR_ARRIVAL_DESTINATION_QUERY = gql`
  query GetOriginsForArrivalDestination($arrivalAirport: String!) {
    routes(limit: 100, searchQuery: $arrivalAirport) {
      departureAirport
      departureAirportCode
      arrivalAirport
      arrivalAirportCode
    }
  }
`;

/**
 * Fetches arrival destinations for a given origin (departure airport)
 * @param departureAirport - The departure airport name or code
 * @returns Promise with an array of distinct arrival airports for the given origin
 */
export async function fetchArrivalDestinationsForOrigin(
  departureAirport: string
): Promise<ArrivalAirport[]> {
  try {
    const { data } = await client.query({
      query: GET_ARRIVAL_DESTINATIONS_FOR_ORIGIN_QUERY,
      variables: { departureAirport },
    });

    const airports = data.routes || [];

    // Filter only those where the departureAirport matches the input
    const filtered = airports.filter(
      (route: any) =>
        route.departureAirport === departureAirport ||
        route.departureAirportCode === departureAirport
    );

    // Use a Map to track unique arrival airports by their code
    const uniqueAirportsMap = new Map<string, ArrivalAirport>();
    filtered.forEach((route: any) => {
      if (
        route.arrivalAirportCode &&
        !uniqueAirportsMap.has(route.arrivalAirportCode)
      ) {
        uniqueAirportsMap.set(route.arrivalAirportCode, {
          arrivalAirport: route.arrivalAirport,
          arrivalAirportCode: route.arrivalAirportCode,
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
 * Fetches origin airports for a given arrival destination
 * @param arrivalAirport - The arrival airport name or code
 * @returns Promise with an array of distinct departure airports for the given arrival destination
 */
export async function fetchOriginsForArrivalDestination(
  arrivalAirport: string
): Promise<DepartureAirport[]> {
  try {
    const { data } = await client.query({
      query: GET_ORIGINS_FOR_ARRIVAL_DESTINATION_QUERY,
      variables: { arrivalAirport },
    });

    const airports = data.routes || [];

    // Filter only those where the arrivalAirport matches the input
    const filtered = airports.filter(
      (route: any) =>
        route.arrivalAirport === arrivalAirport ||
        route.arrivalAirportCode === arrivalAirport
    );

    // Use a Map to track unique departure airports by their code
    const uniqueAirportsMap = new Map<string, DepartureAirport>();
    filtered.forEach((route: any) => {
      if (
        route.departureAirportCode &&
        !uniqueAirportsMap.has(route.departureAirportCode)
      ) {
        uniqueAirportsMap.set(route.departureAirportCode, {
          departureAirport: route.departureAirport,
          departureAirportCode: route.departureAirportCode,
        });
      }
    });

    return Array.from(uniqueAirportsMap.values()).sort((a, b) =>
      a.departureAirport.localeCompare(b.departureAirport)
    );
  } catch (error) {
    console.error("Error fetching origins for arrival destination:", error);
    return [];
  }
}

/**
 * Fetches all departure destinations from the server
 * @returns Promise with an array of distinct departure airports
 */
export async function fetchDepartureDestinations(): Promise<
  DepartureAirport[]
> {
  try {
    const { data } = await client.query({
      query: GET_DEPARTURE_DESTINATIONS_QUERY,
    });

    const airports = data.routes || [];

    // Use a Map to track unique airports by their code
    const uniqueAirportsMap = new Map<string, DepartureAirport>();

    // Add each airport to the map, using the airport code as key
    airports.forEach((airport: DepartureAirport) => {
      if (
        airport.departureAirportCode &&
        !uniqueAirportsMap.has(airport.departureAirportCode)
      ) {
        uniqueAirportsMap.set(airport.departureAirportCode, airport);
      }
    });

    // Convert the Map values back to an array and sort alphabetically by airport name
    return Array.from(uniqueAirportsMap.values()).sort((a, b) =>
      a.departureAirport.localeCompare(b.departureAirport)
    );
  } catch (error) {
    console.error("Error fetching departure destinations:", error);
    return [];
  }
}

/**
 * Fetches all arrival destinations from the server
 * @returns Promise with an array of distinct arrival airports
 */
export async function fetchArrivalDestinations(): Promise<ArrivalAirport[]> {
  try {
    const { data } = await client.query({
      query: GET_ARRIVAL_DESTINATIONS_QUERY,
    });

    const airports = data.routes || [];

    // Use a Map to track unique airports by their code
    const uniqueAirportsMap = new Map<string, ArrivalAirport>();

    // Add each airport to the map, using the airport code as key
    airports.forEach((airport: ArrivalAirport) => {
      if (
        airport.arrivalAirportCode &&
        !uniqueAirportsMap.has(airport.arrivalAirportCode)
      ) {
        uniqueAirportsMap.set(airport.arrivalAirportCode, airport);
      }
    });

    // Convert the Map values back to an array and sort alphabetically by airport name
    return Array.from(uniqueAirportsMap.values()).sort((a, b) =>
      a.arrivalAirport.localeCompare(b.arrivalAirport)
    );
  } catch (error) {
    console.error("Error fetching arrival destinations:", error);
    return [];
  }
}
