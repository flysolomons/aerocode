import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for Special
export interface Special {
  name: string;
  heroImage: {
    url: string;
  };
  url: string; // URL is required, not optional
  __typename?: string;
}

// Interface for Page metadata
export interface PageMetadata {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  description: string;
  __typename?: string;
}

// Interface for SpecialsIndexPage
export interface SpecialsIndexPage {
  pageMetadata?: PageMetadata;
  specials: Special[];
  __typename?: string;
}

export const GET_SPECIALS_INDEX_PAGE_QUERY = gql`
  query GetSpecials {
    pages(contentType: "explore.SpecialsIndexPage") {
      ... on SpecialsIndexPage {
        heroTitle
        heroImage {
          url
        }
        url
        seoTitle
        description
      }
    }
    specials {
      name
      heroImage {
        url
      }
      url
    }
  }
`;

export async function fetchSpecialsIndexPage(): Promise<SpecialsIndexPage> {
  try {
    const { data } = await client.query({
      query: GET_SPECIALS_INDEX_PAGE_QUERY,
    }); // Get the page metadata from the pages query
    const pageMetadata = data.pages?.find(
      (page: any) => page.__typename === "SpecialsIndexPage"
    ) || {
      heroTitle: "Specials",
      heroImage: { url: "/hero.jpg" },
      url: "/explores/specials",
      seoTitle: "Specials",
      description: "",
      __typename: "SpecialsIndexPage",
    };

    // Return both page metadata and specials data
    return {
      pageMetadata,
      specials:
        data.specials?.map((special: any) => ({
          name: special.name || "",
          heroImage: special.heroImage || { url: "/default-special.jpg" },
          url: special.url || "",
          __typename: "Special",
        })) || [],
      __typename: "SpecialsIndexPage",
    };
  } catch (error) {
    console.error("Error fetching Specials Index page data:", error);
    return {
      pageMetadata: {
        heroTitle: "Specials",
        heroImage: { url: "/hero.jpg" },
        url: "/explores/specials",
        seoTitle: "Specials",
        description: "",
        __typename: "SpecialsIndexPage",
      },
      specials: [],
      __typename: "SpecialsIndexPage",
    };
  }
}
