import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

// Interface for image objects
export interface ImageBlock {
  url: string;
}

// Interface for MembershipBlock
export interface MembershipBlock {
  title: string;
  price: string;
  features: string; // This is HTML content from RichTextBlock, not an array
}

// Interface for the BelamaIndexPage
export interface BelamaIndexPage {
  heroTitle: string;
  heroImage: ImageBlock;
  seoTitle: string;
  url: string;
  description: string;
  individualMemberships: MembershipBlock[];
  promoImage?: ImageBlock;
  groupMemberships: MembershipBlock[];
  __typename?: string;
}

// Interface for the Belama page query response
export interface BelamaPageData {
  pages: BelamaIndexPage[];
}

export const GET_BELAMA_PAGE_QUERY = gql`
  query Pages {
    pages(contentType: "belama.BelamaIndexPage") {
      ... on BelamaIndexPage {
        heroTitle
        heroImage {
          url
        }
        seoTitle
        url
        description
        individualMemberships {
          ... on MembershipBlock {
            title
            price
            features
          }
        }
        promoImage {
          url
        }
        groupMemberships {
          ... on MembershipBlock {
            title
            price
            features
          }
        }
      }
    }
  }
`;

/**
 * Fetch Belama page data
 * @returns Promise with BelamaIndexPage data
 */
export async function fetchBelamaPage(): Promise<BelamaIndexPage> {
  try {
    const { data } = await client.query<BelamaPageData>({
      query: GET_BELAMA_PAGE_QUERY,
      // Cache for better performance since belama page content is relatively static
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    });

    // Find the BelamaIndexPage from the pages array
    const belamaPage = data.pages.find(
      (page: any) => page.__typename === "BelamaIndexPage"
    );    if (!belamaPage) {
      console.warn("No Belama page found");
      // Return default data structure
      return {
        heroTitle: "Belama",
        heroImage: { url: "/default-hero.jpg" },
        seoTitle: "Belama",
        url: "/belama",
        description: "",
        individualMemberships: [],
        promoImage: { url: "/image.jpg" },
        groupMemberships: [],
        __typename: "BelamaIndexPage",
      };
    }    return {
      heroTitle: belamaPage.heroTitle || "Belama",
      heroImage: belamaPage.heroImage || { url: "/default-hero.jpg" },
      seoTitle: belamaPage.seoTitle || "Belama",
      url: belamaPage.url || "/belama",
      description: belamaPage.description || "",
      individualMemberships: belamaPage.individualMemberships || [],
      promoImage: belamaPage.promoImage || { url: "/image.jpg" },
      groupMemberships: belamaPage.groupMemberships || [],
      __typename: "BelamaIndexPage",
    };
  } catch (error) {    console.error("Error fetching Belama page data:", error);
    // Return fallback data instead of throwing to prevent page from breaking
    return {
      heroTitle: "Belama",
      heroImage: { url: "/default-hero.jpg" },
      seoTitle: "Belama",
      url: "/belama",
      description: "",
      individualMemberships: [],
      promoImage: { url: "/image.jpg" },
      groupMemberships: [],
      __typename: "BelamaIndexPage",
    };
  }
}

/**
 * Hook for using Belama page data in React components
 * You can expand this to use React Query or SWR for better state management
 */
export function useBelamaPage() {
  // This is a basic implementation - you might want to use React Query or SWR
  // for better caching, loading states, and error handling
  return {
    fetchBelamaPage,
  };
}
