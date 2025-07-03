import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for Fare details
export interface Fare {
  fareFamily: string;
  price: string;
  tripType: string;
  currency: string;
}

// Interface for Special Routes
export interface SpecialRoute {
  isExpired: string;
  special: {
    name: string;
  };
  route?: {
    nameFull: string;
    heroImage?: {
      url: string;
    };
  };
  startingPrice?: string;
  currency?: {
    currencyCode: string;
    currencySymbol: string;
  };
}

// Interface for the Route page
export interface RoutePage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  subTitle: string;
  description: string;
  name?: string;
  nameFull?: string;
  departureAirport: string;
  arrivalAirport: string;
  departureAirportCode: string;
  arrivalAirportCode: string;
  fares?: Fare[];
  specialRoutes?: SpecialRoute[];
  parent?: {
    country?: string;
  };
  __typename?: string;
}

// Interface for Route in search results
export interface RouteSearchResult {
  departureAirport: string;
  arrivalAirport: string;
  departureAirportCode: string;
  arrivalAirportCode: string;
  url: string;
  name?: string;
  nameFull?: string;
  destinationCountry?: {
    country: string;
  };
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
      subTitle
      description
      url
      name
      nameFull
      fares {
        fareFamily
        price
        tripType
        currency
      }
      specialRoutes(limit: 100) {
        isExpired
        special {
          name
        }
        route {
          nameFull
          heroImage {
            url
          }
        }
        startingPrice
        currency {
          currencyCode
          currencySymbol
        }
      }
      parent {
        ... on Destination {
          country
        }
      }
    }
  }
`;

export const GET_ROUTES_BY_DESTINATION_CODE_QUERY = gql`
  query GetRoutesByDestinationCode($airportCode: String!) {
    routes(searchQuery: $airportCode) {
      departureAirport
      arrivalAirport
      departureAirportCode
      arrivalAirportCode
      url
      name
      nameFull
    }
  }
`;

export const GET_ROUTES_BY_FLIGHT_SCOPE_QUERY = gql`
  query GetRoutesByFlightScope($flightScope: String!) {
    routes(searchQuery: $flightScope) {
      departureAirport
      arrivalAirport
      departureAirportCode
      arrivalAirportCode
      url
      name
      nameFull
    }
  }
`;

export const GET_ROUTES_BY_COUNTRY_QUERY = gql`
  query GetRoutesByCountry($country: String!) {
    routes(searchQuery: $country) {
      departureAirport
      arrivalAirport
      departureAirportCode
      arrivalAirportCode
      url
      name
      nameFull
      destinationCountry {
        country
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
    } // Get the route data
    const route = data.route;
    return {
      heroTitle: route.heroTitle || "",
      heroImage: route.heroImage || { url: "/hero.jpg" },
      url: route.url || "",
      seoTitle: route.seoTitle || "",
      subTitle: route.subTitle || "",
      description: route.description || "",
      name: route.name || "",
      nameFull: route.nameFull || "",
      departureAirport: route.departureAirport || "",
      arrivalAirport: route.arrivalAirport || "",
      departureAirportCode: route.departureAirportCode || "",
      arrivalAirportCode: route.arrivalAirportCode || "",
      fares: route.fares || [],
      specialRoutes: route.specialRoutes
        ? route.specialRoutes
            .filter((sr: any) => sr.isExpired !== "true")
            .map((sr: any) => ({
              isExpired: sr.isExpired || "",
              special: {
                name: sr.special?.name || "",
              },
              route: sr.route
                ? {
                    nameFull: sr.route.nameFull || "",
                    heroImage: sr.route.heroImage || { url: "/image.jpg" },
                  }
                : undefined,
              startingPrice: sr.startingPrice || "",
              currency: sr.currency
                ? {
                    currencyCode: sr.currency.currencyCode || "",
                    currencySymbol: sr.currency.currencySymbol || "",
                  }
                : undefined,
            }))
        : [],
      parent: route.parent ? { country: route.parent.country } : undefined,
      __typename: "Route",
    };
  } catch (error) {
    console.error("Error fetching Route page data:", error);
    return null;
  }
}

export async function fetchRoutesByDestination(
  airportCode: string
): Promise<RouteSearchResult[]> {
  try {
    const { data } = await client.query({
      query: GET_ROUTES_BY_DESTINATION_CODE_QUERY,
      variables: { airportCode },
    });
    return data.routes || [];
  } catch (error) {
    console.error("Error fetching routes by destination:", error);
    return [];
  }
}

export async function fetchRoutesByCountry(
  country: string
): Promise<RouteSearchResult[]> {
  try {
    const { data } = await client.query({
      query: GET_ROUTES_BY_COUNTRY_QUERY,
      variables: { country },
    });
    return data.routes || [];
  } catch (error) {
    console.error("Error fetching routes by country:", error);
    return [];
  }
}

export async function fetchRoutesByFlightScope(
  flightScope: string
): Promise<RouteSearchResult[]> {
  try {
    const { data } = await client.query({
      query: GET_ROUTES_BY_FLIGHT_SCOPE_QUERY,
      variables: { flightScope },
    });
    return data.routes || [];
  } catch (error) {
    console.error("Error fetching routes by flight scope:", error);
    return [];
  }
}
