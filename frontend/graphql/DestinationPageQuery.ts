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
}

// Interface for Special Route in destination context
export interface DestinationSpecialRoute {
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
}

// Interface for the Route
export interface Route {
  departureAirport: string;
  arrivalAirport: string;
  specialRoutes?: DestinationSpecialRoute[];
}

// Interface for the Destination page
export interface DestinationPage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  country: string;
  reasonsToVisit: SectionBlock[];
  travelRequirements: TravelRequirementBlock[];
  routes: Route[];
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
        }
      }
      routes {
        departureAirport
        arrivalAirport
        specialRoutes {
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
    } // Get the destination data
    const destination = data.destination;

    // Process routes data to ensure specialRoutes is properly included
    const routes =
      destination.routes?.map((route: any) => ({
        departureAirport: route.departureAirport || "",
        arrivalAirport: route.arrivalAirport || "",
        specialRoutes: route.specialRoutes || [],
      })) || [];

    return {
      heroTitle: destination.heroTitle || "",
      heroImage: destination.heroImage || { url: "/hero.jpg" },
      url: destination.url || "",
      seoTitle: destination.seoTitle || "",
      country: destination.country || "",
      reasonsToVisit: destination.reasonsToVisit || [],
      travelRequirements: destination.travelRequirements || [],
      routes: routes,
      __typename: "Destination",
    };
  } catch (error) {
    console.error("Error fetching Destination page data:", error);
    return null;
  }
}
