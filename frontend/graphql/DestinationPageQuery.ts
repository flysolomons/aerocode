import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for the SectionBlock in reasonsToVisit
export interface SectionBlock {
  heading: string;
  text: string;
  image: {
    url: string;
  };
}

// Interface for the TravelRequirementBlock
export interface TravelRequirementBlock {
  title: string;
  description: string;
  svgIcon?: {
    url: string;
  };
  link?: string;
}

// Interface for Special Route in destination context
export interface DestinationSpecialRoute {
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

// Interface for the Route
export interface Route {
  departureAirport: string;
  arrivalAirport: string;
  url: string;
  specialRoutes?: DestinationSpecialRoute[];
}

// Interface for ranked routes
export interface RankedRoute {
  route: Route;
}

// Interface for the Destination page
export interface DestinationPage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  subTitle: string;
  description: string;
  country: string;
  reasonsToVisit: SectionBlock[];
  travelRequirements: TravelRequirementBlock[];
  rankedRoutes: RankedRoute[];
  __typename?: string;
}

export const GET_DESTINATION_PAGE_QUERY = gql`
  query GetDestination($slug: String!) {
    destination(slug: $slug) {
      heroTitle
      heroImage {
        url
      }
      url
      seoTitle
      description
      country
      reasonsToVisit {
        ... on SectionBlock {
          heading
          text
          image {
            url
          }
        }
      }
      travelRequirements {
        ... on TravelRequirementBlock {
          title
          description
          svgIcon {
            url
          }
          link
        }
      }
      rankedRoutes(limit: 100) {
        route {
          departureAirport
          arrivalAirport
          specialRoutes {
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
          url
        }
      }
    }
  }
`;

export async function fetchDestinationPage(
  slug: string
): Promise<DestinationPage | null> {
  try {
    const { data } = await client.query({
      query: GET_DESTINATION_PAGE_QUERY,
      variables: { slug },
    });

    if (!data.destination) {
      return null;
    }

    return {
      heroTitle: data.destination.heroTitle || "",
      heroImage: data.destination.heroImage || { url: "/hero.jpg" },
      url: data.destination.url || "",
      seoTitle: data.destination.seoTitle || "",
      subTitle: data.destination.subTitle || "",
      description: data.destination.description || "",
      country: data.destination.country || "",
      reasonsToVisit: data.destination.reasonsToVisit || [],
      travelRequirements: data.destination.travelRequirements || [],
      rankedRoutes: (data.destination.rankedRoutes || []).map(
        (rankedRoute: any) => ({
          route: {
            departureAirport: rankedRoute.route?.departureAirport || "",
            arrivalAirport: rankedRoute.route?.arrivalAirport || "",
            url: rankedRoute.route?.url || "",
            specialRoutes: (rankedRoute.route?.specialRoutes || [])
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
              })),
          },
        })
      ),
      __typename: "Destination",
    };
  } catch (error) {
    console.error("Error fetching Destination page data:", error);
    return null;
  }
}
