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
  name: string;
  nameFull: string;
  url: string;
  heroImage?: {
    url: string;
  };
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
  subTitle: string;
  description: string;
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
      routes: data.destination.routes || [],
      __typename: "Destination",
    };
  } catch (error) {
    console.error("Error fetching Destination page data:", error);
    return null;
  }
}
