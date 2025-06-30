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

// Interface for TravelPeriod in SpecialPage
export interface TravelPeriod {
  startDate: string;
  endDate: string;
}

// Interface for the Special page
export interface SpecialPage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  subTitle: string;
  description: string;
  name: string;
  startDate: string;
  endDate: string;
  bookingClass?: string;
  discount?: string;
  tripType?: string;
  flightScope?: string;
  travelPeriods?: TravelPeriod[];
  termsAndConditions: string;
  specialRoutes: SpecialRoute[];
  specials: SpecialSummary[]; // Add specials to SpecialPage
  __typename?: string;
}

// Interface for summary specials (used in specials array)
export interface SpecialSummary {
  name: string;
  endDate: string;
  subTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
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
      subTitle
      description
      name
      startDate
      endDate
      bookingClass
      discount
      tripType
      flightScope
      travelPeriods {
        ... on PeriodBlock {
          endDate
          startDate
        }
      }
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
    specials {
      name
      endDate
      subTitle
      heroImage {
        url
      }
      url
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
    // Get the specials array
    const specials: SpecialSummary[] = (data.specials || []).map((s: any) => ({
      name: s.name || "",
      endDate: s.endDate || "",
      subTitle: s.subTitle || "",
      heroImage: s.heroImage || { url: "/hero.jpg" },
      url: s.url || "",
    }));
    return {
      heroTitle: special.heroTitle || "",
      heroImage: special.heroImage || { url: "/hero.jpg" },
      url: special.url || "",
      seoTitle: special.seoTitle || "",
      subTitle: special.subTitle || "",
      description: special.description || "",
      name: special.name || "",
      startDate: special.startDate || "",
      endDate: special.endDate || "",
      bookingClass: special.bookingClass || "",
      discount: special.discount || "",
      tripType: special.tripType || "",
      flightScope: special.flightScope || "",
      travelPeriods:
        special.travelPeriods?.map((period: any) => ({
          startDate: period.startDate || "",
          endDate: period.endDate || "",
        })) || [],
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
      specials,
      __typename: "Special",
    };
  } catch (error) {
    console.error("Error fetching Special page data:", error);
    return null;
  }
}
