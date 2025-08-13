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

// Interface for Magazine blocks (document, image, or text)
export interface MagazineBlockItem {
  title?: string;
  image?: ImageBlock;
  document?: {
    url: string;
  };
}

// Interface for MagazineBlock
export interface MagazineBlock {
  blocks: MagazineBlockItem[];
}

// Interface for StoryBlock
export interface StoryBlock {
  title: string;
  subtitle: string;
  coverImage: ImageBlock;
  url: string;
}

// Interface for the AboutIndexPage
export interface AboutIndexPage {
  heroTitle: string;
  heroImage: ImageBlock;
  heroVideo: string; // will need storage url
  seoTitle: string;
  subTitle: string;
  url: string;
  description: string;
  missionStatement: string;
  visionStatement: string;
  values: ValueCardBlock[];
  stats: StatBlock[];
  journey: JourneyItemBlock[];
  magazines: MagazineBlock[];
  stories: StoryBlock[];
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
        heroVideo
        seoTitle
        subTitle
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
        magazines {
          ... on MagazineBlock {
            blocks {
              ... on DocumentChooserBlock {
                document {
                  url
                }
              }
              ... on CharBlock {
                value
              }
              ... on ImageChooserBlock {
                image {
                  url
                }
              }
            }
          }
        }
        stories {
          ... on StoryBlock {
            coverImage {
              url
            }
            url
            title
            subtitle
          }
        }
      }
    }
  }
`;

/**
 * Transform magazine blocks to make them more user-friendly
 * Maps 'value' field to 'title' for better readability
 */
function transformMagazineBlocks(magazines: any[]): MagazineBlock[] {
  if (!magazines || !Array.isArray(magazines)) return [];

  return magazines.map((magazine) => ({
    blocks:
      magazine.blocks?.map((block: any) => ({
        title: block.value || undefined, // Map 'value' to 'title'
        image: block.image || undefined,
        document: block.document || undefined,
      })) || [],
  }));
}

/**
 * Fetch About page data
 * @returns Promise with AboutIndexPage data
 */
export async function fetchAboutPage(): Promise<AboutIndexPage> {
  try {
    const { data } = await client.query<AboutPageData>({
      query: GET_ABOUT_PAGE_QUERY,
      // Cache for better performance since about page content is relatively static
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
        heroVideo: "",
        seoTitle: "About Us",
        subTitle: "",
        url: "/about",
        description: "Learn more about Solomon Airlines",
        missionStatement: "",
        visionStatement: "",
        values: [],
        stats: [],
        journey: [],
        magazines: [],
        stories: [],
        callToActionImage: undefined,
        __typename: "AboutIndexPage",
      };
    }

    return {
      heroTitle: aboutPage.heroTitle || "About Us",
      heroImage: aboutPage.heroImage || { url: "/default-hero.jpg" },
      heroVideo: aboutPage.heroVideo || "",
      seoTitle: aboutPage.seoTitle || "About Us",
      subTitle: aboutPage.subTitle || "",
      url: aboutPage.url || "/about",
      description: aboutPage.description || "Learn more about Solomon Airlines",
      missionStatement: aboutPage.missionStatement || "",
      visionStatement: aboutPage.visionStatement || "",
      values: aboutPage.values || [],
      stats: aboutPage.stats || [],
      journey: aboutPage.journey || [],
      magazines: transformMagazineBlocks(aboutPage.magazines),
      stories: aboutPage.stories || [],
      callToActionImage: aboutPage.callToActionImage,
      __typename: "AboutIndexPage",
    };
  } catch (error) {
    console.error("Error fetching About page data:", error); // Return fallback data instead of throwing to prevent page from breaking
    return {
      heroTitle: "About Us",
      heroImage: { url: "/default-hero.jpg" },
      heroVideo: "",
      seoTitle: "About Us",
      subTitle: "",
      url: "/about",
      description: "",
      missionStatement: "",
      visionStatement: "",
      values: [],
      stats: [],
      journey: [],
      magazines: [],
      stories: [],
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
        heroVideo: "",
        seoTitle: "About Us",
        subTitle: "",
        url: "/about",
        description: "",
        missionStatement: "",
        visionStatement: "",
        values: [],
        stats: [],
        journey: [],
        magazines: [],
        stories: [],
        callToActionImage: undefined,
        __typename: "AboutIndexPage",
      };
    }

    return {
      heroTitle: aboutPage.heroTitle || "About Us",
      heroImage: aboutPage.heroImage || { url: "/default-hero.jpg" },
      heroVideo: aboutPage.heroVideo || "",
      seoTitle: aboutPage.seoTitle || "About Us",
      subTitle: aboutPage.subTitle || "",
      url: aboutPage.url || "/about",
      description: aboutPage.description || "Learn more about Solomon Airlines",
      missionStatement: aboutPage.missionStatement || "",
      visionStatement: aboutPage.visionStatement || "",
      values: aboutPage.values || [],
      stats: aboutPage.stats || [],
      journey: aboutPage.journey || [],
      magazines: transformMagazineBlocks(aboutPage.magazines),
      stories: aboutPage.stories || [],
      callToActionImage: aboutPage.callToActionImage,
      __typename: "AboutIndexPage",
    };
  } catch (error) {
    console.error("Error fetching About page data on server:", error);
    return {
      heroTitle: "About Us",
      heroImage: { url: "/default-hero.jpg" },
      heroVideo: "",
      seoTitle: "About Us",
      subTitle: "",
      url: "/about",
      description: "Learn more about Solomon Airlines",
      missionStatement: "",
      visionStatement: "",
      values: [],
      stats: [],
      journey: [],
      magazines: [],
      stories: [],
      callToActionImage: undefined,
      __typename: "AboutIndexPage",
    };
  }
}

// Static fallback data in case of network failures
export const fallbackAboutPage: AboutIndexPage = {
  heroTitle: "About Us",
  heroImage: { url: "/default-hero.jpg" },
  heroVideo: "",
  seoTitle: "About Us",
  subTitle: "",
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
  magazines: [],
  stories: [],
  callToActionImage: undefined,
  __typename: "AboutIndexPage",
};
