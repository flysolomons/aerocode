import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for the ExploreIndexPage query response
export interface ExploreIndexPage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
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
  __typename?: string;
}

export const GET_EXPLORE_INDEX_PAGE_QUERY = gql`
  query GetExploreIndexPage {
    pages(contentType: "explore.ExploreIndexPage") {
      ... on ExploreIndexPage {
        heroTitle
        heroImage {
          url
        }
        url
        seoTitle
        description
      }
      children {
        url
        title
        ... on SpecialsIndexPage {
          heroImage {
            url
          }
        }
        ... on DestinationIndexPage {
          heroImage {
            url
          }
        }
        ... on WhereWeFly {
          heroImage {
            url
          }
        }
        ... on GenericPage {
          heroImage {
            url
          }
        }
      }
    }
  }
`;

export async function fetchExploreIndexPage(): Promise<ExploreIndexPage> {
  try {
    const { data } = await client.query({
      query: GET_EXPLORE_INDEX_PAGE_QUERY,
    });

    const pageData = data.pages.find(
      (page: any) => page.__typename === "ExploreIndexPage"
    ) || {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "Explore",
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
      description: "",
      children: [],
    };
  }
}
