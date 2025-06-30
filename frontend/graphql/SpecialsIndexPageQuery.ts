import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for SpecialRoute inside a special
export interface SpecialRouteSummary {
  route: {
    nameFull: string;
    heroImage?: {
      url: string;
    };
  };
  startingPrice: string;
  special: {
    name: string;
  };
}

// Interface for Special
export interface Special {
  name: string;
  heroImage: {
    url: string;
  };
  url: string;
  subTitle?: string;
  endDate?: string;
  specialRoutes?: SpecialRouteSummary[];
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
  subTitle: string;
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
        subTitle
        description
      }
    }
    specials {
      name
      heroImage {
        url
      }
      url
      subTitle
      endDate
      specialRoutes {
        route {
          nameFull
          heroImage {
            url
          }
        }
        startingPrice
        special {
          name
        }
      }
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
      subTitle: "",
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
          subTitle: special.subTitle || "",
          endDate: special.endDate || "",
          specialRoutes:
            special.specialRoutes?.map((route: any) => ({
              route: {
                nameFull: route.route?.nameFull || "",
                heroImage: route.route?.heroImage || {
                  url: "/default-special.jpg",
                },
              },
              startingPrice: route.startingPrice || "",
              special: {
                name: route.special?.name || "",
              },
            })) || [],
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
        subTitle: "",
        description: "",
        __typename: "SpecialsIndexPage",
      },
      specials: [],
      __typename: "SpecialsIndexPage",
    };
  }
}
