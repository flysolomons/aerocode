
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
    pages(contentType: "explore.Route") {
      ... on Route {
        departureAirport
        departureAirportCode
      }
    }
  }
`;

// Query to fetch arrival destinations
export const GET_ARRIVAL_DESTINATIONS_QUERY = gql`
  query GetArrivalDestinations {
    pages(contentType: "explore.Route") {
      ... on Route {
        arrivalAirport
        arrivalAirportCode
      }
    }
  }
`;

/**
 * Fetches all departure destinations from the server
 * @returns Promise with an array of distinct departure airports
 */
export async function fetchDepartureDestinations(): Promise<DepartureAirport[]> {
  try {
    const { data } = await client.query({
      query: GET_DEPARTURE_DESTINATIONS_QUERY,
    });

    const airports = data.pages || [];
    
    // Use a Map to track unique airports by their code
    const uniqueAirportsMap = new Map<string, DepartureAirport>();
    
    // Add each airport to the map, using the airport code as key
    airports.forEach((airport: DepartureAirport) => {
      if (airport.departureAirportCode && !uniqueAirportsMap.has(airport.departureAirportCode)) {
        uniqueAirportsMap.set(airport.departureAirportCode, airport);
      }
    });
    
    // Convert the Map values back to an array and sort alphabetically by airport name
    return Array.from(uniqueAirportsMap.values())
      .sort((a, b) => a.departureAirport.localeCompare(b.departureAirport));
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

    const airports = data.pages || [];
    
    // Use a Map to track unique airports by their code
    const uniqueAirportsMap = new Map<string, ArrivalAirport>();
    
    // Add each airport to the map, using the airport code as key
    airports.forEach((airport: ArrivalAirport) => {
      if (airport.arrivalAirportCode && !uniqueAirportsMap.has(airport.arrivalAirportCode)) {
        uniqueAirportsMap.set(airport.arrivalAirportCode, airport);
      }
    });
    
    // Convert the Map values back to an array and sort alphabetically by airport name
    return Array.from(uniqueAirportsMap.values())
      .sort((a, b) => a.arrivalAirport.localeCompare(b.arrivalAirport));
  } catch (error) {
    console.error("Error fetching arrival destinations:", error);
    return [];
  }
}