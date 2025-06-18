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
