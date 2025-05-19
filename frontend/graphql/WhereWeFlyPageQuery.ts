import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for the WhereWeFly query response
export interface WhereWeFlyPage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  description: string;
  domesticRoutes: {
    url: string;
  };
  internationalRoutes: {
    url: string;
  };
  __typename?: string;
}

export const GET_WHERE_WE_FLY_PAGE_QUERY = gql`
  query GetWhereWeFlyPage {
    pages(contentType: "explore.WhereWeFly") {
      ... on WhereWeFly {
        heroTitle
        heroImage {
          url
        }
        url
        seoTitle
        description
        domesticRoutes {
          url
        }
        internationalRoutes {
          url
        }
      }
    }
  }
`;

export async function fetchWhereWeFlyPage(): Promise<WhereWeFlyPage> {
  try {
    const { data } = await client.query({
      query: GET_WHERE_WE_FLY_PAGE_QUERY,
    });
    const pageData = data.pages.find(
      (page: any) => page.__typename === "WhereWeFly"
    ) || {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "Where We Fly",
      description: "",
      domesticRoutes: { url: "/hero2.jpg" },
      internationalRoutes: { url: "/image.jpg" },
    };

    return pageData;
  } catch (error) {
    console.error("Error fetching Where We Fly page data:", error);
    return {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "Where We Fly",
      description: "",
      domesticRoutes: { url: "/hero2.jpg" },
      internationalRoutes: { url: "/image.jpg" },
    };
  }
}
