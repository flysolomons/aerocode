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
  subTitle: string;
  description: string;
  __typename?: string;
  children?: ChildPage[];
}

export interface ChildPage {
  url: string;
  title: string;
  subTitle: string;
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
        subTitle
        description
      } 
      children {
        url
        title
        ... on SpecialsIndexPage {   
          subTitle
          heroImage {
            url
          }
        }
        ... on DestinationIndexPage {
          subTitle
          heroImage {
            url
          }
        }
        ... on WhereWeFly {
          subTitle
          heroImage {
            url
          }
        }
        ... on FlightSchedule {
          subTitle
          heroImage {
            url
          }
        }
        ... on GenericPage {
          subTitle
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

    const pageData = (data.pages.find(
      (page: any) => page.__typename === "ExploreIndexPage"
    ) as ExploreIndexPage) || {
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
