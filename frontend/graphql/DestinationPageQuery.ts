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

// Interface for the Route
export interface Route {
  departureAirport: string;
  arrivalAirport: string;
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

    // Get the destination data
    const destination = data.destination;    return {
      heroTitle: destination.heroTitle || "",
      heroImage: destination.heroImage || { url: "/hero.jpg" },
      url: destination.url || "",
      seoTitle: destination.seoTitle || "",
      country: destination.country || "",
      reasonsToVisit: destination.reasonsToVisit || [],
      travelRequirements: destination.travelRequirements || [],
      routes: destination.routes || [],
      __typename: "Destination",
    };
  } catch (error) {
    console.error("Error fetching Destination page data:", error);
    return null;
  }
}
