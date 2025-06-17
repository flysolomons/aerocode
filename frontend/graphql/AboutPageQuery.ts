import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

// Interface for image objects
export interface ImageBlock {
  url: string;
}

// Interface for ValueCardBlock
export interface ValueCardBlock {
  title: string;
  description: string;
  image: ImageBlock;
}

// Interface for StatBlock
export interface StatBlock {
  title: string;
  value: string;
}

// Interface for JourneyItemBlock
export interface JourneyItemBlock {
  title: string;
  description: string;
  year: string;
}

// Interface for the AboutIndexPage
export interface AboutIndexPage {
  heroTitle: string;
  heroImage: ImageBlock;
  seoTitle: string;
  url: string;
  description: string;
  missionStatement: string;
  visionStatement: string;
  values: ValueCardBlock[];
  stats: StatBlock[];
  journey: JourneyItemBlock[];
  callToActionImage?: ImageBlock;
  __typename?: string;
}

// Interface for the About page query response
export interface AboutPageData {
  pages: AboutIndexPage[];
}

export const GET_ABOUT_PAGE_QUERY = gql`
  query Pages {
    pages(contentType: "about.AboutIndexPage") {
      ... on AboutIndexPage {
        heroTitle
        heroImage {
          url
        }
        seoTitle
        url
        description
        missionStatement
        visionStatement
        values {
          ... on ValueCardBlock {
            title
            description
            image {
              url
            }
          }
        }
        stats {
          ... on StatBlock {
            title
            value
          }
        }
        journey {
          ... on JourneyItemBlock {
            title
            description
            year
          }
        }
        callToActionImage {
          url
        }
      }
    }
  }
`;

/**
 * Fetch About page data
 * @returns Promise with AboutIndexPage data
 */
export async function fetchAboutPage(): Promise<AboutIndexPage> {
  try {
    const { data } = await client.query<AboutPageData>({
      query: GET_ABOUT_PAGE_QUERY,
      // Cache for better performance since about page content is relatively static
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    });

    // Find the AboutIndexPage from the pages array
    const aboutPage = data.pages.find(
      (page: any) => page.__typename === "AboutIndexPage"
    );

    if (!aboutPage) {
      console.warn("No About page found"); // Return default data structure
      return {
        heroTitle: "About Us",
        heroImage: { url: "/default-hero.jpg" },
        seoTitle: "About Us",
        url: "/about",
        description: "Learn more about Solomon Airlines",
        missionStatement: "",
        visionStatement: "",
        values: [],
        stats: [],
        journey: [],
        callToActionImage: undefined,
        __typename: "AboutIndexPage",
      };
    }

    return {
      heroTitle: aboutPage.heroTitle || "About Us",
      heroImage: aboutPage.heroImage || { url: "/default-hero.jpg" },
      seoTitle: aboutPage.seoTitle || "About Us",
      url: aboutPage.url || "/about",
      description: aboutPage.description || "Learn more about Solomon Airlines",
      missionStatement: aboutPage.missionStatement || "",
      visionStatement: aboutPage.visionStatement || "",
      values: aboutPage.values || [],
      stats: aboutPage.stats || [],
      journey: aboutPage.journey || [],
      callToActionImage: aboutPage.callToActionImage,
      __typename: "AboutIndexPage",
    };
  } catch (error) {
    console.error("Error fetching About page data:", error); // Return fallback data instead of throwing to prevent page from breaking
    return {
      heroTitle: "About Us",
      heroImage: { url: "/default-hero.jpg" },
      seoTitle: "About Us",
      url: "/about",
      description: "",
      missionStatement: "",
      visionStatement: "",
      values: [],
      stats: [],
      journey: [],
      callToActionImage: undefined,
      __typename: "AboutIndexPage",
    };
  }
}

/**
 * Server-side function to fetch About page data
 * Use this in getStaticProps, getServerSideProps, or server components
 * @returns Promise with AboutIndexPage data
 */
export async function fetchAboutPageServer(): Promise<AboutIndexPage> {
  try {
    const { data } = await client.query<AboutPageData>({
      query: GET_ABOUT_PAGE_QUERY,
      fetchPolicy: "network-only", // Always fetch fresh data on server
      errorPolicy: "all",
    });

    // Find the AboutIndexPage from the pages array
    const aboutPage = data.pages.find(
      (page: any) => page.__typename === "AboutIndexPage"
    );

    if (!aboutPage) {
      console.warn("No About page found on server");
      return {
        heroTitle: "About Us",
        heroImage: { url: "/default-hero.jpg" },
        seoTitle: "About Us",
        url: "/about",
        description: "",
        missionStatement: "",
        visionStatement: "",
        values: [],
        stats: [],
        journey: [],
        callToActionImage: undefined,
        __typename: "AboutIndexPage",
      };
    }

    return {
      heroTitle: aboutPage.heroTitle || "About Us",
      heroImage: aboutPage.heroImage || { url: "/default-hero.jpg" },
      seoTitle: aboutPage.seoTitle || "About Us",
      url: aboutPage.url || "/about",
      description: aboutPage.description || "Learn more about Solomon Airlines",
      missionStatement: aboutPage.missionStatement || "",
      visionStatement: aboutPage.visionStatement || "",
      values: aboutPage.values || [],
      stats: aboutPage.stats || [],
      journey: aboutPage.journey || [],
      callToActionImage: aboutPage.callToActionImage,
      __typename: "AboutIndexPage",
    };
  } catch (error) {
    console.error("Error fetching About page data on server:", error);
    return {
      heroTitle: "About Us",
      heroImage: { url: "/default-hero.jpg" },
      seoTitle: "About Us",
      url: "/about",
      description: "Learn more about Solomon Airlines",
      missionStatement: "",
      visionStatement: "",
      values: [],
      stats: [],
      journey: [],
      callToActionImage: undefined,
      __typename: "AboutIndexPage",
    };
  }
}

// Static fallback data in case of network failures
export const fallbackAboutPage: AboutIndexPage = {
  heroTitle: "About Us",
  heroImage: { url: "/default-hero.jpg" },
  seoTitle: "About Us",
  url: "/about",
  description: "Learn more about Solomon Airlines",
  missionStatement:
    "Our mission is to connect the Solomon Islands through reliable air transport.",
  visionStatement: "To be the leading airline in the Pacific region.",
  values: [
    {
      title: "Safety",
      description: "Safety is our top priority in everything we do.",
      image: { url: "/default-value.jpg" },
    },
    {
      title: "Service",
      description: "We provide exceptional service to our customers.",
      image: { url: "/default-value.jpg" },
    },
  ],
  stats: [
    {
      title: "Years of Service",
      value: "25+",
    },
    {
      title: "Destinations",
      value: "20+",
    },
  ],
  journey: [
    {
      title: "Company Founded",
      description: "Fly Solomons was established to serve the Solomon Islands.",
      year: "1999",
    },
  ],
  callToActionImage: undefined,
  __typename: "AboutIndexPage",
};
