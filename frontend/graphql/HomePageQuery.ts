import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

// Interface for the HomePage itself
export interface HomePage {
  seoTitle: string;
  carouselSlides: Array<{
    slide: {
      title: string;
      image: {
        url: string;
      };
    };
    sortOrder: number;
  }>;
  belamaImage: {
    url: string;
  };
  specialRouteItems: Array<{
    specialRoute: {
      isExpired: string;
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
      currency?: {
        currencyCode: string;
        currencySymbol: string;
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
        seoTitle
        carouselSlides {
          slide {
            title
            image {
              url
            }
          }
          sortOrder
        }
        belamaImage {
          url
        }
        specialRouteItems {
          specialRoute {
            isExpired
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
            currency {
              currencyCode
              currencySymbol
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

    // Filter out expired special routes and sort carousel slides
    const filteredPages = data.pages.map((page) => ({
      ...page,
      carouselSlides: page.carouselSlides ? [...page.carouselSlides].sort((a, b) => a.sortOrder - b.sortOrder) : [],
      specialRouteItems:
        page.specialRouteItems?.filter(
          (item) => item.specialRoute.isExpired !== "true"
        ) || [],
    }));

    return {
      ...data,
      pages: filteredPages,
    };
  } catch (error) {
    console.error("Error fetching HomePage data:", error);
    throw error;
  }
}
