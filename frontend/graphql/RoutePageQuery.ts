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
  originPort: {
    city: string;
    code: string;
    name: string;
  };
  destinationPort: {
    city: string;
    code: string;
    name: string;
    destinationImage?: {
      url: string;
    };
  };
  fares?: Fare[];
  specialRoutes?: SpecialRoute[];
  rankedRelatedRoutes?: RankedRelatedRoute[];
  parent?: {
    country?: string;
  };
  __typename?: string;
}

// Interface for Route in search results
export interface RouteSearchResult {
  originPort: {
    city: string;
    code: string;
    name: string;
  };
  destinationPort: {
    city: string;
    code: string;
    name: string;
    destinationImage?: {
      url: string;
    };
  };
  url: string;
  name?: string;
  nameFull?: string;
  destinationCountry?: {
    country: string;
  };
  __typename?: string;
}

// Interface for ranked related routes
export interface RankedRelatedRoute {
  relatedRoute: RouteSearchResult;
}

export const GET_ROUTE_PAGE_QUERY = gql`
  query GetRoute($slug: String!) {
    route(slug: $slug) {
      originPort {
        city
        code
        name
      }
      destinationPort {
        city
        code
        name
        destinationImage {
          url
        }
      }
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
      rankedRelatedRoutes(limit: 100) {
        relatedRoute {
          originPort {
            city
            code
          }
          destinationPort {
            city
            code
          }
          url
          name
          nameFull
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
    routes(searchQuery: $airportCode, limit: 100) {
      originPort {
        city
        code
      }
      destinationPort {
        city
        code
      }
      url
      name
      nameFull
    }
  }
`;

export const GET_ROUTES_BY_FLIGHT_SCOPE_QUERY = gql`
  query GetRoutesByFlightScope($flightScope: String!) {
    routes(searchQuery: $flightScope) {
      originPort {
        city
        code
      }
      destinationPort {
        city
        code
      }
      url
      name
      nameFull
    }
  }
`;

export const GET_ROUTES_BY_COUNTRY_QUERY = gql`
  query GetRoutesByCountry($country: String!) {
    routes(searchQuery: $country) {
      originPort {
        city
        code
      }
      destinationPort {
        city
        code
      }
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
    // Order fares by Saver, Smart, Flexi, Business
    const fareOrder = ["Saver", "Smart", "Flexi", "Business"];
    const orderedFares = Array.isArray(route.fares)
      ? [...route.fares].sort((a, b) => {
          const aIndex = fareOrder.indexOf(a.fareFamily);
          const bIndex = fareOrder.indexOf(b.fareFamily);
          return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
        })
      : [];

    return {
      heroTitle: route.heroTitle || "",
      heroImage: route.heroImage || { url: "/hero.jpg" },
      url: route.url || "",
      seoTitle: route.seoTitle || "",
      subTitle: route.subTitle || "",
      description: route.description || "",
      name: route.name || "",
      nameFull: route.nameFull || "",
      originPort: {
        city: route.originPort?.city || "",
        code: route.originPort?.code || "",
        name: route.originPort?.name || "",
      },
      destinationPort: {
        city: route.destinationPort?.city || "",
        code: route.destinationPort?.code || "",
        name: route.destinationPort?.name || "",
        destinationImage: route.destinationPort?.destinationImage || undefined,
      },
      fares: orderedFares,
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
      rankedRelatedRoutes: (route.rankedRelatedRoutes || []).map(
        (rankedRoute: any) => ({
          relatedRoute: {
            originPort: {
              city: rankedRoute.relatedRoute?.originPort?.city || "",
              code: rankedRoute.relatedRoute?.originPort?.code || "",
              name: rankedRoute.relatedRoute?.originPort?.name || "",
            },
            destinationPort: {
              city: rankedRoute.relatedRoute?.destinationPort?.city || "",
              code: rankedRoute.relatedRoute?.destinationPort?.code || "",
              name: rankedRoute.relatedRoute?.destinationPort?.name || "",
            },
            url: rankedRoute.relatedRoute?.url || "",
            name: rankedRoute.relatedRoute?.name || "",
            nameFull: rankedRoute.relatedRoute?.nameFull || "",
          },
        })
      ),
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
