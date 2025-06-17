import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for Route in SpecialRoute
export interface SpecialRouteRoute {
  nameFull: string;
  heroImage?: {
    url: string;
  };
}

// Interface for Special in SpecialRoute
export interface SpecialRouteSpecial {
  name: string;
}

// Interface for SpecialRoute
export interface SpecialRoute {
  route: SpecialRouteRoute;
  special: SpecialRouteSpecial;
  startingPrice: string;
}

// Interface for the Special page
export interface SpecialPage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  description: string;
  name: string;
  startDate: string;
  endDate: string;
  termsAndConditions: string;
  specialRoutes: SpecialRoute[];
  __typename?: string;
}

export const GET_SPECIAL_PAGE_QUERY = gql`
  query GetSpecial($slug: String!) {
    special(slug: $slug) {
      heroTitle
      heroImage {
        url
      }
      url
      seoTitle
      description
      name
      startDate
      endDate
      termsAndConditions
      specialRoutes {
        route {
          nameFull
          heroImage {
            url
          }
        }
        special {
          name
        }
        startingPrice
      }
    }
  }
`;

export async function fetchSpecialPage(
  slug: string
): Promise<SpecialPage | null> {
  try {
    const { data } = await client.query({
      query: GET_SPECIAL_PAGE_QUERY,
      variables: { slug },
    });

    if (!data.special) {
      return null;
    } // Get the special data
    const special = data.special;
    return {
      heroTitle: special.heroTitle || "",
      heroImage: special.heroImage || { url: "/hero.jpg" },
      url: special.url || "",
      seoTitle: special.seoTitle || "",
      description: special.description || "",
      name: special.name || "",
      startDate: special.startDate || "",
      endDate: special.endDate || "",
      termsAndConditions: special.termsAndConditions || "",
      specialRoutes:
        special.specialRoutes?.map((route: any) => ({
          route: {
            nameFull: route.route?.nameFull || "",
            heroImage: route.route?.heroImage || { url: "/image.jpg" },
          },
          special: {
            name: route.special?.name || "",
          },
          startingPrice: route.startingPrice || "0",
        })) || [],
      __typename: "Special",
    };
  } catch (error) {
    console.error("Error fetching Special page data:", error);
    return null;
  }
}
