import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for the Route
export interface Route {
  departureAirport: string;
  arrivalAirport: string;
  departureAirportCode: string;
  arrivalAirportCode: string;
  url: string;
  name: string;
  nameFull: string;
}

// Interface for ranked routes
export interface RankedRoute {
  route: Route;
}

// Interface for the WhereWeFly query response
export interface WhereWeFlyPage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  subTitle: string;
  description: string;
  domesticRoutes: {
    url: string;
  };
  internationalRoutes: {
    url: string;
  };
  rankedInternationalRoutes: RankedRoute[];
  rankedDomesticRoutes: RankedRoute[];
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
        subTitle
        description
        domesticRoutes {
          url
        }
        internationalRoutes {
          url
        }
        rankedInternationalRoutes(limit: 100) {
          route {
            departureAirport
            arrivalAirport
            departureAirportCode
            arrivalAirportCode
            url
            name
            nameFull
          }
        }
        rankedDomesticRoutes(limit: 100) {
          route {
            departureAirport
            arrivalAirport
            departureAirportCode
            arrivalAirportCode
            url
            name
            nameFull
          }
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
    );

    if (!pageData) {
      return {
        heroTitle: "",
        heroImage: { url: "/default-hero.jpg" },
        url: "",
        seoTitle: "Where We Fly",
        subTitle: "",
        description: "",
        domesticRoutes: { url: "/hero2.jpg" },
        internationalRoutes: { url: "/image.jpg" },
        rankedInternationalRoutes: [],
        rankedDomesticRoutes: [],
      };
    }

    return {
      heroTitle: pageData.heroTitle || "",
      heroImage: pageData.heroImage || { url: "/default-hero.jpg" },
      url: pageData.url || "",
      seoTitle: pageData.seoTitle || "Where We Fly",
      subTitle: pageData.subTitle || "",
      description: pageData.description || "",
      domesticRoutes: pageData.domesticRoutes || { url: "/hero2.jpg" },
      internationalRoutes: pageData.internationalRoutes || { url: "/image.jpg" },
      rankedInternationalRoutes: (pageData.rankedInternationalRoutes || []).map((rankedRoute: any) => ({
        route: {
          departureAirport: rankedRoute.route?.departureAirport || "",
          arrivalAirport: rankedRoute.route?.arrivalAirport || "",
          departureAirportCode: rankedRoute.route?.departureAirportCode || "",
          arrivalAirportCode: rankedRoute.route?.arrivalAirportCode || "",
          url: rankedRoute.route?.url || "",
          name: rankedRoute.route?.name || "",
          nameFull: rankedRoute.route?.nameFull || "",
        },
      })),
      rankedDomesticRoutes: (pageData.rankedDomesticRoutes || []).map((rankedRoute: any) => ({
        route: {
          departureAirport: rankedRoute.route?.departureAirport || "",
          arrivalAirport: rankedRoute.route?.arrivalAirport || "",
          departureAirportCode: rankedRoute.route?.departureAirportCode || "",
          arrivalAirportCode: rankedRoute.route?.arrivalAirportCode || "",
          url: rankedRoute.route?.url || "",
          name: rankedRoute.route?.name || "",
          nameFull: rankedRoute.route?.nameFull || "",
        },
      })),
      __typename: "WhereWeFly",
    };
  } catch (error) {
    console.error("Error fetching Where We Fly page data:", error);
    return {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "Where We Fly",
      subTitle: "",
      description: "",
      domesticRoutes: { url: "/hero2.jpg" },
      internationalRoutes: { url: "/image.jpg" },
      rankedInternationalRoutes: [],
      rankedDomesticRoutes: [],
    };
  }
}
