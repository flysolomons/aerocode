import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for the DestinationIndexPage query response
export interface DestinationIndexPage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  subTitle: string;
  description: string;
  __typename?: string;
  children?: ChildPage[];
}

export interface ChildPage {
  url: string;
  title: string;
  heroImage?: {
    url: string;
  };
  country: string;
  __typename?: string;
}

export interface Destination {
  country: string;
  heroImage: {
    url: string;
  };
  url: string;
  heroTitle: string;
}

export const GET_DESTINATION_INDEX_PAGE_QUERY = gql`
  query GetDestinationIndexPage {
    pages(contentType: "explore.DestinationIndexPage") {
      ... on DestinationIndexPage {
        heroTitle
        heroImage {
          url
        }
        url
        seoTitle
        subTitle
        description
      }
      children {
        url
        title
        ... on Destination {
          heroImage {
            url
          }
          country
        }
      }
    }
  }
`;

export const GET_ALL_DESTINATIONS_QUERY = gql`
  query Destinations {
    destinations {
      country
      heroImage {
        url
      }
      heroTitle
      url
    }
  }
`;

export async function fetchDestinationIndexPage(): Promise<DestinationIndexPage> {
  try {
    const { data } = await client.query({
      query: GET_DESTINATION_INDEX_PAGE_QUERY,
    });

    const pageData = data.pages.find(
      (page: any) => page.__typename === "DestinationIndexPage"
    ) || {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "Explore",
      subTitle: "",
      description: "",
      children: [],
    };

    return pageData;
  } catch (error) {
    console.error("Error fetching Explore page data:", error);
    return {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "Explore",
      subTitle: "",
      description: "",
      children: [],
    };
  }
}

export async function fetchAllDestinations(): Promise<Destination[]> {
  try {
    const { data } = await client.query({
      query: GET_ALL_DESTINATIONS_QUERY,
    });
    return data.destinations || [];
  } catch (error) {
    console.error("Error fetching all destinations:", error);
    return [];
  }
}
