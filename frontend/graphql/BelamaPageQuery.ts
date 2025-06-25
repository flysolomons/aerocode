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
  subTitle: string;
  url: string;
  description: string;
  individualMemberships: MembershipBlock[];
  promoImage?: ImageBlock;
  groupMemberships: MembershipBlock[];
  __typename?: string;
}

export interface BelamaSignUpPage{
  heroTitle: string;
  heroImage: ImageBlock;
  seoTitle: string;
  subTitle: string;
  url: string;
  description: string;
  __typename?: string;
}

// Interface for the Belama page query response
export interface BelamaPageData {
  pages: BelamaIndexPage[];
}

export interface BelamaSignUpPageData{
  pages: BelamaSignUpPage[];
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
        subTitle
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

export const GET_BELAMA_SIGN_UP_PAGE_QUERY = gql`
query Pages {
  pages(contentType: "belama.BelamaSignUpPage") {
    ... on BelamaSignUpPage {
      heroTitle
        heroImage {
          url
        }
        seoTitle
        subTitle
        url
        description
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
    );
    if (!belamaPage) {
      console.warn("No Belama page found");
      // Return default data structure
      return {
        heroTitle: "Belama",
        heroImage: { url: "/default-hero.jpg" },
        seoTitle: "Belama",
        subTitle: "",
        url: "/belama",
        description: "",
        individualMemberships: [],
        promoImage: { url: "/image.jpg" },
        groupMemberships: [],
        __typename: "BelamaIndexPage",
      };
    }
    return {
      heroTitle: belamaPage.heroTitle || "Belama",
      heroImage: belamaPage.heroImage || { url: "/default-hero.jpg" },
      seoTitle: belamaPage.seoTitle || "Belama",
      subTitle: belamaPage.subTitle || "",
      url: belamaPage.url || "/belama",
      description: belamaPage.description || "",
      individualMemberships: belamaPage.individualMemberships || [],
      promoImage: belamaPage.promoImage || { url: "/image.jpg" },
      groupMemberships: belamaPage.groupMemberships || [],
      __typename: "BelamaIndexPage",
    };
  } catch (error) {
    console.error("Error fetching Belama page data:", error);
    // Return fallback data instead of throwing to prevent page from breaking
    return {
      heroTitle: "Belama",
      heroImage: { url: "/default-hero.jpg" },
      seoTitle: "Belama",
      subTitle: "",
      url: "/belama",
      description: "",
      individualMemberships: [],
      promoImage: { url: "/image.jpg" },
      groupMemberships: [],
      __typename: "BelamaIndexPage",
    };
  }
}


export async function fetchBelamaSignUpPage(): Promise<BelamaSignUpPage> {
  try {
    const { data } = await client.query<BelamaSignUpPageData>({
      query: GET_BELAMA_SIGN_UP_PAGE_QUERY,
      // Cache for better performance since belama page content is relatively static
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    });

    // Find the BelamaIndexPage from the pages array
    const belamaPage = data.pages.find(
      (page: any) => page.__typename === "BelamaSignUpPage"
    );
    if (!belamaPage) {
      console.warn("No Belama signup page found");
      // Return default data structure
      return {
        heroTitle: "Belama",
        heroImage: { url: "/default-hero.jpg" },
        seoTitle: "Belama",
        subTitle: "",
        url: "/belama/sign-up",
        description: "",
        
      };
    }
    return {
      heroTitle: belamaPage.heroTitle || "Belama Sign Up",
      heroImage: belamaPage.heroImage || { url: "/default-hero.jpg" },
      seoTitle: belamaPage.seoTitle || "Belama Sign Up",
      subTitle: belamaPage.subTitle || "",
      url: belamaPage.url || "/belama",
      description: belamaPage.description || "",
      __typename: "BelamaSignUpPage",
    };
  } catch (error) {
    console.error("Error fetching Belama page data:", error);
    // Return fallback data instead of throwing to prevent page from breaking
    return {
      heroTitle: "Belama Sign Up",
      heroImage: { url: "/default-hero.jpg" },
      seoTitle: "Belama Sign Up",
      subTitle: "",
      url: "/belama/sign-up",
      description: "",
      __typename: "BelamaSignUpPage",
    };
  }
}

/**
 * Hook for using Belama page data in React components
 * You can expand this to use React Query or SWR for better state management
 */
export function useBelamaPage() {
  // Implementation would go here for client-side data fetching
  // This is a placeholder for future enhancement
}
