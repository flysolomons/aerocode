import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

// Interface for the HomePage itself
export interface HomePage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  seoTitle: string;
  belamaImage: {
    url: string;
  };
  specialRouteItems: Array<{
    specialRoute: {
      route: {
        nameFull: string;
        heroImage: {
          url: string;
        };
      };
      startingPrice: number;
      special: {
        name: string;
      };
    };
  }>;
  allYouNeedItems: Array<{
    pageDescription: string;
    pageUrl: string;
    pageHeroTitle: string;
    pageSvgIcon: {
      url: string;
    };
  }>;
  __typename?: string;
}

export interface Destination {
  heroImage: {
    url: string;
  };
  subTitle: string;
  url: string;
  country: string;
}

// Interface for the HomePage query response
export interface HomePageData {
  pages: HomePage[]; // Even though we only expect one, the API returns an array
  destinations: Destination[];
}

export const GET_HOMEPAGE = gql`
  query Pages {
    pages(contentType: "home.HomePage") {
      ... on HomePage {
        heroTitle
        heroImage {
          url
        }
        seoTitle
        belamaImage {
          url
        }
        specialRouteItems {
          specialRoute {
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
        allYouNeedItems {
          pageDescription
          pageUrl
          pageHeroTitle
          pageSvgIcon {
            url
          }
        }
      }
    }
    destinations {
      heroImage {
        url
      }
      subTitle
      url
      country
    }
  }
`;

export async function fetchHomePage(): Promise<HomePageData> {
  try {
    const { data } = await client.query<HomePageData>({
      query: GET_HOMEPAGE,
    });
    if (!data.pages[0]) {
      throw new Error("No homepage data found");
    }
    return data;
  } catch (error) {
    console.error("Error fetching HomePage data:", error);
    throw error;
  }
}
