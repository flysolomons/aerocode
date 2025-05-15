import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for Fare details
export interface Fare {
  fareFamily: string;
  price: string;
  tripType: string;
  currency: string;
}

// Interface for the Route page
export interface RoutePage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  name?: string;
  nameFull?: string;
  departureAirport: string;
  arrivalAirport: string;
  departureAirportCode: string;
  arrivalAirportCode: string;
  fares?: Fare[];
  __typename?: string;
}

export const GET_ROUTE_PAGE_QUERY = gql`
  query GetRoute($slug: String!) {
    route(slug: $slug) {
      departureAirport
      arrivalAirport
      departureAirportCode
      arrivalAirportCode
      heroTitle
      heroImage {
        url
      }
      seoTitle
      url
      name
      nameFull
      fares {
        fareFamily
        price
        tripType
        currency
      }
    }
  }
`;

export async function fetchRoutePage(slug: string): Promise<RoutePage | null> {
  try {
    const { data } = await client.query({
      query: GET_ROUTE_PAGE_QUERY,
      variables: { slug },
    });

    if (!data.route) {
      return null;
    }

    // Get the route data
    const route = data.route;
    return {
      heroTitle: route.heroTitle || "",
      heroImage: route.heroImage || { url: "/hero.jpg" },
      url: route.url || "",
      seoTitle: route.seoTitle || "",
      name: route.name || "",
      nameFull: route.nameFull || "",
      departureAirport: route.departureAirport || "",
      arrivalAirport: route.arrivalAirport || "",
      departureAirportCode: route.departureAirportCode || "",
      arrivalAirportCode: route.arrivalAirportCode || "",
      fares: route.fares || [],
      __typename: "Route",
    };
  } catch (error) {
    console.error("Error fetching Route page data:", error);
    return null;
  }
}
